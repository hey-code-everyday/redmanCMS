import Vue from 'vue'
import deepmerge from 'deepmerge'
import pageConfigSchema from '@/constants/schemas/page-config'
import websiteConfigSchema from '@/constants/schemas/website-config'

function findInitial (schema) {
  for (let g in schema.groups) {
    const group = schema.groups[g]

    for (let p in group.panels) {
      const panel = group.panels[p]

      for (let t in panel.tabs) {
        const tab = panel.tabs[t]

        if (tab.initial) {
          return {
            curGroup: group,
            curPanel: panel,
            curTab: tab
          }
        }
      }
    }
  }

  return null
}

function setInitial (schema) {
  const initial = findInitial(schema)

  if (initial !== null) {
    schema.curGroup = initial.curGroup
    schema.curPanel = initial.curPanel
    schema.curTab = initial.curTab
  }
}

export default {
  SHOW_STRAP_MODAL ({ ui: state }, { schema, strapId }) {
    setInitial(schema)

    schema.strapId = strapId

    Vue.set(state.modals, 'strap', schema)
  },

  HIDE_STRAP_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'strap', false)
  },

  SET_STRAP_MODAL_SELECTED ({ ui: state }, { curGroup, curPanel, curTab }) {
    if (curGroup !== undefined) Vue.set(state.modals.strap, 'curGroup', curGroup)
    if (curPanel !== undefined) Vue.set(state.modals.strap, 'curPanel', curPanel)
    if (curTab !== undefined) Vue.set(state.modals.strap, 'curTab', curTab)
  },

  SET_WEBSITE_MODAL_SELECTED ({ ui: state }, { curGroup, curPanel, curTab }) {
    if (curGroup !== undefined) Vue.set(state.modals.website, 'curGroup', curGroup)
    if (curPanel !== undefined) Vue.set(state.modals.website, 'curPanel', curPanel)
    if (curTab !== undefined) Vue.set(state.modals.website, 'curTab', curTab)
  },

  SHOW_WEBSITE_MODAL ({ ui: state }) {
    const schema = websiteConfigSchema()

    setInitial(schema)

    Vue.set(state.modals, 'website', schema)
  },

  HIDE_WEBSITE_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'website', false)
  },

  SHOW_PAGE_MODAL ({ ui: state }) {
    const schema = pageConfigSchema()

    setInitial(schema)

    Vue.set(state.modals, 'page', schema)
  },

  HIDE_PAGE_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'page', false)
  },

  SHOW_MANAGE_PAGES_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'managePages', {})
  },

  HIDE_MANAGE_PAGES_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'managePages', false)
  },

  SHOW_CUSTOM_MODAL ({ ui: state }, payload) {
    const defaults = {
      state: {},
      template: '',
      component: null,
      settings: {
        width: 'auto',
        height: 'auto',
        padded: false,
        palette: 'default',
        canClose: true
      }
    }
    const data = deepmerge(defaults, payload)

    Vue.set(state.modals, 'custom', data)
  },

  HIDE_CUSTOM_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'custom', false)
  },

  LOCK_MODAL_CLOSE ({ ui: state }) {
    const { custom } = state.modals

    if (custom) {
      custom.settings.canClose = false
    }
  },

  UNLOCK_MODAL_CLOSE ({ ui: state }) {
    const { custom } = state.modals

    if (custom) {
      custom.settings.canClose = true
    }
  },

  HIDE_ALL_MODALS ({ ui: state }) {
    for (let key in state.modals) {
      Vue.set(state.modals, key, false)
    }
  },

  SHOW_MOBILE_SCREEN ({ ui: state }, payload) {
    const defaults = {
      transition: 'left'
    }

    const screen = deepmerge(defaults, payload)
    state.mobileScreens.push(screen)
  },

  HIDE_MOBILE_SCREEN ({ ui: state }, id) {
    state.mobileScreens.splice(state.mobileScreens.length - 1, 1)
  },

  SHOW_EDIT_COMPONENT ({ ui: state }, payload) {
    Vue.set(state, 'editComponent', payload)
  },

  HIDE_EDIT_COMPONENT ({ ui: state }) {
    Vue.set(state, 'editComponent', false)
  },

  SHOW_MOBILE_NAV ({ ui: state }) {
    Vue.set(state, 'mobileNavVisible', true)
  },

  HIDE_MOBILE_NAV ({ ui: state }) {
    Vue.set(state, 'mobileNavVisible', false)
  },

  SHOW_NOTIFICATION ({ ui: state }, payload) {
    state.notifications.forEach(n => { n.timeout = 0 })
    state.notifications.push(payload)
  },

  HIDE_NOTIFICATION ({ ui: state }, id) {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index === -1) return

    const hidden = state.notifications.splice(index, 1)

    state.expiredNotifications.push(hidden)
    if (state.expiredNotifications.length > 50) {
      state.expiredNotifications.splice(0, 1)
    }
  },

  TICK_NOTIFICATION ({ ui: state }, { id, amount }) {
    const notification = state.notifications.find(n => n.id === id)
    if (notification) notification.timeout = notification.timeout + amount
  },

  RESET_NOTIFICATION ({ ui: state }, id) {
    const notification = state.notifications.find(n => n.id === id)
    if (notification) notification.timeout = 0
  },

  SET_SCREEN_SIZE ({ ui: state }, { width, height }) {
    if (width) state.screen.width = width
    if (height) state.screen.height = height
  },

  SHOW_ESTIMATE_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'estimateModal', true)
  },

  HIDE_ESTIMATE_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'estimateModal', false)
  },

  SET_ESTIMATE_ADDRESS ({ ui: state }, address) {
    Vue.set(state, 'estimateAddress', address)
  },

  SHOW_NEW_LISTING_DETAILS_MODAL ({ ui: state }) {
    Vue.set(state.modals, 'newListingDetailsModal', true)
  },

  SET_NEW_LISTING_DETAILS_MODAL_IMG_ID ({ ui: state }, id) {
    Vue.set(state, 'newListingDetailsModalSelectedImgID', id)
  },

  SET_NEW_LISTING_DETAILS_SEARCH_RESULT ({ ui: state }, searchResult) {
    Vue.set(state, 'newListingDetailsSearchResult', searchResult)
  }
}
