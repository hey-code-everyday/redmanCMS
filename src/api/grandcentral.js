/*
  browser? ==> voucher
  node in production? => grandcentral
  node on your dev machine on the vpn? => conductor
*/

export default {
  getConfig (state) {
    const { spaceID, idToken, grandcentralUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/config`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getWebsiteConfig (state) {
    let { spaceID, idToken, grandcentralUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/componentConfig/Website`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getComponentConfig (state, component = 'Website') {
    let { spaceID, idToken, grandcentralUrl: url } = state.config

    if (process.browser) url = state.config.voucherUrl

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/componentConfig/` + component,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  putComponentConfig (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/app/website/admin/componentConfig/Website`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: state.website
    }
  },

  getHeader (state) {
    const { spaceID, idToken, grandcentralUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/header`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  putHeader (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/app/website/admin/header`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: state.header
    }
  },

  getFooter (state) {
    const { spaceID, idToken, grandcentralUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/footer`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  putFooter (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/app/website/admin/footer`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: state.footer
    }
  },

  getPages (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/page`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getPage (state, pageID) {
    let { spaceID, idToken, voucherUrl, grandcentralUrl: url } = state.config

    if (process.browser) url = voucherUrl

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/website/admin/page/${pageID}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  putPage (state, pageID, page) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/app/website/admin/page/${pageID}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: page
    }
  },

  deletePage (state, pageID) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'DELETE',
      url: url + `space/${spaceID}/app/website/admin/page/${pageID}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getAgents (state) {
    const { spaceID, idToken, grandcentralUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/agents?include_docs=true`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      query: {
        include_docs: true
      }
    }
  },

  getForms (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/app/redforms/designs/all`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getPublicInfo (state, mls) {
    const { spaceID, sources, grandcentralUrl: url } = state.config
    const src = sources[0]

    return {
      method: 'GET',
      url: url + `space/${spaceID}/listings/${src}/public/${mls}`,
      headers: {
        'Accept': 'application/json'
      }
    }
  },

  putPublicInfo (state, mls, body) {
    const { spaceID, idToken, sources, voucherUrl: url } = state.config
    const src = sources[0]

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/listings/${src}/public/${mls}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body
    }
  },
  getAgentRoster (state) {
    const { spaceID, gusUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/agents/roster`,
      headers: {
        'Accept': 'application/json'
      }
    }
  },

  getAgentRosterEdit (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/agents?include_docs=true`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getAgentExtraInfo (state, agentID) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/agents/${agentID}/extraInfo`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  addAgent (state, agentJson) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'POST',
      url: url + `space/${spaceID}/agents`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: agentJson
    }
  },

  updateAgent (state, agentId, agentJson) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/agents/${agentId}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: agentJson
    }
  },

  updateAgentExtraInfo (state, agentId, agentJson) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/agents/${agentId}/extraInfo`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: agentJson
    }
  },

  deleteAgent (state, agentId) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'DELETE',
      url: url + `space/${spaceID}/agents/${agentId}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  getOffices (state) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/org/chart`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  },

  updateOffices (state, offices) {
    const { spaceID, idToken, voucherUrl: url } = state.config

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/org/chart`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      },
      body: offices
    }
  },

  duplicatePage (state, newPageID) {
    const { spaceID, idToken, pageID, voucherUrl: url } = state.config;
    
    return {
      method: 'POST',
      url: url + `space/${spaceID}/app/website/admin/page/${pageID}/copy?newPageID=${newPageID}`,
      headers: {
        'Accept': 'application/json',
        'token': idToken
      }
    }
  }

}
