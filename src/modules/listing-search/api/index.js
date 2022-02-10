import debounce from 'debounce-promise'

import {
  autocomplete as autocompleteTicket,
  search as searchTicket,
  lastUpdate as lastUpdateTicket,
  rawFieldTerms as rawFieldTermsTicket,
  searchMapClusters as searchMapClustersTicket,
  searchMap as searchMapTicket,
  getByMls as getByMlsTicket
} from './src'

import {
  getFaves,
  getSaved,
  fave as faveTicket,
  unfave as unfaveTicket,
  saveSearch as saveSearchTicket,
  deleteSavedSearch as deleteSavedSearchTicket,
  getSavedFilters as getSavedFiltersTicket,
  submitGeoJson as submitGeoJsonTicket
} from './profile'

import {
  getGeo as getGeoTicket,
  preIndexedShape as preIndexedShapeTicket
} from './whosonfirst'

const popsicle = require('popsicle')

const call = ticket => {
  return popsicle.request(ticket)
    .use(popsicle.plugins.parse('json'))
    .then(res => (res.status < 400) ? res.body : Promise.reject(res.status))
}

// response when stuff is put in the autocomplete bar
export const autocomplete = debounce((state, searchString) => {
  return call(autocompleteTicket(state, searchString))
}, 500, {leading: true})

// submit the current filters to search
export const search = (state, page) =>
  call(searchTicket(state, page))

// submit a polygon
export const submitGeoJson = (state, polygon) => {
  const ticket = submitGeoJsonTicket(state, polygon)
  const _call = call(ticket)
  return _call
}

// get clusters from the map
export const searchMapClusters = (state, level) =>
  call(searchMapClustersTicket(state, level))

// search the map for actual results (max set in config)
export const searchMap = (state) =>
  call(searchMapTicket(state))

export const getByMls = (state, mls) =>
  call(getByMlsTicket(state, mls)).then(res => res.hits.hits)

// get user favs and searches
export const getUserInfo = (state, idToken) => Promise.all([
  call(getFaves(state)),
  call(getSaved(state))
]).then(([faves, saved]) => ({faves, saved}))

// toggle favouriting of a property
export const fave = (state, mls) =>
  call(faveTicket(state, mls))

export const unfave = (state, mls) =>
  call(unfaveTicket(state, mls))

// save the current state as a savedSearch
export const saveSearch = (state, name) =>
  call(saveSearchTicket(state, name))

export const deleteSavedSearch = (state, id) =>
  call(deleteSavedSearchTicket(state, id))

// get the parameters of the search
export const getSavedFilters = (state, id) =>
  call(getSavedFiltersTicket(state, id))

export const getGeo = (state) =>
  call(getGeoTicket(state))

export const preIndexedShape = (state) =>
  call(preIndexedShapeTicket(state))

// Use popsicle.request for lastUpate since it returns text/plain not JSON
export const lastUpdate = state =>
  popsicle.request(lastUpdateTicket(state)).then(res =>
    res.body
  )

export const rawFieldTerms = (state, rawFieldName) =>
  call(rawFieldTermsTicket(state, rawFieldName))

export const getUserGeoLocation = () =>
  new Promise((resolve, reject) => {
    try {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({
          locationTitle: 'Your Location',
          centre_lat: position.coords.latitude,
          centre_lon: position.coords.longitude
        })
      }, err => reject(err))
    } catch (e) {
      reject('navigator.geolocation not supported')
    }
  })
