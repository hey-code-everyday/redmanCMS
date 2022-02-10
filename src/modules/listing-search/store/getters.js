// @flow
import type {State} from './stateShape.js'

import cloneDeep from 'lodash/cloneDeep'
import mutations from './mutations'
import {encodeUrl} from './url'
import filters from '../filters'
import {deslugify} from '../helpers/formatting'

const getters = {
  /**
   * Query the value of some filters. Fallbacks may optionally be provided, but
   * the function is "safe" and will return null for any missing filters,
   * @param  {Array} keys   Array like ['low_price', 'high_price']
   * @param  {Array} deVals Array of default values, indexed in step with keys
   * @return {Object} like {low_price: 300000, high_price: null}
   */
  filterValues: (state: State) => function filterValues (keys: Array<string> | string, deVals: any = []) {
    // handle single values instead of array
    if (!Array.isArray(keys)) {
      return filterValues([keys], [deVals])[keys]
    }

    // collapse keys into an object of the requested values
    return keys.reduce((obj, key, i) => {
      const deVal = deVals[i]
      obj[key] = state.filters[key] || (
        (typeof deVal === 'undefined' || deVal === null) ? null : deVal
      )
      return obj
    }, {})
  },

  /**
   * Get all rawFieldValues, if none are set return an empty array
   * @return {Array<string>}
   */
  userSetRaw: (state: State) => {
    if (!state.filters.userSetRaw) {
      return []
    } else if (typeof state.filters.userSetRaw === 'string') {
      return [state.filters.userSetRaw]
    }
    return state.filters.userSetRaw
  },

  /**
   * Get value for a single raw field, or empty string if it is not set
   * JUST get the value inside the [], we won't need the operator to reconstruct
   * UI
   * @param  {string} rawFieldName The raw field name eg LM_Char_1_10
   * @return {the raw field value}
   */
  userSetRawValue: (state: State) => (rawFieldName: string) => {
    const userSetRaw = getters.userSetRaw(state)
    if (!userSetRaw) return ''
    return userSetRaw.reduce((found, item) => {
      const [key, value] = item.split(':')
      if (key === rawFieldName) {
        const squareBracketMatch = /\[(.+)\]/.exec(value)
        if (squareBracketMatch) return squareBracketMatch[1]
        return value
      }
      return found
    }, '')
  },

  isAdvancedSearchAvailable: (state: State) => {
    return !!state.config.panels.filter(panel =>
      panel.config.advanced
    ).length
  },

  searchResults: (state: State) => {
    return state.searchResults
  },

  totalListingCount: (state: State) => {
    return state.totalListingCount
  },

  totalPages: (state: State) => () => {
    return Math.ceil(state.totalSearchResults / state.config.resultsPerPage)
  },

  hasPrevPage: (state: State) => () => state.page > 0,

  hasNextPage: (state: State) => () =>
    (state.page + 1) * state.config.resultsPerPage < state.totalSearchResults,

  /**
   * Generate a title for saved searches. Based on state geo and filter information
   * @param  {Object} state
   * @return {string}
   */
  savedSearchTitle: (state: State) => () => {
    const geo = state.geo
    const parts = [
      (geo && geo.locationTitle) ? geo.locationTitle : false,
      ...Object.keys(filters).map(key =>
        filters[key].sidebarText(state.filters, state.config)
      )
    ].filter(x => x)
    return parts.length
      ? parts.join(', ')
      : 'My Saved Search'
  },

  /**
   * Generate a title for saved searches. Based on state geo and filter information
   * @param  {Object} state
   * @return {string}
   */
  autoSavedSearchTitle: (state: State) => () => {
    const newFilter = filters
    let filtersArray = Object.entries(state.filters)
    let newFilterObject = {}
    filtersArray.forEach((item) => {
      if (store.state.config.gus &&
          store.state.config.gus.autoSaveSearch &&
          store.state.config.gus.autoSaveSearch.itemsToWatch.includes(item[0])) {
        newFilterObject[item[0]] = item[1]
      }
    })

    const geo = state.geo
    const parts = [
      (geo && geo.locationTitle) ? geo.locationTitle : false,
      ...Object.keys(newFilter).map(key =>
        newFilter[key].sidebarText(newFilterObject)
      )
    ].filter(x => x)

    return parts.length
      ? parts.join(', ')
      : 'My Saved Search'
  },

  /**
   * Generate a UNIQUE title - basically if the title already exists add "(2)"
   * at the end. If there is already a "(2)" use "(3)" and so on.
   * Can optionally from start from a suggestion, or will use savedSearchTitle getter.
   * @param  {string} suggestion (optional) Possible title that will be used if it doesn't exist already
   * @return {string} A unique title
   */
  uniqueSavedSearchTitle: (state: State) => function searchTitle (suggestion?: string) {
    suggestion = suggestion || getters.savedSearchTitle(state)()

    const saved = state.saved
    const possibleDupe = saved && saved.find(save => save.name === suggestion)

    if (possibleDupe) {
      // does the current title have a "(num)" at the end?
      const match = /\((\d+)\)$/.exec(possibleDupe.name)

      // if so, increase the number by one
      if (match && match[1]) {
        const newVersion = Number(match[1]) + 1
        return searchTitle(possibleDupe.name.replace(match[0], `(${newVersion})`))
      }

      // Otherwise start from "(2)"
      return searchTitle(`${suggestion} (2)`)
    }
    return suggestion
  },


  /**
   * Create the URL which will exist after performing a particular mutation
   * Useful for creating real links which will work even if JS doesn't
   * @return {string} the URL for the state after the descibed action
   */
  urlAfterMutation: (state: State) => (mutation: string, ...args?: any) => {
    const stateCopy = cloneDeep(state)
    if (typeof mutations[mutation] !== 'function') {
      throw new Error('No mutation named ' + mutation)
    }
    mutations[mutation](stateCopy, ...args)
    return encodeUrl(stateCopy)
  },

  prevPageHref: (state: State) => () => {
    return getters.urlAfterMutation(state)('setPage', state.page - 1)
  },

  nextPageHref: (state: State) => () => {
    return getters.urlAfterMutation(state)('setPage', state.page + 1)
  },

  isPanelOpen: (state: State) => (panel: string) => {
    return state.panel === panel
  },

  idToken: (state: State) => {
    return state.idToken
  },

  locationTitle: (state: State) => {
    if (!state.geo) return ''
    if (!state.geo.locationTitle) return 'Custom Area'
    return state.geo.locationTitle
  },

  preconfiguredSearchName: (state: State) => (slug: string) => {
    const pcs = state.config.preconfiguredSearches[slug]
    if (!pcs) {
      throw new Error(`Undefined preconfigured search ${slug}`)
    }
    return pcs.nicename || deslugify(slug)
  }
}

export default getters
