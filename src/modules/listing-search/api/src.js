// @flow

import buildFilters, {buildFiltersMap} from './buildFilters'
import type {State} from '../store/stateShape'

export function autocomplete (state: State, searchString: string) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}${state.config.sources[0]}/autocomplete-v2/${searchString}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    },
    query: state.config.autocomplete
  }
}

export function search (state: State, page: number) {
  let localTermsAgreement

  try {
    localTermsAgreement = window.localStorage.get('gusUserProfile').termsAgreement
  } catch (e) {
    localTermsAgreement = false
  }

  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/search/${state.config.sources[0]}/q`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken,
      'termsAgreement': localTermsAgreement
    },
    query: buildFilters(state, page, state.config)
  }
}

export function getByMls (state: State, mls: string) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/search/${state.config.sources[0]}/listings/${mls}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function lastUpdate (state: State) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}${state.config.sources[0]}/status/lastUpdate`,
    headers: {
      'Accept': 'application/json'
    }
  }
}

export function rawFieldTerms (state: State, rawFieldName: string) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}${state.config.sources[0]}/fields/${rawFieldName}/terms`,
    headers: {
      'Accept': 'application/json'
    }
  }
}

export function submitPolygon (state: State, polygon: Object) {
  return {
    method: 'POST',
    url: `${state.config.gusApi}${state.config.sources[0]}/geojson`,
    headers: {
      'Accept': 'application/json'
    }
  }
}

export function searchMapClusters (state: State, level: number) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/search/${state.config.sources[0]}/cluster/${level}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    },
    query: buildFiltersMap(state, 0, state.config)
  }
}

export function searchMap (state: State) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/search/${state.config.sources[0]}/points`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    },
    query: buildFiltersMap(state, 0, state.config)
  }
}
