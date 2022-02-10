import createStrap from './defaults/strap'

export default {
  hero (state) {
    return state.page.hero
  },

  straps (state) {
    if (!state.page.straps) return undefined

    const sorted = state.page.straps.sort((a, b) => {
      if (a.order > b.order) return 1
      if (a.order < b.order) return -1
      return 0
    })

    return sorted
  },

  hasPageError (state) {
    return state.page.error !== undefined
  },

  errorStrap (state) {
    if (state.page && state.page.straps) {
      return state.page.straps.find(s => s.id === 'error')
    } else return null
  },

  emptyStrap (state) {
    return createStrap('empty', -1, 'strap-empty')
  },

  canEdit (state) {
    return state.config.idToken && state.auth.isAuthenticated()
  },

  authenticated (state) {
    return state.config.idToken && state.auth.isAuthenticated()
  },

  clientAuthenticated (state) {
    return state.config.clientIdToken
  },

  featureEnabled (state) {
    return function (feature) {
      if (state.config.features[feature]) return state.config.features[feature]
      else return false
    }
  },

  isCmsPage (state) {
    if (state.config.pageID !== 'access') return true
    return false
  },

  modalOpen (state) {
    if (state.ui.mobileNavVisible || state.ui.mobileScreens.length) return true

    for (let key in state.ui.modals) {
      if (state.ui.modals[key]) return true
    }

    return false
  },

  source (state) {
    return state.config.sources[0]
  },

  theme (state) {
    return state.website.theme
  },

  palette (state) {
    return function (theme) {
      if (theme === 'header') return state.website.theme.header
      return state.website.theme.straps[theme]
    }
  },

  agent (state) {
    return state.agents.find(r => r.uid === state.currentAgent)
  },

  socialLinks (state) {
    if (state.website && state.website.config) {
      return state.website.config.social
    }
    return {}
  },

  // Evil!
  isMobile (state) {
    if (process.browser) {
      const ua = navigator.userAgent
      return (/Mobi|Android/i.test(ua)) || (state.ui.screen.width <= 768)
    }

    const ua = state.request && state.request['user-agent']

    if (ua) {
      return /Mobi|Android/i.test(ua)
    } else {
      return false
    }
  },

  isIE11 () {
    if (process.browser) {
      const ua = navigator.userAgent
      return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident') > -1
    } else {
      return false
    }
  }
}
