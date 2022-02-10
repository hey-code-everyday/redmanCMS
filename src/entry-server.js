import Vue from 'vue'
import createApp from './main'
import createStore from './store'
import createRouter from './router'
import defaultErrorPage from './store/defaults/error-page'
import defaultConfig from './store/defaults/config'
import migrate from './migrations'
import Prefetch from './plugins/prefetch'
import {getSlug} from './helpers/get-page-id'
import { parseBlogUrl } from '@/helpers/blog'
import url from 'url'
import createSearchStore from './modules/listing-search/store'

const cookie = require('cookie-parse')

Vue.use(Prefetch)

require('jsdom-global')()

function bigLog (requestID, title, out, color) {
  // console.log('')
  // console.log(chalk[color](`/////////// ${title.toUpperCase()} ///////////`))
  console.log(requestID, out)
  // console.log('')
}

export default function (context) {
  return new Promise((resolve, reject) => {
    if (context.setup.url) context.setup.requestUrl = context.setup.url

    // Gather config
    const config = Object.assign(defaultConfig(context.setup.requestUrl.includes('localhost')), context.setup)
    config.sources = []

    // Setup router
    const router = createRouter(config)

    let path = context.setup.requestUrl.replace(/http[s]*:\/\//g, '').split('/')
    path = path.splice(0, 1)
    path = path.join('')

    if (path) router.push('/' + path)

    // Setup store
    const store = createStore(config, router)
    const { dispatch, commit } = store

    commit('SET_REQUEST', context.setup.requestHeaders)

    // Fetch configuration
    Promise.all([
      dispatch('fetchConfig'), // gc config
      dispatch('fetchWebsite'), // gc componentConfig
      dispatch('fetchAgents') // gc agents
    ])
    .catch(e => {
      bigLog(context.requestID, 'Error fetching config/website', e, 'redBright')
      reject(e)
    })
    .then(() => {
      // Client ID Token
      if (context.setup.requestHeaders && context.setup.requestHeaders.cookie) {
        const params = cookie.parse(context.setup.requestHeaders.cookie)
        Vue.set(store.state.config, 'clientIdToken', params.idToken)
      }

      // Fetch content
      return Promise.all([
        dispatch('fetchHeader'), // gc header
        dispatch('fetchFooter'), // gc footer
        dispatch('fetchRedformsUrl'),
        dispatch('fetchProfile') // user profile
      ]).catch(e => {
        bigLog(context.requestID, 'Error fetching header/footer', e, 'redBright')
        reject(e)
      })
    })
    .then(() => {
      // Check routes
      const requestUrl = store.state.config.requestUrl
      const blogUrl = parseBlogUrl(requestUrl)

      let { search, pathname } = url.parse(requestUrl)
      if (search === null) search = ''
      router.replace(pathname + search)

      if (pathname === '/index') {
        store.commit('SET_PAGE_ID', '404')
       } else if (router.currentRoute.meta.pageID === 'index') {
        store.commit('SET_PAGE_ID', 'index')
      } else if (blogUrl.slug === 'blog' && blogUrl.postID) {
        store.commit('SET_PAGE_ID', 'blog-post')
      } else if (router.currentRoute.meta.pageID) {
        store.commit('SET_PAGE_ID', router.currentRoute.meta.pageID)
      } else {
        store.commit('SET_PAGE_ID', getSlug(pathname))
      }

      return dispatch('fetchPage').catch(e => {
        bigLog(context.requestID, 'Error fetching page', e, 'redBright')
        commit('SET_PAGE', defaultErrorPage(e, 404))
        // reject(e)
      })
    })
    .then(() => {
      return createSearchStore(store)
    })
    .then(() => {
      // Migrations
      if (store.state.page.error) {
        if (!store.state.page.statusCode) {
          commit('SET_PAGE', defaultErrorPage('The page you are looking for could not be found.', 404))
        } else {
          commit('SET_PAGE', defaultErrorPage(store.state.page.message, store.state.page.statusCode))
        }
      } else {
        store.replaceState(migrate(store.state))
      }

      // Prefetch component data
      Vue.$prefetch(store).then(() => {
        // Mount app
        createApp(store, router, context).then(app => {
          resolve(app)
        }).catch(e => {
          bigLog(context.requestID, 'Error rendering app', e, 'redBright')
          reject(e)
        })
      })
    })
  })
}
