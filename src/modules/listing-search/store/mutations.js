// @flow
import Vue from 'vue'
import type {State} from './stateShape.js'
import {createGeo} from '../helpers/geography'

export type sortValues = "price_asc" | "price_des" | "geo_centre" | "list_date_asc" | "list_date_des"

type searchResponse = {
  searchResultsDisclaimer: string,
  hits: {
    total: Number,
    hits: Array<Object>
  }
}

const mutations = {
  setAnchor: (state: State, anchor: string) => {
    Vue.set(state, 'anchor', anchor)
    if (anchor === 'map') {
      Vue.set(state, 'mapLoaded', true)
      if (process.browser) {
        window.scrollTo(0, 0)
      }
    }
  },

  openPanel: (state: State, panel: string) => {
    state.panel = panel
  },

  closePanel: (state: State) => {
    state.panel = null
  },

  toggleAdvancedSearch: (state: State) => {
    state.isAdvancedSearch = !state.isAdvancedSearch
  },

  //
  // HANDLE AUTOCOMPLETE
  //
  autocompleteRequest: (state: State, value: string) => {
    state.autocompleteWaiting = true
  },

  autocompleteResponse: (state: State, results: Array<Object>) => {
    state.autocompleteWaiting = false
    state.autocompleteResults = results
  },

  clearAutocompleteResults: (state: State) => {
    state.autocompleteWaiting = false
    state.autocompleteResults = []
  },

  //
  // HANDLE FILTERS
  //
  setFilters: (state: State, changes: Object) => {
    state.preconfiguredSearch = null
    Object.keys(changes).forEach(key => {
      if (typeof state.filters[key] === 'undefined') {
        Vue.set(state.filters, key, changes[key])
      } else {
        state.filters[key] = changes[key]
      }
    })
  },

  setFilter: (state: State, key: string, value: string) =>
    mutations.setFilters(state, {[key]: value}),

  unsetFilters: function unsetFilters (state: State, filters?: Array<string> | string) {
    state.preconfiguredSearch = null

    if (typeof filters === 'undefined') {
      return unsetFilters(state, Object.keys(state.filters))
    } else if (!Array.isArray(filters)) {
      return unsetFilters(state, [filters])
    }

    filters.forEach(filter => {
      if (typeof state.filters[filter] !== 'undefined') {
        state.filters[filter] = null
      }
    })
  },

  /**
   * Sets a new raw field, which is an array underneath filters.
   * @param {string} rawFieldName   The raw field name eg LM_Char_1_10
   * @param {string} value raw field value
   */
  setRaw: (state: State, [rawFieldName, value]: Array<string>) => {
    if (typeof state.filters.userSetRaw === 'string') {
      Vue.set(state.filters, 'userSetRaw', [state.filters.userSetRaw])
    } else if (!state.filters.userSetRaw) {
      Vue.set(state.filters, 'userSetRaw', [])
    }

    mutations.unsetRaw(state, rawFieldName)

    const newRaw = `${rawFieldName}:${value}`
    state.filters.userSetRaw.push(newRaw)
  },

  /**
   * Remove a raw field value
   * @param {string} rawFieldName   The raw field name eg LM_Char_1_10
   */
  unsetRaw: (state: State, rawFieldName: string) => {
    state.filters.userSetRaw = state.filters.userSetRaw
      ? state.filters.userSetRaw.filter(item => {
        const [key] = item.split(':')
        return key !== rawFieldName
      })
      : []
  },

  //
  // HANDLE SORT
  //
  setSort: (state: State, value: sortValues) => {
    state.preconfiguredSearch = null
    state.sort = value
  },

  //
  // HANDLE GEOLOCATION
  //
  setGeo: (state: State, value: Object) => {
    state.preconfiguredSearch = null
    state.geo = createGeo(value)
    state.autocompleteSearchString = value.locationTitle || ''
    mutations.unsetFilters(state, ['sort_centre_lat', 'sort_centre_lon', 'whosonfirst.id'])
    if (
      state.sort === 'geo_centre' &&
      (!value.centre_lat || !value.centre_lon)
    ) {
      state.sort = state.config.defaultSort
    }
  },

  clearGeo: (state: State) => {
    state.preconfiguredSearch = null
    if (state.sort === 'geo_centre') {
      state.sort = state.config.defaultSort
    }
    state.geo = null
    state.autocompleteSearchString = ''
    mutations.unsetFilters(state, ['sort_centre_lat', 'sort_centre_lon', 'whosonfirst.id'])
  },

  //
  // HANDLE PAGE
  //
  setPage: (state: State, page: number) => {
    state.page = page
  },

  //
  // HANDLE ENTIRE SEARCH
  //
  unsetSearch: (state: State) => {
    mutations.unsetFilters(state)
    mutations.clearGeo(state)
    mutations.setSort(state, state.config.defaultSort)
  },

  setPreconfiguredSearch: (state: State, slug: string) => {
    const preconfiguredSearch = state.config.preconfiguredSearches[slug]
    if (!preconfiguredSearch) return

    // unset everything
    mutations.unsetSearch(state)

    if (preconfiguredSearch.filters) {
      mutations.setFilters(state, preconfiguredSearch.filters)
    } else {
      mutations.setFilters(state, state.config.defaultVals)
    }
    if (preconfiguredSearch.sort) mutations.setSort(state, preconfiguredSearch.sort)
    if (preconfiguredSearch.geo) mutations.setGeo(state, preconfiguredSearch.geo)
    state.preconfiguredSearch = slug
  },

  //
  // API REQUEST AND RESPONSES: SRC
  //
  searchRequest: (state: State) => {
    state.searchWaiting = true
  },

  searchResponse: (state: State, {res, page}: {res: searchResponse, page: Number}) => {
    state.searchWaiting = false
    state.totalSearchResults = res.hits.total
    state.totalListingCount = res.totalResults || res.hits.total
    state.searchResults = res.hits.hits
    state.searchResultsDisclaimer = res.searchResultsDisclaimer
    if (res.courtesyOfMessage) state.courtesyOfMessage = res.courtesyOfMessage
    if (res.lastUpdate) state.lastUpdate = res.lastUpdate

    state.page = page || 0
  },

  getUserGeoLocationRequest: (state: State) => {
    state.autocompleteWaiting = true
  },

  getUserGeoLocationResponse: (state: State, value: Object) => {
    state.autocompleteWaiting = false
    return mutations.setGeo(state, value)
  },

  searchMapRequest: (state: State) => {
    state.map.markersLoadState = 1
  },

  searchMapResponse: (state: State, res: Object) => {
    Vue.set(state.map, 'markers', res.hits.hits.map(hit => ({loadState: 0, ...hit})))
    state.map.markersLoadState = 2
  },

  searchMapClustersRequest: (state: State) => {
    state.map.markersLoadState = 1
  },

  searchMapClustersResponse: (state: State, res: Object) => {
    state.map.markersLoadState = 2
    Vue.set(state.map, 'markers', res.buckets)
  },

  lastUpdateRequest: () => {
  },

  lastUpdateResponse: (state: State, res: Object) => {
    Vue.set(state, 'lastUpdate', res)
  },

  rawFieldTermsRequest: (state: State, rawFieldName: string) => {
  },

  rawFieldTermsResponse: (state: State, res: Object) => {
  },

  //
  // API REQUEST AND RESPONSE: PROFILE
  //
  getUserInfoRequest: (state: State, token: string) => {
    Vue.set(state, 'idToken', token)
    state.userLoadState = 1
  },

  getUserInfoResponse: (state: State, res: Object) => {
    state.userLoadState = 2
    state.faves = res.faves.reverse()
    state.saved = res.saved.reverse()
  },

  clearGusUser: (state: State) => {
    state.userLoadState = 0
    state.faves = null
    state.saved = null
  },

  initializeRequest: (state: State, token: string) => {
    if (token) mutations.getUserInfoRequest(state, token)
  },

  initializeResponse: (state: State, res: Object) => {
    state.lastUpdate = res.lastUpdate
    if (res.saved) mutations.getUserInfoResponse(state, res)
  },

  faveRequest: (state: State, [mls, address]: [string, string]) => {
    // reconstruct the object returned by the GET faves endpoint:
    if (!state.faves) state.faves = []
    state.faves.unshift({id: mls, listing: {address}})
  },

  faveResponse: () => {
  },

  unfaveRequest: (state: State, mls: string) => {
    state.faves = state.faves.filter(fave => fave.id !== mls)
  },

  unfaveResponse: () => {
  },

  saveSearchRequest: () => {
  },

  saveSearchResponse: (state: State, res: Object) => {
    const newSave = {
      id: res._id,
      name: res.name
    }
    if (!state.saved) state.saved = []
    state.saved.unshift(newSave)
  },

  deleteSavedSearchRequest: (state: State, id: string) => {
    state.saved = state.saved.filter(save => save.id !== id)
  },

  deleteSavedSearchResponse: () => {
  },

  getSavedFiltersRequest: (state: State) => {
    state.searchWaitng = true
  },

  getSavedFiltersResponse: (state: State, res: Object) => {
    const uiState = res.metadata.uiState
    Vue.set(state, 'filters', uiState.filters)
    Vue.set(state.filters, 'agentSetRaw', uiState.raw)
    state.sort = uiState.sort
    if (uiState.geo) {
      mutations.setGeo(state, uiState.geo)
    } else {
      mutations.clearGeo(state)
    }
    return uiState
  },

  //
  // API REQUEST AND RESPONSE: WHOSONFIRST
  //
  //
  getGeoRequest: () => {
  },

  getGeoResponse: (state: State, res: Object) => {
    // if the returned object is not the one still in the store,
    // exit early
    if (Number(state.geo['whosonfirst.id']) !== Number(res.id)) return

    const location = {
      'whosonfirst.id': res.id,
      'locationTitle': res.properties['wof:name'],
      point: (res.geometry.type === 'Point'),
      radius: res.properties['radius'],
      centre_lat: res.properties['geom:latitude'],
      centre_lon: res.properties['geom:longitude'],
      geometry: res.geometry
    }
    state.geo = createGeo(location)
  },

  getGeoError: (state: State, statusCode: number) => {
    state.geo = createGeo({...state.geo, point: true})
  },

  preIndexedShapeRequest: () => {
  },

  preIndexedShapeResponse: (state: State, res: Object) => {
    state.geo.geometry = res
  },

  //
  // MAP UI CONTROLS
  //
  setMapPosition: (state: State, position: Object) => {
    Vue.set(state.map, 'userRequestedPosition', position)
  },

  recenterMap: (state: State) => {
    Vue.set(state.map, 'userRequestedPosition', null)
  },

  clearMarkers: (state: State) => {
    state.map.markers = []
  },

  openMarker: (state: State, title: string) => {
    state.map.openMarker = title
  },

  closeMarker: (state: State) => {
    state.map.openMarker = null
  },

  beginDrawing: (state: State) => {
    state.map.drawMode = true
  },

  endDrawing: (state: State) => {
    state.map.drawMode = false
  },

  submitGeoJsonRequest: (state: State, polygon: Object) => {
    mutations.endDrawing(state)
    Vue.set(state, 'geo', {
      type: 'custom',
      locationTitle: 'Custom Area',
      geometry: polygon
    })
  },

  submitGeoJsonResponse: (state: State, res: Object) => {
    Vue.set(state.geo, 'pre_indexed_shape.id', res.id)
    Vue.set(state.geo, 'pre_indexed_shape.index', res.index)
    Vue.set(state.geo, 'type', 'pre_indexed_shape')
  },

  // alerts
  addAlert: (state: State, notification: {message: string, id: string}) => {
    state.notifications.unshift(notification)
  },

  expireAlert: (state: State, id: string) => {
    const notifications = state.notifications.filter(n => n.id !== id)
    state.notifications = notifications
  }
}

export default mutations
