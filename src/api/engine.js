export default {
  getPage (state, pageID) {
    const { spaceID, engineUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `getPage/${spaceID}/${pageID}`,
      headers: {
        'Accept': 'application/json'
      }
    }
  },

  getPages (state) {
    const { spaceID, engineUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `getPages/${spaceID}`,
      headers: {
        'Accept': 'application/json'
      }
    }
  },

  getWebsite (state) {
    const { spaceID, engineUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `getWebsite/${spaceID}`,
      headers: {
        'Accept': 'application/json'
      }
    }
  }
}
