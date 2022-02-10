import type StateT from './stateShape'

type TasksT = Array<Array<[string, any]>>

/**
 * Using the initial state which can be derived from the URL, derive a set
 * of async tasks (eg. API calls) to be completed to finish setting up the store.  These
 * tasks correspond to store actions, so they need only be identified - the effects
 * they will have on state are not described here.
 * Tasks should be assumed to complete in parallel.
 *
 * @param  {StateT} state The state of the app which can be derived from URL, cookies, config.
 * @return {tasks} array of [{string} action name, {any} parameter] which will be called
 * as in store.dispatch(task[0], task[1])
 */
export default function getSetupTasks (state: StateT): TasksT {
  let tasks = []

  if (state.idToken) tasks.push(['getUserInfo', state.idToken])

  if (state.savedSearch) tasks.push(['getSavedFilters', state.savedSearch])

  if (state.geo && state.geo.type === 'pre_indexed_shape') {
    tasks.push(['preIndexedShape'])
  } else if (state.geo && state.geo.type === 'whosonfirst') {
    tasks.push(['getGeo'])
  }

  return tasks
}
