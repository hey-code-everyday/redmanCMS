import mutations from '../mutations'
import initialState from './state.json'
import clone from 'lodash/clone'

const {
  setFilters,
  setFilter,
  unsetFilters,
  setRaw,
  unsetRaw,
  setSort,
  setGeo,
  clearGeo,
  setPreconfiguredSearch,
  faveRequest,
  unfaveRequest,
  getGeoResponse,
  getGeoError
} = mutations

describe('setFilters', () => {
  it('should set unset filters', () => {
    const state = {filters: {}}
    setFilters(state, {low_price: 100})
    expect(state.filters).toHaveProperty('low_price', 100)
  })

  it('should override set filters', () => {
    const state = clone(initialState)
    setFilters(state, {low_price: 100})
    expect(state.filters).toHaveProperty('low_price', 100)
  })
})

describe('setFilter', () => {
  it('should call setFilters on a single value instead of an array', () => {
    const state = clone(initialState)
    setFilter(state, 'low_price', 100)
    expect(state.filters).toHaveProperty('low_price', 100)
  })
})

describe('unsetFilters', () => {
  it('should unset a filter (set it to null)', () => {
    const state = clone(initialState)
    unsetFilters(state, ['low_price'])
    expect(state.filters).toHaveProperty('low_price', null)
  })

  it('should work on a raw string instead of an array', () => {
    const state = clone(initialState)
    unsetFilters(state, 'low_price')
    expect(state.filters).toHaveProperty('low_price', null)
  })

  it('should unset ALL filters when no argument is passed', () => {
    const state = clone(initialState)
    unsetFilters(state)
    expect(state.filters).toHaveProperty('low_price', null)
    expect(state.filters).toHaveProperty('high_price', null)
  })
})

describe('setRaw', () => {
  it('should set a new raw filter', () => {
    const state = clone(initialState)
    state.filters.userSetRaw = []
    setRaw(state, ['LM_Char_1_10', 'boardinghouse'])
    expect(state.filters.userSetRaw).toHaveLength(1)
    expect(state.filters.userSetRaw[0]).toEqual('LM_Char_1_10:boardinghouse')
  })

  it('should vivify the userSetRaw filter if it doesnt exist', () => {
    const state = clone(initialState)
    setRaw(state, ['LM_Char_1_10', 'boardinghouse'])
    expect(state.filters.userSetRaw).toHaveLength(1)
    expect(state.filters.userSetRaw[0]).toEqual('LM_Char_1_10:boardinghouse')
  })

  it('should replace and not add to the array when the raw field is already set', () => {
    const state = clone(initialState)
    state.filters.userSetRaw = ['LM_Char_1_10:boardinghouse']
    setRaw(state, ['LM_Char_1_10', 'hovel'])
    expect(state.filters.userSetRaw).toHaveLength(1)
    expect(state.filters.userSetRaw[0]).toEqual('LM_Char_1_10:hovel')
  })

  it('should be able to handle a userSetRaw value that is a string', () => {
    const state = clone(initialState)
    state.filters.userSetRaw = 'LM_Char_1_10:boardinghouse'
    setRaw(state, ['LM_Char_1_20', 'hovel'])
    expect(state.filters.userSetRaw).toHaveLength(2)
    expect(state.filters.userSetRaw[1]).toEqual('LM_Char_1_20:hovel')
  })
})

describe('unsetRaw', () => {
  it('should remove a userSetRaw filter', () => {
    const state = clone(initialState)
    state.filters.userSetRaw = ['LM_Char_1_10:[boardinghouse]']
    unsetRaw(state, 'LM_Char_1_10')
    expect(state.filters.userSetRaw).toHaveLength(0)
  })

  it('should do nothing if the userSetRaw filter doesnt exist', () => {
    const state = clone(initialState)
    state.filters.userSetRaw = ['LM_Char_1_10:[boardinghouse]']
    unsetRaw(state, 'foo')
    expect(state.filters.userSetRaw).toHaveLength(1)
  })
})

describe('setGeo', () => {
  it('should set the geo property', () => {
    const state = clone(initialState)
    const location = {
      locationTitle: 'Holyrood',
      'whosonfirst.id': 12345
    }
    setGeo(state, location)
    expect(state.geo.locationTitle).toEqual('Holyrood')
  })

  it('should unset any geo related filters on change', () => {
    const state = clone(initialState)
    state.filters.sort_centre_lat = 53
    state.filters.sort_centre_lon = -113
    state.filters['whosonfirst.id'] = 'whoId123'
    const location = {
      locationTitle: 'Holyrood',
      'whosonfirst.id': '12345'
    }
    setGeo(state, location)
    expect(state.filters).toHaveProperty('sort_centre_lat', null)
    expect(state.filters).toHaveProperty('sort_centre_lon', null)
    expect(state.filters['whosonfirst.id']).toEqual(null)
  })

  it('should reset the sort property to the default given the old sort is geo_centre and the new geo does not have a centre', () => {
    const state = clone(initialState)
    state.sort = "geo_centre"
    const location = {
      locationTitle: 'Holyrood',
      'whosonfirst.id': '12345'
    }
    setGeo(state, location)
    expect(state).toHaveProperty('sort', 'list_date_des')
  })

  it('should not reset the sort property if the new geo still has a centre', () => {
    const state = clone(initialState)
    state.sort = "geo_centre"
    const location = {
      locationTitle: 'Holyrood',
      'whosonfirst.id': '12345',
      centre_lat: 54,
      centre_lon: -113
    }
    setGeo(state, location)
    expect(state).toHaveProperty('sort', 'geo_centre')
  })
})

describe('setSort', () => {
  it('should set the sort', () => {
    const state = clone(initialState)
    setSort(state, 'geo_centre')
    expect(state.sort).toEqual('geo_centre')
  })
})

describe('clearGeo', () => {
  it('should set the geo property to null', () => {
    const state = clone(initialState)
    clearGeo(state)
    expect(state.geo).toBeFalsy()
  })

  it('should reset the sort property if the old sort is geo_centre', () => {
    const state = clone(initialState)
    setSort(state, 'geo_centre')
    clearGeo(state)
    expect(state.sort).not.toEqual('geo_centre')
  })

  it('should also remove any geo related filters', () => {
    const state = clone(initialState)
    state.filters.sort_centre_lat = 53
    state.filters.sort_centre_lon = -113
    state.filters['whosonfirst.id'] = 'whoId123'
    clearGeo(state)
    expect(state.filters).toHaveProperty('sort_centre_lat', null)
    expect(state.filters).toHaveProperty('sort_centre_lon', null)
    expect(state.filters['whosonfirst.id']).toEqual(null)
  })
})

describe('setPreconfiguredSearch', () => {
  const config = {
    preconfiguredSearches: {
      'expensive-homes-in-riverbend': {
        sort: 'list_price_des',
        geo: {
          'whosonfirst.id': 85864847
        },
        filters: {
          low_price: 500000
        }
      }
    }
  }

  it('should apply the filters from a preconfiguredSearch', () => {
    const state = Object.assign({}, clone(initialState), {config})
    setPreconfiguredSearch(state, 'expensive-homes-in-riverbend')
    expect(state.filters).toHaveProperty('low_price', 500000)
    expect(state.sort).toEqual('list_price_des')
    expect(state.geo['whosonfirst.id']).toEqual(85864847)
    expect(state.config).toEqual(config)
  })

  it('should set the slug in the store', () => {
    const state = Object.assign({}, clone(initialState), {config})
    setPreconfiguredSearch(state, 'expensive-homes-in-riverbend')
    expect(state.preconfiguredSearch).toEqual('expensive-homes-in-riverbend')
    expect(state.config).toEqual(config)
  })
})

describe('faveRequest', () => {
  it('should favourite a property', () => {
    const state = Object.assign({}, clone(initialState))
    faveRequest(state, ['E12345', '22 Evergreen Terrace'])
    expect(state.faves).toHaveLength(1)
  })
})

describe('unfaveRequest', () => {
  it('should remove a favourites from the list', () => {
    const state = Object.assign({}, clone(initialState), {faves: [
      {id: 'E12345'},
      {id: 'E12345'}
    ]})
    unfaveRequest(state, 'E12345')
    expect(state.faves).toHaveLength(0)
  })
})

describe('getGeoResponse', () => {
  it('should change the geo type to location if the geometry type is a point', () => {
    const state = Object.assign({}, clone(initialState), {
      geo: {type: 'whosonfirst', 'whosonfirst.id': 12345}
    })
    const res = {
      id: '12345',
      geometry: {
        "coordinates": [
          -114.73541,
          53.55013
        ],
        "type": "Point"
      },
      properties: {
        "geom:latitude": 53.55013,
        "geom:longitude": -114.73541,
        "wof:name": "Seba Beach"
      }
    }
    getGeoResponse(state, res)
    expect(state.geo).toHaveProperty('type', 'location')
  })

  it('should clear geo if there is no lat and lon', () => {
    const state = Object.assign({}, clone(initialState), {
      geo: {type: 'whosonfirst', 'whosonfirst.id': 12345}
    })
    const res = {
      id: '12345',
      geometry: {
        "coordinates": [
          -114.73541,
          53.55013
        ],
        "type": "Point"
      },
      properties: {
        "wof:name": "Seba Beach"
      }
    }
    getGeoResponse(state, res)
    expect(state.geo).toBeFalsy()
  })
})

describe('getGeoError', () => {
  it('should change the geo type to location', () => {
    const state = Object.assign({}, clone(initialState), {
      geo: {type: 'whosonfirst', 'whosonfirst.id': 12345, centre_lat: 54, centre_lon: -113}
    })
    getGeoError(state)
    expect(state.geo).toHaveProperty('type', 'location')
  })

  it('should clear geo if there is no lat and lon available', () => {
    const state = Object.assign({}, clone(initialState), {
      geo: {type: 'whosonfirst', 'whosonfirst.id': 12345}
    })
    getGeoError(state)
    expect(state.geo).toBeFalsy()
  })
})
