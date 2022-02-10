// @flow

import globalConfig from '../config'
import update from 'immutability-helper'

export function removeFalsyFilters (filters: Object, state: Object, page: number, config: Object) {
  return Object.keys(filters).reduce((filteredFilters, key) => {
    const filter = filters[key]
    if (filter) {
      filteredFilters[key] = filter
    }
    return filteredFilters
  }, {})
}

export function addPaginationFilters (filters: Object, state: Object, page: number = 0, config: Object) {
  return Object.assign({}, filters, {
    size: config.resultsPerPage,
    from: config.resultsPerPage * page
  })
}

export function addSortingFilter (filters: Object, state: Object, page: number, config: Object) {
  if (
    state.sort === 'geo_centre' &&
    state.geo &&
    state.geo.centre_lat &&
    state.geo.centre_lon
  ) {
    // have complete data for a geo sort
    return update(filters, {$merge: {
      sort: state.sort,
      sort_centre_lat: state.geo.centre_lat,
      sort_centre_lon: state.geo.centre_lon
    }})
  } else if (state.sort === 'geo_centre') {
    // attemping to do geo_centre sort but dont have requisite data so fallback to default
    return update(filters, {$merge: {
      sort: config.defaultSort
    }})
  }

  // not attemping geo sort, just set the sorting parameter
  return Object.assign({}, filters, {sort: state.sort})
}

export function addGeoFilters (filters: Object, state: Object, page: number, config: Object) {
  const defaultGeo = config.defaultGeo || null
  const geo = state.geo || defaultGeo || null

  if (!geo) {
    return filters
  }
  switch (geo.type) {
    case 'whosonfirst': {
      return update(filters, {$merge: {
        'whosonfirst.id': geo['whosonfirst.id']
      }})
    }
    case 'pre_indexed_shape': {
      return update(filters, {$merge: {
        'pre_indexed_shape.id': geo['pre_indexed_shape.id'],
        'pre_indexed_shape.index': (geo['pre_indexed_shape.index'] || null),
        'pre_indexed_shape.type': (geo['pre_indexed_shape.type'] || null),
        'pre_indexed_shape.path': (geo['pre_indexed_shape.path'] || null)
      }})
    }
    case 'location': {
      const radius = (geo.point && geo.radius)
        ? geo.radius
        : config.pointSearchRadius
      return update(filters, {$merge: {
        distance_from_lat: geo.centre_lat,
        distance_from_lon: geo.centre_lon,
        distance_from_radius: radius
      }})
    }
    case 'fake': {
      return update(filters,
        filters.raw
        ? {raw: {$push: geo.raw}}
        : {$merge: {raw: geo.raw}}
      )
    }
  }
  return filters
}

export function swapRawFilter (filters: Object, state: Object, page: number, config: Object) {
  let raw = []

  if (filters.raw) {
    if (!config.rawFieldSets[filters.raw]) {
      throw new Error('Undefined raw field set requested:' + filters.raw)
    }
    raw = raw.concat(config.rawFieldSets[filters.raw].value)
  }

  if (filters.agentSetRaw) {
    raw = raw.concat(filters.agentSetRaw)
  }
  if (filters.userSetRaw) {
    raw = raw.concat(filters.userSetRaw)
  }

  if (!raw.length) raw = null

  return Object.assign({}, filters, {raw, agentSetRaw: null, userSetRaw: null})
}

export function addBoundingBox (filters: Object, state: Object, page: number, config: Object) {
  return update(filters, {$merge: {
    'bounding_box.top_left.lat': state.map.realPosition.north,
    'bounding_box.top_left.lon': state.map.realPosition.west,
    'bounding_box.bottom_right.lat': state.map.realPosition.south,
    'bounding_box.bottom_right.lon': state.map.realPosition.east
  }})
}

const buildFiltersFrom = reducers => (state: Object, page: number, config: Object = globalConfig) => {
  if (state.ids) {
    const filters = {}
    filters.ids = state.ids
    filters.select_additional = 'province|city'
    return filters // no other filters should be applied
  }

  const filters = reducers.reduce((acc, f) => {
    if (!(typeof f === 'function')) return acc
    return f(acc, state, page, config)
  }, state.filters)

  filters.select_additional = 'province|city'


  return filters
}

export default buildFiltersFrom([swapRawFilter, addGeoFilters, addSortingFilter, addPaginationFilters, removeFalsyFilters])

export const buildFiltersMap = buildFiltersFrom([swapRawFilter, addGeoFilters, addBoundingBox, removeFalsyFilters])
