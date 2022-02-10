function getLocalState () {
  const stateKey = '__PHOENIX__'

  const localState = localStorage.getItem(stateKey)

  if (localState === null) {
    localStorage.setItem(stateKey, '{}')
    return {}
  }

  return JSON.parse(localState)
}

function setLocalState (state, key) {
  const stateKey = '__PHOENIX__'
  localStorage.setItem(stateKey, JSON.stringify(state))
}

function getLocalPages () {
  const stateKey = '__PHOENIX_PAGES__'

  const localState = localStorage.getItem(stateKey)

  if (localState === null) {
    localStorage.setItem(stateKey, '{}')
    return {}
  }

  return JSON.parse(localState)
}

function getLocalPage (pageID) {
  const pages = getLocalPages()
  return pages[pageID]
}

function setLocalPage (pageID, page) {
  const stateKey = '__PHOENIX_PAGES__'

  const pages = getLocalPages()
  pages[pageID] = page

  localStorage.setItem(stateKey, JSON.stringify(pages))
}

function deleteLocalPage (pageID) {
  const stateKey = '__PHOENIX_PAGES__'

  const pages = getLocalPages()
  delete pages[pageID]

  localStorage.setItem(stateKey, JSON.stringify(pages))
}

function resolveDelayed (resolve, payload) {
  setTimeout(() => {
    resolve(payload)
  }, 600)
}

export default {
  getState (state) {
    return new Promise((resolve, reject) => {
      try {
        resolve(getLocalState())
      } catch (e) {
        reject(e)
      }
    })
  },

  setWebsite (state) {
    return new Promise((resolve, reject) => {
      try {
        const localState = getLocalState()

        localState.website = state.website

        setLocalState(localState)

        resolveDelayed(resolve, true)
      } catch (e) {
        reject(e)
      }
    })
  },

  setHeader (state) {
    return new Promise((resolve, reject) => {
      try {
        const localState = getLocalState()

        localState.header = state.header

        setLocalState(localState)

        resolveDelayed(resolve, true)
      } catch (e) {
        reject(e)
      }
    })
  },

  setFooter (state) {
    return new Promise((resolve, reject) => {
      try {
        const localState = getLocalState()

        localState.footer = state.footer

        setLocalState(localState)

        resolveDelayed(resolve, true)
      } catch (e) {
        reject(e)
      }
    })
  },

  getPages (state, pageID) {
    return new Promise((resolve, reject) => {
      try {
        resolveDelayed(resolve, getLocalPages())
      } catch (e) {
        reject(e)
      }
    })
  },

  getPage (state, pageID) {
    return new Promise((resolve, reject) => {
      try {
        resolveDelayed(resolve, getLocalPage(pageID))
      } catch (e) {
        reject(e)
      }
    })
  },

  setPage (state, pageID, page) {
    return new Promise((resolve, reject) => {
      try {
        setLocalPage(pageID, page)

        resolveDelayed(resolve, true)
      } catch (e) {
        reject(e)
      }
    })
  },

  deletePage (state, pageID) {
    return new Promise((resolve, reject) => {
      try {
        deleteLocalPage(pageID)

        resolveDelayed(resolve, true)
      } catch (e) {
        reject(e)
      }
    })
  }
}
