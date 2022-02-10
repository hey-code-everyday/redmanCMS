const v1 = {
  getPosts (state, filter, params) {
    const { blogUrl: url } = state.website.config.setup

    const query = {}
    for (let key in filter) {
      query[`filter[${key}]`] = filter[key]
    }
    for (let key in params) {
      query[key] = params[key]
    }

    return {
      method: 'GET',
      url: url + `/wp-json/posts`,
      headers: {
        'Accept': 'application/json'
      },
      query
    }
  },

  getPost (state, slug) {
    const { blogUrl: url } = state.website.config.setup

    return {
      method: 'GET',
      url: url + `/wp-json/posts?filter[name]=` + slug,
      headers: {
        'Accept': 'application/json'
      }
    }
  },

  getCategories (state) {
    const { blogUrl: url } = state.website.config.setup

    return {
      method: 'GET',
      url: url + `/wp-json/taxonomies/category/terms`,
      headers: {
        'Accept': 'application/json'
      }
    }
  }
}

export default {
  v1
}
