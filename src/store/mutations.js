import Vue from 'vue'
import createErrorPage from './defaults/error-page'
import deepmerge from 'deepmerge'
import { interpolateMetaTitle } from '@/helpers/interpolateMetaTitle'

export default {
  MERGE_STATE (state, payload) {
    Object.assign(state, payload)
  },

  MERGE_CONFIG (state, payload) {
    const merged = deepmerge(state.config, payload)
    Vue.set(state, 'config', merged)
  },

  SET_STATE (state, payload) {
    for (let key in payload) {
      Vue.set(state, key, payload[key])
    }
  },

  SET_REQUEST (state, payload) {
    Vue.set(state, 'request', payload)
  },

  SET_REDFORMS_URL (state, payload) {
    Vue.set(state.config, 'redformsUrl', payload)
  },

  SET_WEBSITE (state, payload) {
    Vue.set(state, 'website', payload)
  },

  SET_THEME (state, { palette, theme }) {
    if (palette === 'header') {
      Vue.set(state.website.theme, 'header', theme)
    } else {
      Vue.set(state.website.theme.straps, palette, theme)
    }
  },

  SET_HEADER (state, payload) {
    Vue.set(state, 'header', payload)
  },

  SET_HEADER_NAV (state, payload) {
    Vue.set(state.header, 'nav', payload)
  },

  SET_FOOTER (state, payload) {
    Vue.set(state, 'footer', payload)
  },

  SET_FOOTER_NAV (state, payload) {
    Vue.set(state.footer, 'nav', payload)
  },

  SET_PAGE (state, payload) {
    payload.metaInfo.title = interpolateMetaTitle(payload.metaInfo.title, state)
    Vue.set(state, 'page', payload)
  },

  SET_ERROR_PAGE (state, { error, code }) {
    const page = {
      ...createErrorPage(error, code)
    }
    Vue.set(state, 'page', page)
  },

  SET_PAGE_ID (state, payload) {
    state.config.pageID = payload
  },

  SET_AGENTS (state, payload) {
    Vue.set(state, 'agents', payload)
  },

  SET_CURRENT_AGENT  (state, payload) {
    state.currentAgent = payload
  },

  SET_STRAP (state, payload) {
    if (payload.id === 'hero') {
      Vue.set(state.page, 'hero', payload)
    } else {
      const strapIndex = state.page.straps.findIndex(s => s.id === payload.id)
      if (strapIndex === -1) state.page.straps.push(payload)
      else state.page.straps.splice(strapIndex, 1, payload)
    }
  },

  SET_HEADER_META (state, payload) {
    Vue.set(state, 'headerMeta', payload)
  },

  SET_FOOTER_META (state, payload) {
    Vue.set(state, 'footerMeta', payload)
  },

  SET_PAGE_TYPE (state, payload) {
    Vue.set(state, 'pageType', payload)
  },

  // Editor

  SET_EDITING (state, payload) {
    state.editing = payload
  },

  TOGGLE_EDITING (state, payload) {
    if (state.editing) state.editing = false
    else state.editing = true
  },

  SET_LAST (state, payload) {
    Vue.set(state, 'last', payload)
  },

  SET_DIRTY (state) {
    state.dirty = true
  },

  SET_CLEAN (state) {
    state.dirty = false
  },

  // SSR prefetching

  SET_PREFETCHED_DATA (state, payload) {
    Vue.set(state.prefetchedData, payload.id, payload.data)
  },

  SET_PREFETCHED_ERROR (state, payload) {
    Vue.set(state.prefetchedData, payload.id, {
      error: payload.error
    })
  },

  // Admin auth

  SET_ID_TOKEN (state, payload) {
    state.config.idToken = payload
  },

  SET_AUTH (state, payload) {
    state.auth = payload
  },

  // Client auth

  SET_CLIENT_ID_TOKEN (state, payload) {
    state.config.clientIdToken = payload
  },

  SET_CLIENT_AUTH (state, payload) {
    state.clientAuth = payload
  },

  SET_CLIENT_FAVORITES (state, payload) {
    if (payload instanceof Array) {
      Vue.set(state.client, 'favorites', payload)
    }
  },

  ADD_CLIENT_FAVORITE (state, payload) {
    if (state.client.favorites instanceof Array) {
      state.client.favorites.push(payload)
    }
  },

  REMOVE_CLIENT_FAVORITE (state, payload) {
    if (!state.client.favorites) return

    if (state.client.favorites instanceof Array) {
      const index = state.client.favorites.indexOf(payload)
      state.client.favorites.splice(index, 1)
    }
  },

  SHOW_AUTH (state) {
    if (state.config.pageID === 'access') return
    state.ui.authVisible = true
  },

  HIDE_AUTH (state) {
    state.ui.authVisible = false
  },

  CLEAR_CLIENT_ID (state, payload) {
    state.config.clientIdToken = ''
  }
}
