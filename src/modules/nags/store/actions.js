import Api from '../Api'
import getters from './getters'

let localStorage
if (typeof window === 'undefined') {
  localStorage = null
} else {
  localStorage = window.localStorage
}
const api = Api(localStorage)

export default {
  getProfile: ({state, commit, rootState}) => {
    return api.getProfile(rootState).then(res => {
      commit('setRemoteProfile', res)
    })
  },

  attemptVow: ({state, commit, dispatch}, mutation) => {
    commit('waiting')
    return dispatch('getProfile').then(() => {
      const intention = getters.nextCondition(state)
      api.updateIntention(intention)
      commit('setIntention', intention)
      if (!intention) {
        commit('done')
        if (state.onDone) dispatch(state.onDone)
        return null
      }

      mutation = mutation || state.onShowLock
      if (intention.item === 'loggedIn' && !state.idToken && mutation) {
        // next step is to log in
        // don't do this if there is an idToken though, as we may just be waiting for response
        commit(mutation)
      }

      commit('ready')
      return intention
    })
  },

  cancelVow: ({commit}) => {
    api.updateIntention(null)
    commit('setIntention', null)
    return null
  },

  agreeToTerms: ({commit, dispatch, rootState}) => {
    commit('waiting')
    return api.agreeToTerms(rootState).then(() => {
      return dispatch('attemptVow')
    })
  },

  updateContactInfo: ({rootState, commit, dispatch}, info) => {
    commit('waiting')
    return api.updateContactInfo(rootState, info).then(() => {
      return dispatch('attemptVow')
    })
  },

  sendEmailVerification: ({state, rootState, commit}) => {
    state.readyState = 'waiting'
    return api.resendValidation(rootState).then(() => {
      state.readyState = 'ready'
    })
  },

  initializeNag: ({state, dispatch, commit}) => {
    commit('ready')
  },

  syncNagData: ({commit, state, dispatch}, token) => {
    // sync localTermsAgreement to remote
    const localTermsAgreement = api.getLocal().termsAgreement
    if (localTermsAgreement) {
      dispatch('agreeToTerms')
    }
    dispatch('initializeNag')
  },

  onNagLogout: () => {
    api.onLogout()
  }
}
