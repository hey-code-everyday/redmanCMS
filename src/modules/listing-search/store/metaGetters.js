// @flow
import get from 'lodash/get'
import {deslugify} from '../helpers/formatting'
import getters from './getters'

import type {State} from './stateShape.js'

const {preconfiguredSearchName} = getters

export const helpers = {
  location: (state: State) => {
    return get(state, 'geo.locationTitle',
      get(state, 'config.defaultGeo.locationTitle',
        get(state, 'config.defaultH1')
      )
    )
  },

  type: (state: State) => {
    const TYPE_NAMES = {
      house: 'Homes',
      condo: 'Condos',
      townhouse: 'Townhouses',
      land: 'Land',
      commercial: 'Commercial Real Estate',
      mobile: 'Mobile Homes',
      rural: 'Rural Real Estate',
      investment: 'Real Estate'
    }
    const filters = state.filters || {}
    if (filters.bedrooms || filters.bathrooms) {
      return TYPE_NAMES.house
    } else if (filters.property_types) {
      const types = filters.property_types.split('|')
      if (types.length === 1) {
        return TYPE_NAMES[types[0]]
      } else if (types.length > 1) {
        return TYPE_NAMES.house
      }
    }
    return 'Real Estate & Homes'
  },

  bed: (state: State) => {
    const filterValue = state.filters.bedrooms
    if (!filterValue) return ''
    return filterValue.match(/(\d+)p/)[1] + ' bedroom'
  },

  bath: (state: State) => {
    const filterValue = state.filters.bathrooms
    if (!filterValue) return ''
    return filterValue.match(/(\d+)p/)[1] + ' bathroom'
  },

  count: (state: State) => {
    return state.totalSearchResults || ''
  }
}

const metaGetters = {
  meta: (state: State) => (type: string) => {
    if (state.preconfiguredSearch) {
      const meta = get(
        state,
        `config.preconfiguredSearches.${state.preconfiguredSearch}.htmlMeta.${type}`,
        null
      )
      if (meta) return meta
    }

    const template = state.config.htmlMeta[type]

    return template.match(/%[A-Za-z]+%/g).reduce((acc, match, i) => {
      const fName = match.replace(/%/g, '')
      const f = helpers[fName]
      if (!f) {
        throw new Error(`htmlMeta template variable ${fName} is not allowed`)
      }
      return acc.replace(match, f(state))
    }, template).replace(/\s+/g, ' ')
  },

  robots: (state: State) => {
    const preconfiguredSearchName = state.preconfiguredSearch
    if (
      preconfiguredSearchName &&
      state.config.preconfiguredSearches &&
      state.config.preconfiguredSearches[preconfiguredSearchName]
    ) {
      return 'index,follow'
    }

    if (
      Object.keys(state.filters).find(filterName =>
        filterName !== 'property_types'
      ) || (
        state.filters.property_types &&
        state.filters.property_types.split('|').length > 1
      ) || (
        state.geo &&
        state.geo.type === 'location'
      )
    ) {
      return 'noindex,follow'
    }

    return 'index,follow'
  },

  /*
  ** Provide the main page title/H1
   */
  pageTitle: (state: State) => {
    if (state.preconfiguredSearch) {
      try {
        return preconfiguredSearchName(state)(state.preconfiguredSearch)
      } catch (e) {}
    }
    const {geo} = state
    if (geo && geo.locationTitle) {
      return geo.locationTitle
    }
    return state.config.defaultH1
  }
}

export default metaGetters
