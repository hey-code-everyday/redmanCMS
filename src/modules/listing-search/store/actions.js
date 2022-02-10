// @flow

import * as api from '../api'

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
converts any function that returns a promise into a Vuex action.
The returned action fires commits before and after the Promise
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function apiAction (method: Function, methodName: string) {
  return ({state, commit, dispatch}: {state: Object, commit: Function, dispatch: Function}, ...args: any) => {
    commit(`${methodName}Request`, ...args)
    return method(state, ...args).then(res => {
      commit(`${methodName}Response`, res)
      return res
    }).catch(statusCode => {
      if (statusCode === 401) {
        dispatch('clearClientAuth')
        // commit('SHOW_AUTH')
        return
      }

      try {
        commit(`${methodName}Error`, statusCode)
      } catch (e) {
        console.error(`Error executing method ${methodName}, status code ${statusCode}`)
      }
    })
  }
}

export default ((api: Object) =>
  Object.keys(api).reduce((actions, methodName) => {
    actions[methodName] = apiAction(api[methodName], methodName)
    return actions
  }, {})
)(api)
