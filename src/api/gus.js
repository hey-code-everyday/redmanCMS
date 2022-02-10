export default {
  getAutocomplete (state, str) {
    const { sources, autocomplete, gusUrl: url } = state.config
    const src = sources[0]

    return {
      method: 'GET',
      url: url + `${src}/autocomplete-v2/${str}`,
      headers: {
        'Accept': 'application/json'
      },
      query: autocomplete
    }
  },

  searchListings (state, filters) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const src = sources[0]

    return {
      method: 'GET',
      url: url + `space/${spaceID}/search/${src}/q`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      },
      query: filters
    }
  },

  getListings (state, ids, filters = {}) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const src = sources[0]

    return {
      method: 'GET',
      url: url + `space/${spaceID}/search/${src}/listings/${ids.join('|')}`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      }
    }
  },

  getSoldListings (state, filters = {}) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const offset = filters.from ? filters.from : 0
    const src = sources[0]
    const paginationAmount = filters.paginationAmount ? filters.paginationAmount : 9
    return {
      method: 'GET',
      url: url + `space/${spaceID}/solds/${src}/office?limit=${paginationAmount}&offset=${offset}`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      }
    }
  },

  getSoldDetail (state, id) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const src = sources[0]
    
    return {
      method: 'GET',
      url: url + `space/${spaceID}/solds/${src}/office/${id}`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      }
    }
  },

  getFavorites (state, extra = {}) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const src = sources[0]

    return {
      method: 'GET',
      url: url + `space/${spaceID}/profile/likes/${src}`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      },
      query: extra
    }
  },

  putFavorite (state, mls) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const src = sources[0]

    return {
      method: 'PUT',
      url: url + `space/${spaceID}/profile/likes/${src}/${mls}`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      }
    }
  },

  deleteFavorite (state, mls) {
    const { spaceID, sources, gusUrl: url, clientIdToken } = state.config
    const src = sources[0]

    return {
      method: 'DELETE',
      url: url + `space/${spaceID}/profile/likes/${src}/${mls}`,
      headers: {
        'Accept': 'application/json',
        token: clientIdToken
      }
    }
  },

  getHierarchiesByLatLon (state, latLon) {
    const { gusUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `whosonfirst/places/getHierarchiesByLatLon`,
      headers: {
        'Accept': 'application/json'
      },
      query: {
        ...latLon
      }
    }
  },

  getStats (state, filters = {}) {
    const { spaceID, sources, gusUrl: url } = state.config
    const src = sources[0]

    return {
      method: 'GET',
      url: url + `space/${spaceID}/search/${src}/info`,
      headers: {
        'Accept': 'application/json'
      },
      query: filters
    }
  },

  getFormFields (state, formID) {
    const { spaceID, clientIdToken, gusUrl: url } = state.config

    return {
      method: 'GET',
      url: url + `space/${spaceID}/profile/form/${formID}/view`,
      headers: {
        'Accept': 'application/json',
        'token': clientIdToken
      }
    }
  },

  submitForm (state, formID, payload) {
    const { spaceID, clientIdToken, gusUrl: url } = state.config

    return {
      method: 'POST',
      url: url + `space/${spaceID}/profile/form/${formID}/submit`,
      headers: {
        'Accept': 'application/json',
        'token': clientIdToken
      },
      body: payload
    }
  }
}
