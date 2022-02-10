import Api from '../index'
import state from './state.json'

describe('Api', () => {
  const getItem = jest.fn(x => `{"termsAgreement": true}`)
  const setItem = jest.fn(x => x)
  // make a promise that contains the original request ticket so we can analyze it
  const call = jest.fn(x => Promise.resolve(x))

  const api = Api({
    getItem,
    setItem
  }, 'gusUserProfile', call)

  describe('logout', () => {
    it('should clear the local data', () => {
      api.onLogout()
      expect(setItem).toHaveBeenCalledWith('gusUserProfile', '')
    })
  })

  describe('getProfile', () => {
    it('should get data from localStorage', () => {
      api.getProfile(state)
      expect(getItem).toHaveBeenCalled()
    })

    it('should call the api', () => {
      const res = api.getProfile(state)
      expect(call).toHaveBeenCalled()
      expect(res).resolves.toHaveProperty('url')
    })

    it('should place the terms agreement into the API query', () => {
      const res = api.getProfile(state)
      expect(res).resolves.toHaveProperty('query', {termsAgreement: true})
    })
  })

  describe('updateIntention', () => {
    it('should update the intention in localStorage', () => {
      api.updateIntention('email_verified')
      expect(setItem).toHaveBeenCalledWith('gusUserProfile', JSON.stringify({
        termsAgreement: true,
        intention: 'email_verified'
      }))
    })
  })

  describe('agreeToTerms', () => {
    it('should update the agreement to terms in the local profile', () => {
      api.agreeToTerms(state)
      expect(setItem).toHaveBeenCalledWith('gusUserProfile', JSON.stringify({
        termsAgreement: true
      }))
    })

    it('should also call the API to tell it', () => {
      api.agreeToTerms(state)
      expect(call).toHaveBeenCalled()
    })

    it('should not call the API if we dont have the user yet', () => {
      const _state = {...state, config: {clientIdToken: null}}
      api.agreeToTerms(_state)
      expect(call).not.toHaveBeenCalled()
    })
  })

  describe('updateContactInfo', () => {
    it('should call the API', () => {
      const res = api.updateContactInfo(state, {primaryPhone: '1-800-555-1234'})
      expect(call).toHaveBeenCalled()
      expect(res).resolves.toHaveProperty('body', {primaryPhone: '1-800-555-1234'})
    })
  })

  describe.skip('sendEmailVerification', () => {
    it('should call the API', () => {
      api.sendEmailVerification()
      expect(call).toHaveBeenCalled()
    })
  })
})
