// @flow

import buildFilters from './buildFilters'

import type {State} from '../store/stateShape'

export function getFaves (state: State) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/likes/${state.config.sources[0]}`,
    query: {extra: 'lite'},
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function getSaved (state: State) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/searches/${state.config.sources[0]}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function fave (state: State, [mls, address]: [string, string]) {
  // the state has already been changed, so we are asking the API to
  // update TO the current state
  return {
    method: 'PUT',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/likes/${state.config.sources[0]}/${mls}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function unfave (state: State, mls: string) {
  const faveTicket = fave(state, [mls, ''])
  return {
    ...faveTicket,
    method: 'DELETE'
  }
}

export function saveSearch (state: State, name: string) {
  return {
    method: 'POST',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/searches/${state.config.sources[0]}/named`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    },
    query: buildFilters(state, 0, state.config),
    body: {
      uiState: {
        geo: state.geo,
        sort: state.sort,
        filters: state.filters
      },
      name
    }
  }
}

export function deleteSavedSearch (state: State, id: string) {
  return {
    method: 'DELETE',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/searches/${state.config.sources[0]}/id/${id}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function getSavedFilters (state: State, id: string) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/searches/${state.config.sources[0]}/id/${id}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function submitGeoJson (state: State, geometry: Object) {
  return {
    method: 'POST',
    url: `${state.config.gusApi}space/${state.config.spaceID}/profile/geojson`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    },
    body: geometry
  }
}
