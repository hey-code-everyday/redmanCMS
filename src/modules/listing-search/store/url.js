// @flow
import qs from 'query-string'
import clone from 'lodash/clone'
import deburr from 'lodash/deburr'
import reduce from 'lodash/reduce'

import RoutePattern from 'route-pattern'

import type {State} from './stateShape'
import possibleFilters from '../filters'
import {createGeo} from '../helpers/geography'


var kebabCase = createCompounder(function(result, word, index) {
   return result + (index ? '-' : '') + word.toLowerCase();
});

function createCompounder (callback) {
  return function (string) {
     return reduce(ourwords(deburr(string)), callback, '');
  }
}

var reAsciiWord = /([^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]|(\$\d+k)|(\$\d+m))+/g;

function ourwords (string) {
     return string.match(reAsciiWord) || [];
}

const slug = text => kebabCase(text)

// Flat array of all filters allowed by the app
const ALL_POSSIBLE_FILTERS = Object.keys(possibleFilters).reduce((acc, key) => {
  const possibleFilter = possibleFilters[key]
  return acc.concat(possibleFilter.filters)
}, [])

// ****
// ENCODING
// ****

/**
 * From an object of filters (in app state, return an encoded slug)
 * Also returns an object of filters that cannot be encoded (remainder)
 *
 * @param  {Object} filters [description]
 * @return {slug: string, remainder Object}
 */
export const encodeFilters = (filters: Object, config: Object) => {
  if (!filters) return {slug: '', remainder: {}}

  // remainder object starts by including filters that are not defined
  // anywhere
  let remainder = Object.keys(filters).reduce((acc, key) => {
    if (ALL_POSSIBLE_FILTERS.indexOf(key) === -1) {
      acc[key] = filters[key]
    }
    return acc
  }, {})

  const parts = Object.keys(possibleFilters).map(key => {
    const filter = possibleFilters[key]

    // filters can exclude themselves from the URL body by passing false for decodeSlug
    // in that case the filter is instead added to the query string
    if (!filter.decodeSlug) {
      filter.filters.forEach(filterKey => {
        const value = filters[filterKey]
        if (!value) return
        remainder[filterKey] = value
      })
      return false
    }

    return filter.sidebarText(filters, config)
  }).filter(x => x).map(text =>
    slug(text)
  )

  return {
    slug: parts.join('-'),
    remainder
  }
}

/**
 * @param  {Object} state Entire app state
 * @return {string} location relevant part of the URL
 */
export function encodeGeoUrlBody (geo: Object) {
  if (!geo) return 'geo/all-areas'

  if (geo['whosonfirst.id']) {
    return `geo/wof/${geo['whosonfirst.id']}`
  }

  if (geo['pre_indexed_shape.index'] && geo['pre_indexed_shape.id']) {
    return `geo/${geo['pre_indexed_shape.index']}/${geo['pre_indexed_shape.id']}`
  }

  return 'geo/all-areas'
}

// This function is synchronous and takes the application state and returns a
// string.
export function encodeUrl (state: State): string {
  let query = state.page ? {page: (state.page + 1)} : {}
  let filtersSlug = ''

  if (!state.preconfiguredSearch) {
    const filters = encodeFilters(state.filters, state.config)
    filtersSlug = filters.slug
    query = {
      ...query,
      sort: state.sort,
      ...filters.remainder
    }
    if (state.geo && state.geo.type === 'location') {
      query = {
        ...query,
        lat: state.geo.centre_lat,
        lon: state.geo.centre_lon
      }
    }
    if (state.geo && state.geo.type === 'pre_indexed_shape') {
      query = {
        ...query,
        path: state.geo['pre_indexed_shape.path'],
        type: state.geo['pre_indexed_shape.type']
      }
    }
  }

  const queryString = qs.stringify(query)

  const urlBody = (state.preconfiguredSearch)
    ? `${state.config.rootUrl}/p/${state.preconfiguredSearch}`
    : `${state.config.rootUrl}/${encodeGeoUrlBody(state.geo)}/${filtersSlug}`

  const anchor = state.anchor

  return urlBody +
    (queryString ? '?' + queryString : '') +
    (anchor ? '#' + anchor : '')
}

/**
 * Decode the filters part of the slug
 * @param  {string} slug The filters slug
 * @return {Object} Filters object to plug into state
 */
export const decodeFilters = (slug: string) => {
  if (!slug || slug === '') return {}

  return Object.keys(possibleFilters).reduce((acc, key) => {
    let filters
    const decodeSlug = possibleFilters[key].decodeSlug
    if (!decodeSlug) return acc
    filters = possibleFilters[key].decodeSlug(slug)

    if (!filters) return acc
    return Object.assign({}, acc, filters)
  }, {})
}

/**
 * [decodeQueryFilters description]
 * @param  {Object} queryParams Object derived from query string of the URL
 * @return {Object} filters
 */
export const decodeQueryFilters = (queryParams: Object) => {
  return Object.keys(queryParams).reduce((acc, key) => {
    if (ALL_POSSIBLE_FILTERS.indexOf(key) === -1) return acc
    acc[key] = queryParams[key]
    return acc
  }, {})
}

/**
 * return the part of the URL following #
 * @param  {string} input Entire URL
 * @return {string}       The hash part of the URL
 */
export function decodeHash (input: string) {
  const parts = input.split('#')
  if (parts.length === 1) {
    return null
  } else if (parts.length === 2) {
    return parts[1]
  } else {
    throw new Error('decodeHash called on non-url')
  }
}

export function urlPatternMatch (path: string) {
  const PATTERNS = {
    preconfig: RoutePattern.fromString('*/search/p/:slug').match(path),

    saved: RoutePattern.fromString('*/search/s/:id').match(path),

    basket: RoutePattern.fromString('*?ids=:ids').match(path),

    allAreas: RoutePattern.fromString('*/search/geo/all-areas/*filters').match(path) ||
      RoutePattern.fromString('*/search/geo/all-areas').match(path),

    wof: RoutePattern.fromString('*/search/geo/wof/:wofid/*filters').match(path) ||
      RoutePattern.fromString('*/search/geo/wof/:wofid').match(path),

    preIndexed: RoutePattern.fromString('*/search/geo/:index/:id/*filters').match(path) ||
      RoutePattern.fromString('*/search/geo/:index/:id').match(path),

    base: RoutePattern.fromString('*').match(path)
  }
  return ['preconfig', 'saved', 'basket', 'allAreas', 'wof', 'preIndexed', 'base'].reduce((acc, match) => {
    if (acc) return acc
    if (PATTERNS[match]) {
      return {route: match, ...PATTERNS[match]}
    }
  }, null)
}

// This is a pure function which is only called at the beginning on app
// load. It returns an object which contains a number of properties to be
// merged into the state object
export function decodeUrl (url: string, config: State.config) {
  config = clone(config)

  const match = urlPatternMatch(url)
  if (!match) {
    return {}
  }

  let state = {
    filters: config.defaultVals,
    page: Number(match.queryParams.page) - 1,
    sort: (match.queryParams && match.queryParams.sort)
      ? match.queryParams.sort
      : config.defaultSort
  }

  const {lat, lon} = match.queryParams
  let location = (lat && lon)
    ? {
      centre_lat: Number(match.queryParams.lat),
      centre_lon: Number(match.queryParams.lon)
    }
    : {}

  if (match.route === 'preconfig') {
    const preconfiguredSearch = config.preconfiguredSearches[match.namedParams.slug]
    if (preconfiguredSearch) {
      state = {
        ...state,
        preconfiguredSearch: match.namedParams.slug,
        ...config.preconfiguredSearches[match.namedParams.slug] || {}
      }
      return state
    }
  } else if (match.route === 'saved') {
    state = {
      ...state,
      savedSearch: match.namedParams.id
    }
    return state
  } else if (match.route === 'basket') {
    state = {
      ...state,
      ids: match.namedParams.ids.split(',').join('|')
    }
    delete state.filters
  } else if (match.route === 'wof') {
    location = {
      ...location,
      type: 'whosonfirst',
      'whosonfirst.id': Number(match.namedParams.wofid)
    }
  } else if (match.route === 'preIndexed') {
    const {index, id} = match.namedParams
    const {type, path} = match.queryParams
    location = {
      ...location,
      type: 'pre_indexed_shape',
      locationTitle: 'Custom Area',
      'pre_indexed_shape.index': index,
      'pre_indexed_shape.id': id,
      'pre_indexed_shape.type': type,
      'pre_indexed_shape.path': path
    }
  }

  // if filters slug cannot be decoded just ignore it
  try {
    if (
      ['allAreas', 'wof', 'preIndexed'].indexOf(match.route) !== -1 &&
      match.namedParams.filters !== 'defaults'
    ) {
      const filtersSet = {
        ...decodeFilters(match.namedParams.filters),
        ...decodeQueryFilters(match.queryParams)
      }
      state = {
        ...state,
        filters: filtersSet
      }
    }
  } catch (e) {
    console.error('Cannot decode filters part of URL')
  }

  state = {
    ...state,
    geo: createGeo(location)
  }

  return state
}
