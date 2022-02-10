import {apiAction} from '../actions'

describe('apiAction', () => {
  const apiMethod = jest.fn(() => Promise.resolve('res'))
  const commit = jest.fn()
  const state = {}

  it('should return a function', () => {
    const action = apiAction(apiMethod, 'apiMethod')
    expect(() => {
      action({state, commit})
    }).not.toThrow()
  })

  it('the returned function should call the API method', () => {
    const action = apiAction(apiMethod, 'apiMethod')
    action({state, commit})
    expect(apiMethod).toHaveBeenCalled()
  })

  it('the returned function should accept additional arguments and apply them to the API method', () => {
    const action = apiAction(apiMethod, 'apiMethod')
    action({state, commit}, 'foo')
    expect(apiMethod.mock.calls[0]).toContain('foo')
  })

  it('the returned function should call commit for the request', () => {
    const action = apiAction(apiMethod, 'apiMethod')
    action({state, commit}, 'foo')
    expect(commit).toHaveBeenCalledWith('apiMethodRequest', 'foo')
  })

  it('the returned function should call commit for the response', () => {
    const action = apiAction(apiMethod, 'apiMethod')
    return action({state, commit}, 'foo').then(res => {
      return expect(commit).toHaveBeenCalledWith('apiMethodResponse', 'res')
    })
  })

  it('the created action should resolve to the api response', () => {
    const action = apiAction(apiMethod, 'apiMethod')
    expect(
      action({state, commit})
    ).resolves.toEqual('res')
  })
})
