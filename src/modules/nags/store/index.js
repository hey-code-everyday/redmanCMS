import actions from './actions'
import getters from './getters'

export default function createNagStoreModule ({done, showLock}) {
  return {
    state: {
      onDone: done,
      onShowLock: showLock,
      readyState: 'ready', // can also be waiting, done
      intention: null,
      remoteProfile: {
        isUserVow: {
          conditions: [],
          complete: false
        },
        listingDetails: {}
      }
    },

    actions,
    getters,

    mutations: {
      setIntention: (state, intention) => {
        state.intention = intention
      },

      setRemoteProfile: (state, res) => {
        state.remoteProfile = res
      },

      ready: (state) => {
        state.readyState = 'ready'
      },

      waiting: (state) => {
        state.readyState = 'waiting'
      },

      done: (state) => {
        state.readyState = 'done'
      }
    }
  }
}
