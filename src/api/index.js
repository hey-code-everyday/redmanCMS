import gus from './gus'
import grandcentral from './grandcentral'
import wordpress from './wordpress'
import engine from './engine'
import hypervue from './hypervue'

const popsicle = require('popsicle')

let localhost = false
if (process.browser) {
  localhost = require('./localhost').default
}

function call (options) {
  return popsicle
    .request(options)
    .use(popsicle.plugins.parse('json'))
}

export default {
  // Remote API

  getConfig (state) {
    return call(grandcentral.getConfig(state))
  },

  getWebsite (state) {
    return call(grandcentral.getWebsiteConfig(state))
  },

  getComponent (state, component) {
    return call(grandcentral.getComponentConfig(state, component))
  },

  putWebsite (state) {
    // return call(grandcentral.putComponentConfig(state))

    return popsicle
      .request(grandcentral.putComponentConfig(state))
  },

  getHeader (state) {
    return call(grandcentral.getHeader(state))
  },

  putHeader (state) {
    // return call(grandcentral.putHeader(state))

    return popsicle
      .request(grandcentral.putHeader(state))
  },

  getFooter (state) {
    return call(grandcentral.getFooter(state))
  },

  putFooter (state) {
    // return call(grandcentral.putFooter(state))

    return popsicle
      .request(grandcentral.putFooter(state))
  },

  getPages (state) {
    // return call(grandcentral.getPages(state))

    return popsicle
      .request(grandcentral.getPages(state))
  },

  getPage (state, pageID) {
    return call(grandcentral.getPage(state, pageID))
  },

  putPage (state, pageID, page) {
    // return call(grandcentral.putPage(state, pageID, page))

    return popsicle
      .request(grandcentral.putPage(state, pageID, page))
  },

  deletePage (state, pageID) {
    // return call(grandcentral.deletePage(state, pageID))

    return popsicle
      .request(grandcentral.deletePage(state, pageID))
  },

  getAgents (state) {
    return call(grandcentral.getAgents(state))
  },

  getForms (state) {
    return call(grandcentral.getForms(state))
  },

  getFormFields (state, formID) {
    return call(gus.getFormFields(state, formID))
  },

  submitForm (state, formID, payload) {
    return call(gus.submitForm(state, formID, payload))
  },

  getAgentRoster (state) {
    return call(grandcentral.getAgentRoster(state))
  },

  getAgentRosterForEditing (state) {
    return call(grandcentral.getAgentRosterEdit(state))
  },

  getAgentExtraInfo (state, agentId) {
    return call(grandcentral.getAgentExtraInfo(state, agentId))
  },

  updateAgent (state, agentId, agentJson) {
    return call(grandcentral.updateAgent(state, agentId, agentJson))
  },

  addAgent (state, agentJson) {
    return call(grandcentral.addAgent(state, agentJson))
  },

  updateExtraInfo (state, agentId, agentJson) {
    return call(grandcentral.updateAgentExtraInfo(state, agentId, agentJson))
  },

  deleteAgent (state, agentId) {
    return call(grandcentral.deleteAgent(state, agentId))
  },

  getOffices (state) {
    return call(grandcentral.getOffices(state))
  },

  putOffice (state, offices) {
    return call(grandcentral.updateOffices(state, offices))
  },

  // Local API

  getStateLocal (state) {
    if (!localhost) return { status: 500 }
    return localhost.getState(state)
  },

  setWebsiteLocal (state) {
    if (!localhost) return { status: 500 }
    return localhost.setWebsite(state)
  },

  setHeaderLocal (state) {
    if (!localhost) return { status: 500 }
    return localhost.setHeader(state)
  },

  setFooterLocal (state) {
    if (!localhost) return { status: 500 }
    return localhost.setFooter(state)
  },

  getPagesLocal (state) {
    if (!localhost) return { status: 500 }
    return localhost.getPages(state)
  },

  getPageLocal (state, pageID) {
    if (!localhost) return { status: 500 }
    return localhost.getPage(state, pageID)
  },

  setPageLocal (state, pageID, page) {
    if (!localhost) return { status: 500 }
    return localhost.setPage(state, pageID, page)
  },

  deletePageLocal (state, pageID) {
    if (!localhost) return { status: 500 }
    return localhost.deletePage(state, pageID)
  },

  // GUS/Listings API

  getAutocomplete (state, str, source = 'gus') {
    if (source === 'gus') {
      return call(gus.getAutocomplete(state, str))
    }
  },

  searchListings (state, filters = {}, source = 'gus') {
    if (source === 'gus') {
      const defaults = {
        select_additional: 'description|province|city|open_houses',
        sort: 'list_date_des',
        size: 15
      }
      const merged = Object.assign(defaults, filters)

      return call(gus.searchListings(state, merged))
    }
  },

  getListings (state, ids, source = 'gus') {
    if (source === 'gus') {
      return call(gus.getListings(state, ids))
    }
  },

  getSoldListings (state, filters = {}, source = 'gus') {
    if (source === 'gus') {
      return call(gus.getSoldListings(state, filters))
    }
  },

  getSoldDetail (state, id, source = 'gus') {
    if (source === 'gus') {
      return call(gus.getSoldDetail(state, id))
    }
  },

  getHierarchiesByLatLon (state, latLon) {
    return call(gus.getHierarchiesByLatLon(state, latLon))
  },

  getFavorites (state, extra) {
    return call(gus.getFavorites(state, extra))
  },

  putFavorite (state, mls) {
    return call(gus.putFavorite(state, mls))
  },

  deleteFavorite (state, mls) {
    return call(gus.deleteFavorite(state, mls))
  },

  getStats (state, filters) {
    return call(gus.getStats(state, filters))
  },

  getPublicInfo (state, mls) {
    return call(grandcentral.getPublicInfo(state, mls))
  },

  putPublicInfo (state, mls, body) {
    return call(grandcentral.putPublicInfo(state, mls, body))
  },

  // Blog API

  getBlogPosts (state, filters = {}, params = {}) {
    const defaults = {
      posts_per_page: 2,
      orderby: 'date',
      order: 'DESC'
    }
    const merged = Object.assign(defaults, filters)

    return call(wordpress.v1.getPosts(state, merged, params))
  },

  getBlogPost (state, postID) {
    return call(wordpress.v1.getPost(state, postID))
  },

  getBlogCategories (state) {
    return call(wordpress.v1.getCategories(state))
  },

  // Engine

  getEnginePage (state, pageID) {
    return call(engine.getPage(state, pageID))
  },

  getEnginePages (state) {
    return call(engine.getPages(state))
  },

  getEngineWebsite (state) {
    return call(engine.getWebsite(state))
  },

  // Hypervue

  invalidateCache (state, pageID) {
    return call(hypervue.invalidateCache(state, pageID))
  },

  // Page Duplication
  duplicatePage (state, newPageID) {
    return call(grandcentral.duplicatePage(state, newPageID))
  }
}
