import Vue from 'vue'
import api from '@/api'
import internalRoutes from '@/router/internal-routes'
import defaultPage from '@/store/defaults/page'
import { clone, kebabToCamel } from '@/util'
import Cookies from 'js-cookie'
import MobileScreenSavedSearches from '@/components/ui/mobile-screens/MobileScreenSavedSearches'
import MobileScreenPopularSearches from '@/components/ui/mobile-screens/MobileScreenPopularSearches'

const popsicle = require('popsicle')

function callApi (method, state, success) {
  return new Promise((resolve, reject) => {
    api[method](state).then(response => {
      if (response.body.error) {
        console.warn(response.body)
        reject(response.body)
      } else {
        success(response.body)
        resolve(response.body)
      }
    }).catch(err => {
      console.warn(err)
      reject(err)
    })
  })
}

export default {
  fetchConfig ({ state, commit }) {
    return Promise.all([
      api.getConfig(state),
      api.getComponent(state, 'Search')
    ]).then(([config, gusConfig]) => {
      delete config.body.auth0
      delete config.body.clientAuth0
      commit('MERGE_CONFIG', {...config.body, gus: gusConfig.body})
    })
  },

  fetchProfile ({ state, commit }) {
    const { spaceID, gusUrl, clientIdToken, sources } = state.config
    let boardId = sources[0]
    const url = gusUrl + `space/${spaceID}/profile/${boardId}?termsAgreement=false`

    let headers = { Accept: 'application/json' }
    if (clientIdToken) headers.token = clientIdToken
    popsicle.get({
      url,
      headers
    })
    .use(popsicle.plugins.parse('json'))
    .then(res => {
      if (res.status !== 200) {
        console.warn('Error')
        return
      }
      commit('setRemoteProfile', res.body)
    })
    .catch(err => {
      console.warn(err)
    })
  },

  fetchRedformsUrl ({ state, commit }) {
    const { spaceID, grandcentralUrl } = state.config
    const currentAgent = state.agents.find(r => r.uid === state.currentAgent)
    const uid = currentAgent.uid

    const url = grandcentralUrl + `space/${spaceID}/app/redforms/${uid}/redirectUrl`

    popsicle.get({
      url,
      headers: {
        Accept: 'application/json'
      }
    })
    .use(popsicle.plugins.parse('json'))
    .then(res => {
      if (res.status !== 200) {
        console.warn('Error')
        return
      }

      commit('SET_REDFORMS_URL', res.body.loginUrl)
    })
    .catch(err => {
      console.warn(err)
    })
  },

  fetchWebsite ({ state, commit }) {
    return callApi('getWebsite', state, body => {
      commit('SET_WEBSITE', body)
    })
  },

  fetchGusSearchComponentConfig ({ state, commit }) {
    return callApi('getComponent', 'gus-search', body => {
      commit('MERGE_GUS_CONFIG', body)
    })
  },

  fetchHeader ({ state, commit }) {
    return api.getHeader(state).then(response => {
      commit('SET_HEADER', response.body)
    })
  },

  fetchFooter ({ state, commit }) {
    return api.getFooter(state).then(response => {
      commit('SET_FOOTER', response.body)
    })
  },

  fetchPage ({ state, commit }) {
    let pageID = state.config.pageID
    console.log(pageID)

    let promise = false

    if (pageID === 'access') {
      const adminPage = defaultPage('access', true)
      adminPage.metaInfo.title = 'Realtor Login'

      commit('SET_PAGE', adminPage)
      return
    }

    if (internalRoutes.isInternal(pageID)) {
      commit('SET_PAGE', defaultPage(pageID, true))
      return
    }

    if (state.dev && process.browser) {
      promise = api.getPageLocal(state, pageID)
    } else {
      promise = api.getPage(state, pageID)
    }

    return promise.then(response => {
      if (response === undefined || response.body === undefined) {
        commit('SET_ERROR_PAGE', { error: 'Page not found.', code: 404 })
        return
      }

      commit('SET_PAGE', response.body)
    }).catch(error => {
      commit('SET_ERROR_PAGE', { error, code: 404 })
    })
  },

  deletePage ({ state, commit }, pageID) {
    commit('HIDE_EDIT_COMPONENT')

    if (state.dev && process.browser) {
      return api.deletePageLocal(state, pageID)
    }

    return api.deletePage(state, pageID)
  },

  fetchPages ({ state }) {
    if (state.dev && process.browser) {
      return api.getPagesLocal(state)
    }

    return api.getPages(state)
  },

  setState ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')

    commit('SET_WEBSITE', payload.website)
    dispatch('setHeader', payload.header)
    dispatch('setFooter', payload.footer)

    return true
  },

  setTheme ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')
    commit('SET_THEME', payload)
  },

  setPage ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')
    commit('SET_PAGE', payload)

    return true
  },

  setHeader ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')

    const lastHeader = state.header.name
    const thisHeader = payload.name

    if (thisHeader !== lastHeader) {
      const name = kebabToCamel(thisHeader)

      // Set new headers initial state
      return import(`../components/headers/${name}.vue`).then(component => {
        payload.state = component.default.initialState(payload, state)
        commit('SET_HEADER', payload)
      }).catch(e => {
        console.warn(e)
      })
    } else {
      commit('SET_HEADER', payload)
    }

    return true
  },

  setHeaderNav ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')
    commit('SET_HEADER_NAV', payload)
    return true
  },

  setFooter ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')

    const lastFooter = state.footer.name
    const thisFooter = payload.name

    if (thisFooter !== lastFooter) {
      const name = kebabToCamel(thisFooter)

      // Set new footers initial state
      return import(`../components/footers/${name}.vue`).then(component => {
        payload.state = component.default.initialState(payload, state)
        commit('SET_FOOTER', payload)
      }).catch(e => {
        console.warn(e)
      })
    } else {
      commit('SET_FOOTER', payload)
    }

    return true
  },

  setFooterNav ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')
    commit('SET_FOOTER_NAV', payload)
    return true
  },

  fetchAgents ({ state, commit }) {
    return api.getAgents(state).then(response => {
      const agents = response.body.rows.map(agent => {
        return {
          ...agent.doc
        }
      })

      commit('SET_CURRENT_AGENT', agents[0].uid)
      commit('SET_AGENTS', agents)
    }).catch(e => {
      console.warn(e)
    })
  },

  savePage ({ state, commit, dispatch }, router) {
    const pageID = state.page.slug
    const lastID = state.last.page.slug
    const slugChanged = lastID !== pageID

    if (process.browser) {
      this.trigger('savePage')
    }

    let hasError = false

    const error = err => {
      hasError = true

      console.warn(err)
      dispatch('showNotification', { message: 'Error saving page: ' + err.message, type: 'error' })
    }

    const done = () => {
      const last = {
        page: clone(state.page),
        header: clone(state.header),
        footer: clone(state.footer),
        website: clone(state.website)
      }

      if (slugChanged) {
        // router.push({ path: pageID })
        if (lastID !== 'index') {
          dispatch('deletePage', lastID).then(() => {
            if (process.browser) {
              window.location.href = window.location.origin + '/' + pageID
            }
          })
        } else {
          if (process.browser) {
            window.location.href = window.location.origin
          }
        }
      }

      commit('SET_LAST', last)

      Vue.nextTick(() => {
        commit('SET_CLEAN')
        commit('HIDE_EDIT_COMPONENT')

        if (!hasError) dispatch('showNotification', { message: 'Page saved!' })
      })
    }

    if (state.dev && process.browser) {
      const promises = [
        api.setWebsiteLocal(state).catch(error),
        api.setHeaderLocal(state).catch(error),
        api.setFooterLocal(state).catch(error)
      ]

      if (!internalRoutes.isInternal(pageID)) {
        promises.push(
          api.setPageLocal(state, pageID, state.page).catch(error)
        )
      }

      return Promise.all(promises).then(response => {
        done(response)
      }).catch(err => {
        error(err)
      })
    }

    const promises = [
      api.putWebsite(state).catch(error),
      api.putHeader(state).catch(error),
      api.putFooter(state).catch(error)
    ]

    if (!internalRoutes.isInternal(pageID)) {
      promises.push(
        api.putPage(state, pageID, state.page).catch(error)
      )
    }

    return Promise.all(promises).then(responses => {
      responses.forEach(res => {
        const body = JSON.parse(res.body)
        if (body.error) error(body)
      })
      return api.invalidateCache(state, pageID)
    }).then(response => {
      done(response)
    }).catch(err => {
      error(err)
    })
  },

  newPage ({ state, commit }, { pageID, page }) {
    if (state.dev && process.browser) {
      return api.setPageLocal(state, pageID, page)
    }

    return api.putPage(state, pageID, page).then(response => {
      return api.invalidateCache(state, pageID)
    })
  },

  duplicatePage ({ state, commit }, { pageID, page }) {
    if (state.dev && process.browser) {
      return api.setPageLocal(state, pageID, page)
    }

    return api.putPage(state, pageID, page).then(response => {
      return api.invalidateCache(state, pageID)
    })
  },

  async startEditing ({ state, commit }, silent) {
    if (!state.dirty) {
      const last = {
        page: clone(state.page),
        header: clone(state.header),
        footer: clone(state.footer),
        website: clone(state.website)
      }
      commit('SET_LAST', last)
      commit('SET_DIRTY')
      if (window && window.location.host !== 'localhost:8080') {
        // get the current page from the api, to ensure complete doc
        await api.getPage(state, state.page.slug).then(response => {
          // this is the page response.body
          commit('SET_PAGE', response.body)
          commit('SET_EDITING', true)

        })
        return true
      }
    }


    if (!silent) {
      const last = {
        page: clone(state.page),
        header: clone(state.header),
        footer: clone(state.footer),
        website: clone(state.website)
      }
      commit('SET_LAST', last)
      commit('SET_DIRTY')
    }

    commit('SET_EDITING', true)

    return true
  },

  stopEditing ({ state, commit }) {
    commit('SET_EDITING', false)
    commit('HIDE_EDIT_COMPONENT')

    return true
  },

  revertEdit ({ state, commit }) {
    commit('SET_PAGE', state.last.page)
    commit('SET_HEADER', state.last.header)
    commit('SET_FOOTER', state.last.footer)
    commit('SET_WEBSITE', state.last.website)
    commit('HIDE_EDIT_COMPONENT')
    commit('SET_CLEAN')

    return true
  },

  async setStrap ({ state, commit, dispatch }, payload) {
    await dispatch('startEditing')
    commit('SET_STRAP', payload)

    return true
  },

  newStrap ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')
    commit('HIDE_EDIT_COMPONENT')

    // Convert strap name to component file name
    const parts = payload.name.split('-')
    parts.forEach((p, i) => {
      parts[i] = p[0].toUpperCase() + p.substring(1)
    })
    const name = parts.join('')

    // Set new straps initial state
    return import(`../components/straps/${name}.vue`).then(component => {
      payload.state = component.default.initialState(payload, state)
      commit('SET_STRAP', payload)
    }).catch(e => {
      console.warn(e)
    })
  },

  insertStrap ({ state, commit, dispatch }, payload) {
    dispatch('startEditing')
    commit('HIDE_EDIT_COMPONENT')

    // Reorder existing straps
    state.page.straps.forEach(strap => {
      if (strap.order >= payload.order) {
        strap.order++
        commit('SET_STRAP', strap)
      }
    })

    return dispatch('newStrap', payload)
  },

  deleteStrap ({ state, commit, dispatch }, strapID) {
    dispatch('startEditing')
    commit('HIDE_EDIT_COMPONENT')

    const straps = state.page.straps
    const strap = straps.find(s => s.id === strapID)
    if (!strap) return false

    const index = straps.indexOf(strap)
    straps.splice(index, 1)

    straps.forEach(s => {
      if (s.order > strap.order) {
        s.order--
        commit('SET_STRAP', s)
      }
    })

    return true
  },

  moveStrapUp ({ state, commit, dispatch }, strapID) {
    const straps = state.page.straps
    const strap = straps.find(s => s.id === strapID)

    if (!strap) return false
    if (straps.length === 1 || strap.order === 0) return false

    const otherStrap = straps.find(s => s.order === strap.order - 1)
    if (!otherStrap) return false

    dispatch('startEditing')

    strap.order--
    otherStrap.order++

    commit('SET_STRAP', strap)
    commit('SET_STRAP', otherStrap)
    commit('HIDE_EDIT_COMPONENT')
  },

  moveStrapDown ({ state, commit, dispatch }, strapID) {
    const straps = state.page.straps
    const strap = straps.find(s => s.id === strapID)

    if (!strap) return false
    if (straps.length === 1 || strap.order === straps.length - 1) return false

    const otherStrap = straps.find(s => s.order === strap.order + 1)
    if (!otherStrap) return false

    dispatch('startEditing')

    strap.order++
    otherStrap.order--

    commit('SET_STRAP', strap)
    commit('SET_STRAP', otherStrap)
    commit('HIDE_EDIT_COMPONENT')
  },

  // Admin auth

  handleAuth ({ state, commit }, payload) {
    const { authResult, err } = payload

    if (!authResult || err) {
      commit('SET_ID_TOKEN', null)
      return false
    }

    commit('SET_ID_TOKEN', authResult.id_token)

    return true
  },

  login ({ state }) {
    localStorage.setItem('authNamespace', 'agent')

    state.auth.login()

    return true
  },

  logout ({ state }) {
    state.auth.logout()

    return true
  },

  clearClientAuth ({ commit, state }) {
    commit('CLEAR_CLIENT_ID')
    Cookies.remove('idToken')

    if (state.gus) {
      commit('clearGusUser')
    }
  },

  navigateBack ({ state }) {
    const sameDomain = document.referrer.includes(location.host)

    if (sameDomain) {
      history.go(-1);
      return
    }

    const origin = window.location.origin
    const pageType = state.pageType

    if (pageType === 'details') {
      window.location.assign(origin + '/search')
    } else {
      window.location.assign(origin)
    }
  },

  mobileSaveSearch ({ state, getters, dispatch }) {
    const name = prompt('Name your saved search.', getters.uniqueSavedSearchTitle())

    function checkSavedSearchName (name) {
      if (!name) {
        return 'Name cannot be empty.'
      }
      if (
        state.gus.saved &&
        state.gus.saved.find(save => save.name === name)
      ) {
        return 'Search with this name already exists.'
      }
      return false
    }
    const error = checkSavedSearchName(name)

    if (error) {
      return alert(error)
    }

    dispatch('saveSearch', name)
  },

  mobileOpenPopularSearches ({ state, commit }) {
    commit('SHOW_MOBILE_SCREEN', {
      component: MobileScreenPopularSearches
    })
  },

  mobileOpenPreviousSearches ({ state, commit }) {
    commit('SHOW_MOBILE_SCREEN', {
      component: MobileScreenSavedSearches
    })
  },

  // Custom events

  attachPageAPI ({ state }, payload) {
    Vue.set(state, 'pageAPI', payload)
  },

  triggerCustomEvent ({ state, commit }, { eventName, data }) {
    const page = this.state.pageAPI
    const event = new CustomEvent(eventName, {
      detail: {
        data,
        page
      }
    })
    window.dispatchEvent(event)
  }
}
