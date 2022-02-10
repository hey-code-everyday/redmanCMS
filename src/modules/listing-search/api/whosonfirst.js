// @flow

import type {State} from '../store/stateShape'

export function getGeo (state: State) {
  return {
    method: 'GET',
    url: `${state.config.gusApi}whosonfirst/${state.geo['whosonfirst.id']}`,
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }
}

export function preIndexedShape (state: State) {
  let ticket = {
    method: 'GET',
    url: `${state.config.gusApi}pre-indexed-shape/${state.geo['pre_indexed_shape.index']}/${state.geo['pre_indexed_shape.id']}`,
    query: {},
    headers: {
      'Accept': 'application/json',
      'token': state.idToken
    }
  }

  if (state.geo['pre_indexed_shape.type']) {
    ticket.query.type = state.geo['pre_indexed_shape.type']
  }
  if (state.geo['pre_indexed_shape.path']) {
    ticket.query.path = state.geo['pre_indexed_shape.path']
  }

  return ticket
}
