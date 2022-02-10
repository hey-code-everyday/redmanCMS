// @flow

const localStorage = process.browser ? window.localStorage : null

type StoreT = {
  state: Object,
  dispatch: Function,
  commit: Function
}

const LoginActionStoragePrototype = {
  getLocal: function () {
    if (!this.storage) return
    return JSON.parse(this.storage.getItem(this.key))
  },

  setLocal: function (items: Array<string>) {
    if (!this.storage) return
    this.storage.setItem(this.key, JSON.stringify(items))
  },

  removeLocal: function () {
    if (!this.storage) return
    this.storage.removeItem(this.key)
  },

  deferUntilLogin: function (store: StoreT, actionName: string, arg: any) {
    //store.state.idToken is taken from store index and equals clientIdToken
    if (store.state.config.clientIdToken || store.state.idToken) {
      return store.dispatch(actionName, arg)
    }
    this.setLocal({action: actionName, arg})
    store.commit('SHOW_AUTH')
    return Promise.resolve(null)
  },

  onLogin: function (store: StoreT) {
    if (store.state.config.clientIdToken) {
      const localData = this.getLocal()
      if (!localData) return Promise.resolve(null)
      this.removeLocal()

      const {action, arg} = localData
      return store.dispatch(action, arg)
    }

    this.removeLocal()
    return Promise.resolve(null)
  },

  cancel: function () {
    this.removeLocal()
    return Promise.resolve(null)
  }
}

export const LoginActionStorage = (key: string, storage: (Object | null) = null) => {
  const loginActionStorage = Object.create(LoginActionStoragePrototype)
  loginActionStorage.key = key
  loginActionStorage.storage = storage
  return loginActionStorage
}

export default LoginActionStorage('gusLocalActions', localStorage)
