import api from '../api'
import { swapRawFilter } from '../modules/listing-search/api/buildFilters'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export function makeFilters (store, state, filters = {}) {
  const { agentID } = store.state.website.config.setup
  const { autocomplete } = store.state.config
  const { useRealtorListings, centerSearch, predefinedSearch, orgChartOptions, useOpenHouse } = state

  if (!predefinedSearch) {
    if (useRealtorListings) {
      filters.agent_id = agentID
    }
    if (centerSearch) {
      filters.distance_from_lat = autocomplete['focus.lat']
      filters.distance_from_lon = autocomplete['focus.lon']
      filters.distance_from_radius = autocomplete['distance']
    }
  }

  if (useOpenHouse) {
    filters.open_houses = true
    filters.sort = 'open_houses_date_asc'
    if (orgChartOptions) {
      filters.org_chart_id = orgChartOptions
      filters.org_chart_include_children = true
    }
  }

  return filters
}

export function decodeSearch (search) {
  const { geo, filters } = search

  if (!geo) {
    return filters
  }

  if (geo['whosonfirst.id']) {
    return {
      ...filters,
      'whosonfirst.id': geo['whosonfirst.id']
    }
  }

  if (geo['pre_indexed_shape.id']) {
    return {
      ...filters,
      'pre_indexed_shape.id': geo['pre_indexed_shape.id'],
      'pre_indexed_shape.index': (geo['pre_indexed_shape.index'] || null)
    }
  }

  if (geo['location']) {
    return {
      ...filters,
      'sort_centre_lat': geo['centre_lat'],
      'sort_centre_lon': geo['centre_lon']
    }
  }

  return filters
}

export function mapListings (response) {
  if (response.body && response.body.hits && response.body.hits.hits) {
    return response.body.hits.hits.map(hit => {
      return { courtesyOfMessage: response.body.courtesyOfMessage, id: hit._id, ...hit._source }
    })
  } else return {}
}

export function mapSoldListings (response) {
  if (response.body.ok && response.body.listings) {
    return response.body.listings.map(sold => {
      return { ...sold }
    })
  } else return {}
}

export function changeSoldResponseJsonStructure (soldDetailResponse) {
  const result = {
    id: soldDetailResponse.mlsNum,
    address: soldDetailResponse.streetAddress,
    city: soldDetailResponse.city,
    province: soldDetailResponse.state,
    publicId: soldDetailResponse.mlsNum,
    description: soldDetailResponse.remarks,
    images: soldDetailResponse.photos.map(row => row.url),
    price: soldDetailResponse.price,
    location: {
      lat: soldDetailResponse.lat,
      lon: soldDetailResponse.lng
    },
    building_types: soldDetailResponse.homeStyle,
    soldDate: soldDetailResponse.soldDate,
    askingPrice: soldDetailResponse.price,
    soldPrice: soldDetailResponse.soldPrice,
  }
  return result
}

export function prefetchListings (resolve, reject, store, state, filters = {}, cached) {
  if (state.state) state = state.state

  filters = { ...makeFilters(store, state, filters) }
  const { useAdvancedSetup, advancedSetup, predefinedSearch: pcsKey} = state

  if (useAdvancedSetup) {
    if (!advancedSetup) {
      reject(new Error('Empty setup object.'))
    }

    let search
    try {
      search = JSON.parse(advancedSetup)
    } catch (err) {
      reject(err)
    }

    return api.getComponent(store.state, 'Search')
      .then(response => {
        if (response.error) {
          reject(response.error)
        }

        const config = response.body

        filters = Object.assign(filters, decodeSearch(search))
        filters = swapRawFilter(filters, {}, 0, config)

        if (filters.raw === null) delete filters.raw
        delete filters.userSetRaw
        delete filters.agentSetRaw

        api.searchListings(store.state, filters)
          .then(response => resolve({ hits: response.body.hits.total, listings: mapListings(response), search, config }))
          .catch(err => reject(err))
      })
      .catch(err => {
        reject(err)
      })
  } else if (pcsKey) {
    if (cached) {
      filters = Object.assign(filters, decodeSearch(cached.search))
      filters = swapRawFilter(filters, {}, 0, cached.config)

      if (filters.raw === null) delete filters.raw
      delete filters.userSetRaw
      delete filters.agentSetRaw

      return api.searchListings(store.state, filters)
        .then(response => resolve({ hits: response.body.hits.total, listings: mapListings(response), search: cached.search, config: cached.config }))
        .catch(err => reject(err))
    }

    return api.getComponent(store.state, 'Search')
      .then(response => {
        if (response.error) {
          reject(response.error)
        }

        const config = response.body
        const search = config.preconfiguredSearches[pcsKey]

        filters = Object.assign(filters, decodeSearch(search))
        filters = swapRawFilter(filters, {}, 0, config)

        if (filters.raw === null) delete filters.raw
        delete filters.userSetRaw
        delete filters.agentSetRaw

        return api.searchListings(store.state, filters)
          .then(response => resolve({ hits: response.body.hits.total, listings: mapListings(response), search, config }))
          .catch(err => reject(err))
      }).catch(err => {
        reject(err)
      })
  }

  return api.searchListings(store.state, filters)
    .then(response => {
      resolve({ hits: response.body.hits.total, listings: mapListings(response), search: false, config: false })})
    .catch(err => reject(err))
}

export function prefetchSoldListings (resolve, reject, store, state, filters = {}, cached) {
  if (state.state) state = state.state

  filters = { ...makeFilters(store, state, filters), paginationAmount: state.defaultListingAmount }
  const { useAdvancedSetup, advancedSetup, predefinedSearch: pcsKey} = state

  if (useAdvancedSetup) {
    if (!advancedSetup) {
      reject(new Error('Empty setup object.'))
    }

    let search
    try {
      search = JSON.parse(advancedSetup)
    } catch (err) {
      reject(err)
    }

    return api.getComponent(store.state, 'Search')
      .then(response => {
        if (response.error) {
          reject(response.error)
        }

        const config = response.body

        filters = Object.assign(filters, decodeSearch(search))
        filters = swapRawFilter(filters, {}, 0, config)

        if (filters.raw === null) delete filters.raw
        delete filters.userSetRaw
        delete filters.agentSetRaw

        api.getSoldListings(store.state, filters)
          .then(response => resolve({ listings: mapSoldListings(response), search, config }))
          .catch(err => reject(err))
      })
      .catch(err => {
        reject(err)
      })
  } else if (pcsKey) {
    if (cached) {
      filters = Object.assign(filters, decodeSearch(cached.search))
      filters = swapRawFilter(filters, {}, 0, cached.config)

      if (filters.raw === null) delete filters.raw
      delete filters.userSetRaw
      delete filters.agentSetRaw

      return api.getSoldListings(store.state, filters)
        .then(response => resolve({ listings: mapSoldListings(response), search: cached.search, config: cached.config }))
        .catch(err => reject(err))
    }

    return api.getComponent(store.state, 'Search')
      .then(response => {
        if (response.error) {
          reject(response.error)
        }

        const config = response.body
        const search = config.preconfiguredSearches[pcsKey]

        filters = Object.assign(filters, decodeSearch(search))
        filters = swapRawFilter(filters, {}, 0, config)

        if (filters.raw === null) delete filters.raw
        delete filters.userSetRaw
        delete filters.agentSetRaw

        return api.getSoldListings(store.state, filters)
          .then(response => resolve({ listings: mapSoldListings(response), search, config }))
          .catch(err => reject(err))
      }).catch(err => {
        reject(err)
      })
  }

  return api.getSoldListings(store.state, filters)
    .then(response => {
      resolve({ listings: mapSoldListings(response), search: false, config: false })
    })
    .catch(err => reject(err))
}

export function preconfiguredOptions () {
  return new Promise((resolve, reject) => {
    api.getComponent(this.$store.state, 'Search').then(response => {
      if (response.error) {
        return reject(response.error)
      }

      const body = response.body
      const options = []
      for (let k in body.preconfiguredSearches) {
        const text = k.split('-').map(str => {
          return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
        }).join(' ')
        options.push({
          text,
          value: k
        })
      }

      resolve([
        { text: 'None', value: '' },
        ...options
      ])
    }).catch(err => {
      reject(err)
    })
  })
}

export function encodeSearchUrl (filters) {
  const params = []

  // GEO and URL

  let url = '/search/geo/all-areas/'

  if (filters['whosonfirst.id']) {
    url = `/search/geo/wof/${filters['whosonfirst.id']}/`
    params.push('sort=list_date_des')
  } else if (filters.centre_lat) {
    params.push(`lat=${filters.centre_lat}`)
    params.push(`lon=${filters.centre_lon}`)
    params.push('sort=geo_centre')
  }

  // Filters

  const parts = []

  // price

  //if price is one million
  const price = value => (Math.floor(value / 1000) + 'k')

  const maxPrice = filters['maxPrice'] || 1000000
  if (filters.high_price === maxPrice) {
    filters.high_price && parts.push(`above-${price(filters.low_price)}`)
  } else if (filters.high_price < maxPrice) {
    filters.high_price && parts.push(`${price(filters.low_price)}-${price(filters.high_price)}`)
  }

  // bedrooms
  filters.beds && parts.push(`${filters.beds}-bedrooms`)

  // bathrooms
  filters.baths && parts.push(`${filters.baths}-bathrooms`)

  // area
  filters.interior_size && parts.push(`${filters.interior_size}-sqft`)

  return url + parts.join('-') + '?' + params.join('&')
}

export function encodeDetailsUrl (listing) {
  if (!listing) return ''

  let url = ''
  url += (listing.transaction_type && listing.transaction_type === 'lease') ? '/for-lease/' : '/for-sale/'

  if (!listing.address) {
    if (listing.id) return url + listing.id
    return url + listing.publicId
  }

  url += listing.address.replace('#', '').replace(/([^\d\w\s])/g, '').split(' ').join('-').replace(/(-{2,})/g, '-').toLowerCase()

  if (url[url.length - 1] === '-') {
    url = url.substr(0, url.length - 1)
  }

  url += '--'
  url += listing.id || listing.publicId

  return url
}

export function encodeSoldDetailsUrl (listing) {
  if (!listing) return ''
  if (!listing.mlsNum || !listing.streetAddress) return ''
  return `/sold/${listing.streetAddress.split(' ').join('-')}--${listing.mlsNum}`
}

export function isDetailsUrl (url) {
  const reg = /((\/for-sale\/)|(\/for-lease\/))/g
  return url.match(reg) !== null
}

export function isSearchUrl (url) {
  const reg = /(\/search)$|(\/search\/)|(\/search#)$/g
  return url.match(reg) !== null
}

export function getOrgChart () {
  return new Promise((resolve, reject) => {
    api.getOffices(this.$store.state).then(response => {
      if (response.error) {
        return reject(response.error)
      }

      const options = []
      const body = [response.body.root]

      for (let x in body) {
        let collective = body[x]

        options.push ({
          text: collective.name,
          value: collective.id.toString()
        })
        for (let i in collective.children) {
          let child = collective.children[i]

          options.push ({
            text: child.name,
            value: child.id.toString()
          })
        }
      }

      resolve([
        { text: 'None', value: '' },
        ...options
      ])
    }).catch(err => {
      reject(err)
    })
  })
}

export function courtesyOf (store, listing) {

  // listing-search or listing strap
  const courtesyOfMessage = store.state.gus.courtesyOfMessage || listing.courtesyOfMessage
  const agent = listing.agent[0]

  if (!agent) return ''

  /* eslint-disable no-template-curly-in-string */
  return courtesyOfMessage
    ? courtesyOfMessage
      .replace('${agent.name}', agent.name)
      .replace('${agent.office}', agent.office)
    : agent.name + ' / ' + agent.office
}

export function courtesyOfSold (store, listing) {

  // listing-search or listing strap
  const courtesyOfMessage = store.state.gus.courtesyOfMessage || listing.courtesyOfMessage

  if (!listing.listOfficeName || !listing.listOfficeId) return ''

  /* eslint-disable no-template-curly-in-string */
  return courtesyOfMessage
    ? courtesyOfMessage
      .replace('${agent.name}', listing.listOfficeName)
      .replace('${agent.office}', listing.listOfficeId)
    : listing.listOfficeName + ' / ' + listing.listOfficeId
}

export function formatDate (listing) {
  if (listing.open_houses) {
    let listingNextOpenHouse = listing.open_houses[0] || this.listing.open_houses

    return dayjs(listingNextOpenHouse.date, "YYYY-MM-DD").format('dddd, MMMM D')
  }
}

export function formatTime (listing) {
  if (listing.open_houses) {
    let listingNextOpenHouse = listing.open_houses[0] || listing.open_houses
    let today = dayjs().format('YYYY-MM-DD')
    var startTime = dayjs(`${today}-${listingNextOpenHouse.start_time}`, 'YYYY-MM-DD-HHmm').format('h:mm')
    var endTime = dayjs(`${today}-${listingNextOpenHouse.end_time}`, 'YYYY-MM-DD-HHmm').format('h:mm A')

    return startTime + " - " + endTime
  }
}
