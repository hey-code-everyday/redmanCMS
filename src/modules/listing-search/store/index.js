// @flow

import Vue from 'vue'
import Vuex from 'vuex'

import {search, getByMls} from '../api'
import actions from './actions'
import getters from './getters'
import metaGetters from './metaGetters'
import mutations from './mutations'
import getSetupTasks from './getSetupTasks'
import {decodeUrl, encodeUrl} from './url'
import {requestMapPosition, requestMapMarkers, customPolygon, mapState, nextZoom} from './map'
import StateT from './stateShape'

Vue.use(Vuex)

function createModule (initialState: StateT) {
  if (!initialState) throw new Error('Cannot create store from empty initial state. Use populateStore to create from request parameters')

  return {
    state: initialState,

    getters: {
      mapState,
      nextZoom,
      encodeUrl,
      ...getters,
      ...metaGetters
    },

    mutations,

    actions: {
      openPanel: ({state, commit}, panel) => {
        if (state.panel === panel) {
          commit('closePanel')
        } else {
          commit('openPanel', panel)
        }
      },

      submit: ({state, commit, dispatch}, page) => {
        if (state.map.positionLoadState) {
          if (state.map.realPosition) {
            state.map.realPosition.zoom = state.config.map.zoomToDoSearch
          }
          dispatch('requestMapMarkers', state.map.realPosition)
        }

        commit('searchRequest')
        return search(state, page).then(res => {
          commit('searchResponse', {res, page})
        }).catch(e => dispatch('notify', 'Unable to get properties'))
      },

      openSavedSearch: ({dispatch}, id) => {
        dispatch('getSavedFilters', id).then(() => {
          dispatch('submit')
        })
      },

      maybeAutocomplete: ({state, commit, dispatch}, searchString) => {
        if (searchString.length > 3) {
          dispatch('autocomplete', searchString)
        } else {
          commit('clearAutocompleteResults')
        }
      },

      fetchProperties: ({state, commit, dispatch}, mls) => {
        state.map.markersLoadState = 1
        return getByMls(state, mls).then(properties => {
          state.map.markersLoadState = 2
          properties.forEach(property => {
            const i = state.map.markers.findIndex(marker =>
              marker._id === property._id
            )
            state.map.markers.splice(i, 1, property)
          })
          return properties
        })
      },

      requestMapPosition,
      requestMapMarkers,
      customPolygon,

      notify: ({commit}, message) => {
        const NOTIFCATION_TIME = 10000
        const id = String(Date.now())
        commit('addAlert', {message, id})

        setTimeout(() =>
          commit('expireAlert', id)
        , NOTIFCATION_TIME)
      },

      ...actions
    }
  }
}

export default function populateStore (store: Object) {
  const {clientIdToken, config} = store.state
  const requestUrl = config.requestUrl
  const gusConfig = config.gus
  const currentGusState = store.state.gus

  const constants = {
    autocompleteWaiting: false,
    autocompleteResults: [],
    panel: null,
    isAdvancedSearch: false,
    anchor: null, // the part of the URL following #:

    filters: {},
    geo: null,
    sort: gusConfig.defaultSort,

    searchWaiting: false,
    searchResults: [],
    searchResultsDisclaimer: '',
    totalSearchResults: 0,
    totalListingCount: 0,
    page: 0,
    preconfiguredSearch: null,

    lock: false,
    idToken: clientIdToken,
    userLoadState: 0, // 0: not loaded, 1: loading, 2: loaded
    faves: null,
    saved: null,
    savedSearch: null, // an individual saved search to attempt to load

    lastUpdate: null,

    mapLoaded: false,
    map: {
      positionLoadState: 0,
      userRequestedPosition: null,
      realPosition: null,
      markersLoadState: 0,
      markers: null,
      openMarker: null,
      drawMode: false
    },

    notifications: [],

    config: {
      ...gusConfig,
      sources: config.sources,
      autocomplete: config.autocomplete,
      gusApi: config.gusUrl,
      spaceID: config.spaceID,
      requestUrl: config.requestUrl,
      rootUrl: '/search'
    }
  }

  let derivable
  try {
    derivable = decodeUrl(requestUrl, gusConfig)
  } catch (e) {
    console.error(e)
  }

  const initialState = {
    ...constants,
    ...derivable,
    ...currentGusState
  }

  const setupTasks = getSetupTasks(initialState)

  const module = createModule(initialState)
  store.registerModule('gus', module)

  return Promise.all(setupTasks.map(task =>
    store.dispatch(task[0], task[1]))
  ).then(() => {
    if (!store.state.gus.searchResults) {
      store.dispatch('submit', initialState.page)
    }
  }).catch(e => store.dispatch('notify', 'Unable to get properties'))
}
