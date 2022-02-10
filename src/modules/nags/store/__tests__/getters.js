import getters from '../getters'
import state from './state.json'
import state2 from './state2.json'

describe('message', () => {
  it('should return a particular warnings or disclaimer message', () => {
    const obs = getters.message(state)('searchResultsDisclaimer')
    expect(obs).toEqual("These listings may be totally inaccurate because they are in a DB and that never reflects reality")
  })

  it('should return null if the message does not exist', () => {
    const obs = getters.message(state)('foo')
    expect(obs).toBeNull()
  })
})

describe('nextCondition', () => {
  it('should return the next condition that the user needs to satisfy to be vow compliant', () => {
    const obs = getters.nextCondition(state)
    expect(obs).toHaveProperty('item', 'termsAgreement')
  })

  it('should always loggedIn first if it appears anywhere in the unsatisfied conditions', () => {
    const obs = getters.nextCondition(state2)
    expect(obs).toHaveProperty('item', 'loggedIn')
  })
})
