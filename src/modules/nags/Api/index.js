const popsicle = require('popsicle')

const callPopsicle = ticket => {
  return popsicle.request(ticket)
    .use(popsicle.plugins.parse('json'))
    .then(res => (res.status < 400) ? res.body : Promise.reject(res.status))
}

const ApiPrototype = {
  getLocal: function () {
    const localData = this.localStorage
      ? this.localStorage.getItem(this.localStorageKey)
      : null
    return localData ? JSON.parse(localData) : {
      intention: null,
      termsAgreement: false
    }
  },

  setLocal: function (items) {
    if (!this.localStorage) return
    const original = this.getLocal()
    const modified = Object.assign({}, original, items)
    this.localStorage.setItem(this.localStorageKey, JSON.stringify(modified))
  },

  // This function should be called on a normal logout to clear local data
  onLogout: function () {
    this.localStorage.setItem(this.localStorageKey, '')
  },

  getProfile: function (state) {
    const localTermsAgreement = this.getLocal().termsAgreement
    const ticket = {
      method: 'GET',
      url: `${state.config.gusUrl}space/${state.config.spaceID}/profile/${state.config.sources[0]}`,
      headers: {
        'Accept': 'application/json',
        'token': state.config.clientIdToken
      },
      query: {termsAgreement: localTermsAgreement}
    }
    return this.call(ticket)
  },

  updateIntention: function (intention) {
    this.setLocal({intention})
  },

  agreeToTerms: function (state) {
    this.setLocal({termsAgreement: true})
    // if we aren't signed in, dont bother trying to alert the API
    if (!state.config.clientIdToken) return Promise.resolve()
    const ticket = {
      method: 'PUT',
      url: `${state.config.gusUrl}space/${state.config.spaceID}/profile/${state.config.sources[0]}/termsAgreement`,
      headers: {
        'Accept': 'application/json',
        'token': state.config.clientIdToken
      }
    }
    return this.call(ticket)
  },

  updateContactInfo: function (state, contactInfo) {
    const ticket = {
      method: 'PUT',
      url: `${state.config.gusUrl}space/${state.config.spaceID}/profile/contactInfo`,
      headers: {
        'Accept': 'application/json',
        'token': state.config.clientIdToken
      },
      body: contactInfo
    }
    return this.call(ticket)
  },

  resendValidation: function (state) {
    const ticket = {
      method: 'GET',
      url: `${state.config.gusUrl}space/${state.config.spaceID}/profile/validate/resend`,
      headers: {
        'Accept': 'application/json',
        'token': state.config.clientIdToken
      }
    }
    return this.call(ticket)
  }
}

const factory = (localStorage, localStorageKey = 'gusUserProfile', call = callPopsicle) => {
  const api = Object.create(ApiPrototype)
  api.call = call
  api.localStorageKey = localStorageKey
  api.localStorage = localStorage
  return api
}

export default factory
