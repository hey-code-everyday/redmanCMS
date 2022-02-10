import {LoginActionStorage} from '../loginActionStorage'

const storage = {
  getItem: jest.fn(() => '{"action": "ACTION", "arg": "ARG"}'),
  setItem: jest.fn(),
  removeItem: jest.fn()
}
const dispatch = jest.fn(() => Promise.resolve('DISPATCHED'))
const commit = jest.fn()

describe('loginActionStorage', () => {
  let loginActionStorage
  beforeEach(() => {
    loginActionStorage = LoginActionStorage('KEY', storage)
  })

  describe('deferUntilLogin', () => {
    it('should execute immediately when the user information is available', () => {
      const store = {
        dispatch,
        commit,
        state: {config: {clientIdToken: 'TOKEN'}}
      }
      const result = loginActionStorage.deferUntilLogin(store, 'ACTION', 'ARG')
      expect(dispatch).toHaveBeenCalledWith('ACTION', 'ARG')
      return expect(result).resolves.toEqual('DISPATCHED')
    })

    it('should save to localStorage when the user information is unavailable', () => {
      const store = {
        dispatch,
        commit,
        state: {config: {clientIdToken: null}}
      }
      const result = loginActionStorage.deferUntilLogin(store, 'ACTION', 'ARG')
      expect(storage.setItem).toHaveBeenCalled()
      return expect(result).resolves.toBeNull()
    })

    it('should open the login modal when the user information is unavailable', () => {
      const store = {
        dispatch,
        commit,
        state: {config: {clientIdToken: null}}
      }
      const result = loginActionStorage.deferUntilLogin(store, 'ACTION', 'ARG')
      expect(commit).toHaveBeenCalledWith('SHOW_AUTH')
      return expect(result).resolves.toBeNull()
    })
  })

  describe('onLogin', () => {
    it('should call action from local storage and execute it when user is available', () => {
      const store = {
        dispatch,
        commit,
        state: {config: {clientIdToken: 'TOKEN'}}
      }
      const result = loginActionStorage.onLogin(store)
      expect(storage.getItem).toHaveBeenCalledWith('KEY')
      expect(dispatch).toHaveBeenCalledWith('ACTION', 'ARG')
      return expect(result).resolves.toEqual('DISPATCHED')
    })
  })

  describe('cancel', () => {
    it('should delete information from localStorage', () => {
      const store = {
        dispatch,
        state: {config: {clientIdToken: null}}
      }
      const result = loginActionStorage.cancel(store)
      expect(storage.removeItem).toHaveBeenCalledWith('KEY')
      return expect(result).resolves.toBeNull()
    })
  })
})

describe('loginActionStorage when no localStorage is bound', () => {
  let loginActionStorage
  beforeEach(() => {
    loginActionStorage = LoginActionStorage('KEY')
  })

  describe('deferUntilLogin', () => {
    it('should not throw when user information is available', () => {
      const store = {
        dispatch,
        commit,
        state: {config: {clientIdToken: 'TOKEN'}}
      }
      return expect(() => {
        loginActionStorage.deferUntilLogin(store, 'ACTION', 'ARG')
      }).not.toThrow()
    })

    it('should not throw when user information is unavailable', () => {
      const store = {
        dispatch,
        commit,
        state: {config: {clientIdToken: null}}
      }
      return expect(() => {
        loginActionStorage.deferUntilLogin(store, 'ACTION', 'ARG')
      }).not.toThrow()
    })
  })

  describe('onLogin', () => {
    it('should not throw when user information is available', () => {
      const store = {
        dispatch,
        state: {config: {clientIdToken: 'TOKEN'}}
      }
      return expect(() => {
        loginActionStorage.onLogin(store).catch(err => err)
      }).not.toThrow()
    })

    it('should not throw when user information is unavailable', () => {
      const store = {
        dispatch,
        state: {config: {clientIdToken: null}}
      }
      return expect(() => {
        loginActionStorage.onLogin(store).catch(err => err)
      }).not.toThrow()
    })
  })
})

describe('onLogin when there is nothing in storage', () => {
  const storage = {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn()
  }

  let loginActionStorage
  beforeEach(() => {
    loginActionStorage = LoginActionStorage('KEY', storage)
  })

  it('should not throw when storage is bound but there is nothing in storage', () => {
    const store = {
      state: {config: {clientIdToken: null}},
      dispatch
    }
    expect(() => {
      loginActionStorage.onLogin(store)
    }).not.toThrow()
    return expect(dispatch).not.toHaveBeenCalled()
  })
})
