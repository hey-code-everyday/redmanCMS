import {
  encodeUrl,
  decodeUrl,
  encodeFilters,
  decodeFilters,
  decodeQueryFilters
} from '../url'

const config = {
  rootUrl: '/search',
  defaultLocationSlug: 'edmonton',
  idToken: 'myidtoken',

  defaultVals: {
    low_price: 250000,
    high_price: 400000
  },

  preconfiguredSearches: {
    'expensive-homes-in-riverbend': {
      sort: 'list_price_des',
      geo: {
        'whoisonfirst.id': 85864847
      },
      filters: {
        low_price: 500000
      }
    },
    'with-raw': {
      filters: 'default-raw'
    }
  },
  rawFieldSets: {
    'default-raw': {
      'name': 'Halifax Real Estate',
      'value': [
        'Address.City:or[Halifax]'
      ]
    }
  }
}

describe('encodeFilters', () => {
  it('should produce a slugified version of the sidebar text', () => {
    const obs = encodeFilters({
      low_price: 100000,
      high_price: 1000000
    }).slug
    expect(obs).toEqual('100k-1m')
  })

  it('should separate different pieces of text with dashes', () => {
    const obs = encodeFilters({
      low_price: 100000,
      high_price: 1000000,
      bedrooms: '2p'
    }).slug
    expect(obs).toEqual('100k-1m-2-bedrooms')
  })

  it('should remove special characters like ampersands and dollar signs', () => {
    const obs = encodeFilters({
      low_price: 100000,
      high_price: 1000000,
      property_types: 'house|condo'
    }).slug
    expect(obs).toEqual('100k-1m-house-condo')
  })

  it('should keep unencodable filters in a remainder object', () => {
    const obs = encodeFilters({
      low_price: 100000,
      high_price: 1000000,
      agent_id: 'myagentid'
    })
    expect(obs).toHaveProperty('slug', '100k-1m')
    expect(obs).toHaveProperty('remainder.agent_id', 'myagentid')
  })

  it('should also add filters that are not defined anywhere to the remainder object', () => {
    const obs = encodeFilters({
      low_price: 100000,
      high_price: 1000000,
      office_id: 'myofficeid'
    })
    expect(obs).toHaveProperty('slug', '100k-1m')
    expect(obs).toHaveProperty('remainder.office_id', 'myofficeid')
  })
})

describe('decodeFilters', () => {
  it('should parse the filters part of the url', () => {
    const obs = decodeFilters('100k-1m-2-bedrooms-less-than-60-years-950-sqft-house-condo')
    expect(obs).toEqual({
      low_price: 100000,
      high_price: 1000000,
      bedrooms: '2p',
      construction_age: 'now-60y/d',
      interior_size: '950p',
      property_types: 'house|condo'
    })
  })
})

describe('decodeQueryFilters', () => {
  it('should add filters that are in the query string and are allowed by the defined filters of the app', () => {
    const queryParams = {sort: 'list_date_des', agent_id: 'myagentid'}
    const obs = decodeQueryFilters(queryParams)
    expect(obs).toHaveProperty('agent_id', 'myagentid')
    expect(obs).not.toHaveProperty('sort')
  })
})

describe('encodeUrl', () => {
  it('should place the geo location if it has a whoisonfirst.id in the geo part of the url', () => {
    const obs = encodeUrl({
      geo: {
        'type': 'whosonfirst',
        'whosonfirst.id': '85864901'
      },
      config
    })
    expect(obs).toEqual('/search/geo/wof/85864901/')
  })

  it('if there is no valid geo, it should use the config default for the location', () => {
    const obs = encodeUrl({
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/')
  })

  it('should place the filters string in the second part of the url', () => {
    const obs = encodeUrl({
      filters: {
        bedrooms: '2p'
      },
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/2-bedrooms')
  })

  it('should place the sort value in the query string', () => {
    const obs = encodeUrl({
      filters: {
        bedrooms: '2p'
      },
      sort: 'list_date_des',
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/2-bedrooms?sort=list_date_des')
  })

  it('should place the page in the query string, 1-indexed', () => {
    const obs = encodeUrl({
      filters: {
        bedrooms: '2p'
      },
      page: 1,
      sort: 'list_date_des',
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/2-bedrooms?page=2&sort=list_date_des')
  })

  it('should not place the page if the page is 0', () => {
    const obs = encodeUrl({
      filters: {
        bedrooms: '2p'
      },
      page: 0,
      sort: 'list_date_des',
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/2-bedrooms?sort=list_date_des')
  })

  it('should append geo location to the query string', () => {
    const obs = encodeUrl({
      geo: {
        'type': 'location',
        'centre_lat': -113.541235,
        'centre_lon': 53.564579
      },
      sort: 'geo_centre',
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/?lat=-113.541235&lon=53.564579&sort=geo_centre')
  })

  it('should use a wofid whenever available, even if the type is location', () => {
    const obs = encodeUrl({
      geo: {
        'type': 'location',
        'centre_lat': -113.541235,
        'centre_lon': 53.564579,
        'whosonfirst.id': 12345
      },
      sort: 'geo_centre',
      config
    })
    expect(obs).toEqual('/search/geo/wof/12345/?lat=-113.541235&lon=53.564579&sort=geo_centre')
  })

  it('should encode preconfigured searches', () => {
    const obs = encodeUrl({
      preconfiguredSearch: 'luxury-homes',
      config
    })
    expect(obs).toEqual('/search/p/luxury-homes')
  })

  it('should encode preconfigured searches with pagination', () => {
    const obs = encodeUrl({
      preconfiguredSearch: 'luxury-homes',
      page: 1,
      config
    })
    expect(obs).toEqual('/search/p/luxury-homes?page=2')
  })

  it('should not put sort or other extraneous parameters in the query string in a preconfiguredSearch', () => {
    const obs = encodeUrl({
      preconfiguredSearch: 'luxury-homes',
      sort: 'list_date_des',
      page: 1,
      config
    })
    expect(obs).toEqual('/search/p/luxury-homes?page=2')
  })

  it('should encode pre_indexed_shapes', () => {
    const obs = encodeUrl({
      geo: {
        'type': 'pre_indexed_shape',
        'pre_indexed_shape.index': 'kitchener',
        'pre_indexed_shape.id': '1a2b3c4d'
      },
      config
    })
    expect(obs).toEqual('/search/geo/kitchener/1a2b3c4d/')
  })

  it('should encode pre_indexed_shapes with type and path properties', () => {
    const obs = encodeUrl({
      geo: {
        'locationTitle': 'Hammonds Plains Pads',
        'type': 'pre_indexed_shape',
        'pre_indexed_shape.id': 'hammonds-plains',
        'pre_indexed_shape.index': 'geojson-halifax',
        'pre_indexed_shape.path': 'geometry',
        'pre_indexed_shape.type': 'FeatureCollectionPoly'
      },
      config
    })
    expect(obs).toEqual('/search/geo/geojson-halifax/hammonds-plains/?path=geometry&type=FeatureCollectionPoly')
  })

  it('should encode extra filters that cant be decoded in the query string', () => {
    const obs = encodeUrl({
      filters: {
        bedrooms: '2p',
        agent_id: 'myagentid'
      },
      sort: 'list_date_des',
      config
    })
    expect(obs).toEqual('/search/geo/all-areas/2-bedrooms?agent_id=myagentid&sort=list_date_des')
  })
})

describe('decodeUrl', () => {
  it('should call up the defaultVals on a request to the root', () => {
    const state = decodeUrl('/search', config)
    expect(state).toHaveProperty('filters.low_price', 250000)
    expect(state).toHaveProperty('filters.high_price', 400000)
  })

  it('should work with a trailing slash', () => {
    const state = decodeUrl('/search/', config)
    expect(state).toHaveProperty('filters.low_price', 250000)
    expect(state).toHaveProperty('filters.high_price', 400000)
  })

  it('should also load the default config for routes outside of the search module', () => {
    const state = decodeUrl('/search/foo/bar', config)
    expect(state).toHaveProperty('filters.low_price', 250000)
    expect(state).toHaveProperty('filters.high_price', 400000)
  })

  it('should look for saved searches', () => {
    const state = decodeUrl('/search/s/c1a555cd076fe5bc408198d51b582a98', config)
    expect(state).toHaveProperty('savedSearch', 'c1a555cd076fe5bc408198d51b582a98')
  })

  it('should look for saved searches with a trailing slash', () => {
    const state = decodeUrl('/search/s/c1a555cd076fe5bc408198d51b582a98/', config)
    expect(state).toHaveProperty('savedSearch', 'c1a555cd076fe5bc408198d51b582a98')
  })

  it('should look for preconfigured searches', () => {
    const state = decodeUrl('/search/p/expensive-homes-in-riverbend', config)
    // from preconfigured search in config:
    expect(state).toHaveProperty('filters.low_price', 500000)
  })

  it('should work with the trailing slash', () => {
    const state = decodeUrl('/search/p/expensive-homes-in-riverbend/', config)
    // from preconfigured search in config:
    expect(state).toHaveProperty('filters.low_price', 500000)
  })

  it('should stay alive even if the preconfigured search does not exist', () => {
    return expect(() => {
      decodeUrl('/search/p/expensive-homes-in-riverbend', config)
    }).not.toThrow()
  })

  it('should use the defaultVals if the default filters are explicitly requested', () => {
    const state = decodeUrl('/search/geo/all-areas/defaults', config)
    expect(state).toHaveProperty('filters.low_price', 250000)
  })

  it('should setFilters based on the parsed filters values', () => {
    const state = decodeUrl('/search/geo/all-areas/2-bedrooms', config)
    expect(state).toHaveProperty('filters.bedrooms', '2p')
  })

  it('should setFilters if there is a trailing slash', () => {
    const state = decodeUrl('/search/geo/all-areas/2-bedrooms/', config)
    expect(state).toHaveProperty('filters.bedrooms', '2p')
  })

  it('should set sort from the query string', () => {
    const state = decodeUrl('/search/geo/all-areas/2-bedrooms?agent_id=myagentid&sort=list_date_des', config)
    expect(state).toHaveProperty('filters.agent_id', 'myagentid')
  })

  it('should setSort', () => {
    const state = decodeUrl('/search/geo/all-areas/2-bedrooms/?sort=list_price_des', config)
    expect(state).toHaveProperty('sort', 'list_price_des')
  })

  it('should setPage, 0-indexed', () => {
    const state = decodeUrl('/search/geo/all-areas/2-bedrooms?page=2', config)
    expect(state).toHaveProperty('page', 1)
  })

  it('should setGeo if the geo part of the url is not all-areas', () => {
    const state = decodeUrl('/search/geo/wof/85864847/2-bedrooms?page=2', config)
    expect(state).toHaveProperty('geo', {
      'whosonfirst.id': 85864847,
      'type': 'whosonfirst'
    })
  })

  it('should also work fine if the filters slug is left out', () => {
    const state = decodeUrl('/search/geo/wof/85864847/?page=2', config)
    expect(state).toHaveProperty('geo', {
      'whosonfirst.id': 85864847,
      'type': 'whosonfirst'
    })
  })

  it('should setGeo if geo information is set in the query string', () => {
    const state = decodeUrl('/search/geo/all-areas/2-bedrooms?sort=geo_centre&lat=-113.541235&lon=53.564579', config)
    expect(state).toHaveProperty('geo', {
      'centre_lat': -113.541235,
      'centre_lon': 53.564579,
      'type': 'location'
    })
  })

  it('should be able to set both a wof id and a centre', () => {
    const state = decodeUrl('/search/geo/wof/12345/2-bedrooms?sort=geo_centre&lat=-113.541235&lon=53.564579', config)
    expect(state).toHaveProperty('geo', {
      'centre_lat': -113.541235,
      'centre_lon': 53.564579,
      'type': 'whosonfirst',
      'whosonfirst.id': 12345
    })
  })

  it('should set preindexed shapes based on the URL', () => {
    const state = decodeUrl('/search/geo/kitchener/1a2b3c4d/300k-500k', config)
    expect(state).toHaveProperty('geo', {
      'pre_indexed_shape.id': '1a2b3c4d',
      'pre_indexed_shape.index': 'kitchener',
      'type': 'pre_indexed_shape',
      'locationTitle': 'Custom Area'
    })
  })

  it('should set preindexed shapes with type and path query parameters', () => {
    const state = decodeUrl('/search/geo/geojson-halifax/hammonds-plains/?path=geometry&type=FeatureCollectionPoly', config)
    expect(state).toHaveProperty('geo', {
      'pre_indexed_shape.index': 'geojson-halifax',
      'pre_indexed_shape.id': 'hammonds-plains',
      'pre_indexed_shape.path': 'geometry',
      'pre_indexed_shape.type': 'FeatureCollectionPoly',
      'type': 'pre_indexed_shape',
      'locationTitle': 'Custom Area'
    })
  })

  it('should work with trailing slashes', () => {
    const state = decodeUrl('/search/geo/kitchener/1a2b3c4d/300k-500k/', config)
    expect(state).toHaveProperty('geo', {
      'pre_indexed_shape.id': '1a2b3c4d',
      'pre_indexed_shape.index': 'kitchener',
      'type': 'pre_indexed_shape',
      'locationTitle': 'Custom Area'
    })
  })

  it('should ignore and not care about the domain and protocol', () => {
    const state = decodeUrl('http://www.example.com/search', config)
    expect(state).toHaveProperty('filters.low_price', 250000)
    expect(state).toHaveProperty('filters.high_price', 400000)
  })

  it('should still impose complex complex filters when domain and protocol are included', () => {
    const state = decodeUrl('http://www.example.com/search/geo/wof/12345/2-bedrooms?sort=geo_centre&lat=-113.541235&lon=53.564579', config)
    expect(state).toHaveProperty('geo.type', 'whosonfirst')
    expect(state).toHaveProperty('filters.bedrooms', '2p')
    expect(state).toHaveProperty('sort', 'geo_centre')
    expect(state).toHaveProperty('geo.centre_lat', -113.541235)
  })
})
