import Vue from 'vue'
import Cookies from 'js-cookie'
import api from './api'
import createApp from './main'
import createStore from './store'
import createRouter from './router'
import defaultConfig from './store/defaults/config'
import defaultWebsite from './store/defaults/website'
import defaultPage from './store/defaults/page'
import pkg from '../package.json'
import migrate from './migrations'
import deepmerge from 'deepmerge'
import Prefetch from './plugins/prefetch'
import { getSlug } from './helpers/get-page-id'
import { parseBlogUrl } from '@/helpers/blog'
import createSearchStore from './modules/listing-search/store'
import storeBindings from './modules/listing-search/storeBindings'
import loginActionStorage from './helpers/loginActionStorage'

Vue.use(Prefetch)

// Clean state
if (window.__PHOENIX__) {
  // admin
  delete window.__PHOENIX__.auth
  delete window.__PHOENIX__.config.idToken
  // client
  delete window.__PHOENIX__.clientAuth
  delete window.__PHOENIX__.config.clientIdToken
}

// Gather config
const defaults = defaultConfig(window.location.href.includes('localhost'))
if (window.__PHOENIX__) {
  defaults.sources = []
}

const config = deepmerge(
  defaults,
  (window.__PHOENIX__ ? window.__PHOENIX__.config : {})
)

// Setup router
const hash = window.location.hash
const router = createRouter(config)

// Setup store
const store = createStore(config, router)

const clientIdToken = Cookies.get('idToken')
if (clientIdToken) {
  Vue.set(store.state.config, 'clientIdToken', clientIdToken)
}

async function init () {
  // SSR Setup
  if (window.__PHOENIX__) {
    const { idToken, clientIdToken } = store.state.config

    for (let key in window.__PHOENIX__) {
      Vue.set(store.state, key, window.__PHOENIX__[key])
    }

    const requestUrl = store.state.config.requestUrl
    const url = new URL(requestUrl)
    const blogUrl = parseBlogUrl(requestUrl)

    router.replace((url.pathname === '/index' ? '/' : url.pathname) + url.search + hash)

    //handles if there is a #map anchor tag
    if (hash === '#map') {
      localStorage.setItem('setAnchor', 'map')
    }

    if (blogUrl.slug === 'blog' && blogUrl.postID) {
      store.commit('SET_PAGE_ID', 'blog-post')
    } else if (router.currentRoute.meta.pageID) {
      store.commit('SET_PAGE_ID', router.currentRoute.meta.pageID)
    } else {
      store.commit('SET_PAGE_ID', getSlug(url.pathname))
    }

    Vue.set(store.state.config, 'idToken', idToken)
    Vue.set(store.state.config, 'clientIdToken', clientIdToken)

    // more direct way to do this because state will be replaced?
    await createSearchStore(store)

  // Local setup
  } else {
    store.state.config.requestUrl = window.location.href

    const requestUrl = store.state.config.requestUrl
    const blogUrl = parseBlogUrl(requestUrl)

    // Figure out PageID
    router.replace(window.location.pathname + window.location.search + hash)

    //handles if there is a #map anchor tag
    if (hash === '#map') {
      localStorage.setItem('setAnchor', 'map')
    }

    if (blogUrl.slug === 'blog' && blogUrl.postID) {
      store.commit('SET_PAGE_ID', 'blog-post')
    } else if (router.currentRoute.meta.pageID) {
      store.commit('SET_PAGE_ID', router.currentRoute.meta.pageID)
    } else {
      store.commit('SET_PAGE_ID', getSlug(window.location.pathname))
    }

    const state = await api.getStateLocal(store.state)
    state.website = Object.assign(defaultWebsite(), state.website)

    // Merge state
    store.commit('MERGE_STATE', state)

    // Redforms URL
    store.dispatch('fetchRedformsUrl')

    const page = store.getters.isCmsPage
      ? await api.getPageLocal(store.state, store.state.config.pageID)
      : await defaultPage()

    await createSearchStore(store)

    if (page === undefined) {
      store.commit('SET_ERROR_PAGE', { error: 'Page not found.', code: 404 })
    } else {
      store.commit('SET_PAGE', page)
    }

    // Migrations
    store.replaceState(migrate(store.state))

    // Prefetch data
    await Vue.$prefetch(store)
  }

  // finalize
  store.state.config.version = pkg.version
  const app = await createApp(store, router)
  await app.$mount('#phoenix')

  storeBindings(store)

  const {clientIdToken} = store.state.config

  if (clientIdToken && store.state.gus) {
    store.dispatch('syncNagData', clientIdToken)
    await store.dispatch('getUserInfo', clientIdToken)
    loginActionStorage.onLogin(store)
  }
  window.__app = app
  return app
}
init()

window.store = store

// Dev hooks
if (store.state.dev) {
  window.phoenix = {
    store,
    router,
    toggleEdit () {
      store.commit('TOGGLE_EDITING')
    }
  }
}
