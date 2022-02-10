import Vue from 'vue'
import auth0 from 'auth0-js'
import Cookies from 'js-cookie'
import EventEmitter from 'events'

export default class AuthService {
  constructor ({ domain, clientID, redirectUrl: redirectUri }, store, router, action, namespace) {
    const ourUrl = btoa(window.location.toString().split('#')[0])
    this.auth0 = new auth0.WebAuth({
      domain,
      clientID,
      redirectUri,
      responseType: 'code',
      scope: 'openid email',
      state: `space:${store.state.config.spaceID}|returnTo:${ourUrl}`
    })

    this.authNotifier = new EventEmitter()
    this.store = store
    this.router = router

    this.action = action
    this.namespace = namespace
  }

  handleAuthentication () {
    const namespace = this.namespace

    if (this.isAuthenticated()) {
      /* eslint-disable */
      const access_token = localStorage.getItem(namespace + '_access_token')
      const id_token = localStorage.getItem(namespace + '_id_token')
      const expires_at = localStorage.getItem(namespace + '_expires_at')
      /* eslint-enable */

      const authResult = {
        access_token,
        id_token,
        expires_at
      }

      this.store.dispatch(this.action, { authResult, router: this.router })

      return true
    }

    const hash = window.location.hash.replace('#', '')

    Vue.nextTick(() => {
      const currentRoute = this.router.currentRoute.name

      if (!hash || currentRoute !== 'AdminLogin') return false

      if (process.browser) {
        if (hash === 'map') {
          localStorage.setItem('setAnchor', hash)
        } else {
          localStorage.removeItem('setAnchor')
        }
      }

      const curNamespace = localStorage.getItem('authNamespace')
      if (!curNamespace || curNamespace !== namespace) return

      localStorage.setItem('authNamespace', null)

      const parts = hash.split('&')
      const authResult = {}
      parts.forEach(p => {
        p = p.split('=')
        authResult[p[0]] = p[1]
      })

      if (authResult && authResult.access_token && authResult.id_token) {
        this.setSession(authResult)
        this.store.dispatch(this.action, { authResult, router: this.router })
        window.location.hash = ''
        window.location.pathname = '/'
      } else if (authResult.error) {
        this.store.dispatch(this.action, { err: authResult.error, router: this.router })
        console.warn(authResult.error)
      }
    })
  }

  setSession (authResult) {
    const namespace = this.namespace

    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expires_in * 1000 + new Date().getTime()
    )
    localStorage.setItem(namespace + '_access_token', authResult.access_token)
    localStorage.setItem(namespace + '_id_token', authResult.id_token)
    localStorage.setItem(namespace + '_expires_at', expiresAt)
    this.authNotifier.emit('authChange', { authResult, router: this.router })
  }

  login () {
    const { state } = this.store

    this.auth0.authorize({
      app: 'page-builder',
      title: state.website.config.display.siteName,
      source: 'agent',
      space_id: state.config.spaceID,
      main_color: state.website.theme.straps.default.uiPrimary.bgColor
    })
  }

  logout () {
    const spaceID = this.store.state.config.spaceID
    const namespace = this.namespace

    // Clear access token and ID token from local storage
    localStorage.removeItem(namespace + '_access_token')
    localStorage.removeItem(namespace + '_id_token')
    localStorage.removeItem(namespace + '_expires_at')

    Cookies.remove('idToken')

    this.userProfile = null
    this.authNotifier.emit('authChange', { router: this.router })

    window.location.replace('https://gus.rmcloud.com/login/auth0/logout/callback?spaceId=' + spaceID)
  }

  isAuthenticated () {
    const namespace = this.namespace

    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem(namespace + '_expires_at'))
    return new Date().getTime() < expiresAt
  }
}
