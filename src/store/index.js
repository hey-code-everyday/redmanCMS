import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import ui from './ui'
import defaultQuill from '@/store/defaults/components/quill'
import defaultImage from '@/store/defaults/components/image'
import defaultLink from '@/store/defaults/components/link'
import {createNagStore} from '@/modules/nags'

Vue.use(Vuex)

export default function (config, router) {
  /* eslint-disable no-new */

  const store = new Vuex.Store({
    state: {
      dev: (process.browser && window.location.origin.includes('web10')) || process.env.NODE_ENV === 'development',
      dirty: false,
      editing: false,

      // Modals, notifications, etc
      ui: {
        notifications: [],
        expiredNotifications: [],
        editComponent: false,
        mobileNavVisible: false,
        authVisible: false,
        modals: {
          managePages: false,
          website: false,
          strap: false,
          page: false,
          custom: false,
          estimateModal: false,
          newListingDetailsModal: false
        },
        estimateAddress: '',
        newListingDetailsModalSelectedImgID: null,
        newListingDetailsSearchResult: {},
        screen: {
          width: 0,
          height: 0
        },
        mobileScreens: []
      },

      // Configuration
      config,
      request: undefined,

      // Content
      website: {},
      header: {
        name: 'header-basic',
        nav: [
          {
            label: 'Top Level 1',
            href: '',
            linkOut: false,
            dropdown: [
              {
                label: 'Nav Item 1',
                href: '/',
                linkOut: false
              },
              {
                label: 'Nav Item 2',
                href: '/',
                linkOut: false
              },
              {
                label: 'Nav Item 3',
                href: '/',
                linkOut: false
              }
            ]
          },
          {
            label: 'Top Level 2',
            href: '/',
            linkOut: false,
            dropdown: []
          }
        ],
        config: {
          fixed: false
        },
        state: {
          logo: defaultImage({ imageUrl: 'https://cdnassets.rmcloud.com/frontend/static/assets/images/redman-demo-site-dark.png', href: '/index', height: 40 }),
          title: defaultQuill({ html: '<h2><a href="/index">{{ website.config.display.siteName }}</a></h2>' })
        }
      },
      footer: {
        name: 'footer-basic',
        nav: [],
        config: {
          style: {
            theme: 'default'
          }
        },
        state: {
          linkList1: [],
          linkList2: [
            defaultLink({ icon: 'icon-telephone', text: '{{ filters.phoneNumber(office.phone) }}', href: 'tel:{{ office.phone }}' }),
            defaultLink({ icon: 'icon-envelope-open', text: '{{ office.email }}', href: 'mailto:{{ office.email }}' })
          ]
        }
      },

      headerMeta: {},
      footerMeta: {},
      page: {},
      pageType: null,

      last: {
        website: {},
        header: {
          name: '',
          nav: [],
          config: {},
          state: {}
        },
        footer: {
          name: '',
          nav: [],
          config: {},
          state: {}
        },
        page: {}
      },

      prefetchedData: {},

      // Current user
      auth: null,
      clientAuth: null,
      client: {
        favorites: undefined
      },

      // Agents
      agents: [
        {
          _rev: '1',
          _id: '1',
          role: 'realtor',
          displayName: 'Laura Ipsum',
          email: 'sales@redmantech.com',
          mobilePhones: [
            '7804256270'
          ],
          uid: '1',
          email_verified: false
        }
      ],
      currentAgent: '1'
    },

    // Custom events
    pageAPI: undefined,

    actions: {
      ...actions,
      ...ui.actions
    },

    getters,

    mutations: {
      ...mutations,
      ...ui.mutations
    },

    modules: {
      nag: createNagStore(config, {done: 'submit', showLock: 'SHOW_AUTH'})
    }
  })

  // Store event bus

  store.on = function () {}
  store.off = function () {}
  store.trigger = function () {}

  if (process.browser && typeof EventTarget !== 'undefined') {
    const storeTarget = document.createDocumentFragment()

    store.on = function (eventName, handler) {
      storeTarget.addEventListener(eventName, handler)
    }

    store.off = function (eventName, handler) {
      storeTarget.removeEventListener(eventName, handler)
    }

    store.trigger = function (eventName, payload) {
      const event = new Event(eventName)
      event.data = payload
      storeTarget.dispatchEvent(event)
    }
  }

  function makeAuth (authConfig, mutation, action, namespace) {
    const AuthService = require('@/auth/auth-service').default
    const auth = new AuthService(authConfig, store, router, action, namespace)
    const { authNotifier } = auth

    store.commit(mutation, auth)

    authNotifier.on('authChange', authState => {
      store.dispatch(action, authState)
    })

    auth.handleAuthentication()
  }

  // Auth
  if (process.browser) {
    makeAuth(config.auth0, 'SET_AUTH', 'handleAuth', 'agent')
  }

  return store
}
