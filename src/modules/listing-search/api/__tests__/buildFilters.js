import buildFilters, {
  removeFalsyFilters,
  addPaginationFilters,
  addSortingFilter,
  addGeoFilters,
  swapRawFilter,
  addBoundingBox
} from '../buildFilters'

const config = {
  gusApi: 'http://example.com/',
  sources: ['idx-edm-v5'],
  token: 'my-token',
  resultsPerPage: 100,

  autocomplete: {
    distance: 20
  },

  defaultGeo: {
    "type": "pre_indexed_shape",
    "pre_indexed_shape.index": "gus-user-geojson",
    "pre_indexed_shape.id": "AWEvP-5HS69Ag9o1lrkU"
  },
  defaultSort: 'list_date_des',
  pointSearchRadius: 50,

  rawFieldSets: {
    "downtown-edmonton": {
      "name": "Downtown Edmonton",
      "value": ["LM_Char25_2:≈Downtown_EDMO"]
    }
  },

  "map": {
    "defaultPosition": {
      "centerLat": 53.5555501,
      "centerLon": -113.6340494,
      "zoom": 11
    },
    "mapZoomToDoSearch": 15,
    "maximumMapResults": 200
  }
}

describe('addSortingFilter', () => {
  it('should insert the sort paramter', () => {
    const obs = addSortingFilter({}, {sort: 'list_date_des'}, 1, config)
    expect(obs).toHaveProperty('sort', 'list_date_des')
  })

  it('should insert sort_centre filters when sort is geo_centre', () => {
    const obs = addSortingFilter({}, {
      sort: 'geo_centre',
      geo: {
        centre_lat: 54,
        centre_lon: -113
      }
    }, 1, config)
    expect(obs).toHaveProperty('sort', 'geo_centre')
    expect(obs).toHaveProperty('sort_centre_lat', 54)
    expect(obs).toHaveProperty('sort_centre_lon', -113)
  })

  it('should not attempt to set sorting filters when geo is not present or is incomplete', () => {
    const obs = addSortingFilter({}, {
      sort: 'geo_centre',
      geo: {}
    }, 1, config)
    expect(obs).toHaveProperty('sort', 'list_date_des')
    expect(obs).not.toHaveProperty('sort_centre_lat')
    expect(obs).not.toHaveProperty('sort_centre_lon')
  })
})

describe('addGeoFilters', () => {
  it('should not do anything if the geo property is not set', () => {
    const finalFilters = addGeoFilters({}, {
      geo: null
    }, 0, {})
    expect(finalFilters).not.toHaveProperty('whosonfirst.id')
    expect(finalFilters).not.toHaveProperty('sort_centre_lat')
  })

  it('should set the whosonfirst property for whosonfirst', () => {
    const finalFilters = addGeoFilters({}, {
      geo: {
        "type": "whosonfirst",
        "centre_lat": -113.541235,
        "centre_lon": 53.564579,
        "distance": "15.41937875193557",
        "locationTitle": "Inglewood, Edmonton, AB",
        "whosonfirst.id": "85864901"
      }
    }, 0, {})
    expect(finalFilters['whosonfirst.id']).toEqual('85864901')
  })

  it('should set the pre_indexed_shape property for pre_indexed_shape', () => {
    const finalFilters = addGeoFilters({}, {
      geo: {
        "type": "pre_indexed_shape",
        "centre_lat": -113.541235,
        "centre_lon": 53.564579,
        "pre_indexed_shape.id": "12345",
        "pre_indexed_shape.index": "gus-user-geojson",
        "locationTitle": "Inglewood, Edmonton, AB"
      }
    }, 0, {})
    expect(finalFilters['pre_indexed_shape.id']).toEqual("12345")
    expect(finalFilters['pre_indexed_shape.index']).toEqual("gus-user-geojson")
  })

  it('should set the distance_from_lat, distance_from_lon filters and use a radius provided in the config', () => {
    const finalFilters = addGeoFilters({}, {
      geo: {
        "type": "location",
        "centre_lat": -113.541235,
        "centre_lon": 53.564579,
        "locationTitle": "Inglewood, Edmonton, AB"
      }
    }, 0, config)
    expect(finalFilters['distance_from_lat']).toEqual(-113.541235)
    expect(finalFilters['distance_from_lon']).toEqual(53.564579)
    expect(finalFilters['distance_from_radius']).toEqual(50)
  })

  it('should set the raw property for fake', () => {
    const finalFilters = addGeoFilters({}, {
      geo: {
        "type": "fake",
        "raw": ["raw_field_bullshit"],
        "locationTitle": "Inglewood, Edmonton, AB"
      }
    }, 0, {})
    expect(finalFilters).toHaveProperty('raw', ["raw_field_bullshit"])
  })

  it('should append onto the raw filter if already set', () => {
    const finalFilters = addGeoFilters({
      raw: ["raw_field_bullshit"]
    }, {
      geo: {
        "type": "fake",
        "raw": ["more_raw_field_bullshit"],
        "locationTitle": "Inglewood, Edmonton, AB"
      }
    }, 0, {})
    expect(finalFilters.raw).toHaveLength(2)
  })

  it('should use the defaultGeo if available when the geo is null', () => {
    const finalFilters = addGeoFilters({}, {
      geo: null
    }, 0, config)
    expect(finalFilters['pre_indexed_shape.index']).toEqual('gus-user-geojson')
    expect(finalFilters['pre_indexed_shape.id']).toEqual('AWEvP-5HS69Ag9o1lrkU')
  })
})

describe('removeFalsyFilters', () => {
  it('should remove falsy filter values', () => {
    expect(removeFalsyFilters({low_price: null}, {}, 0, config)).not.toHaveProperty('low_price')
  })
})

describe('addPaginationFilters', () => {
  it('should insert pagination parameters (size and from)', () => {
    const obs = addPaginationFilters({}, {}, 1, config)
    expect(obs).toHaveProperty('size', 100)
    expect(obs).toHaveProperty('from', 100)
  })

  it('should still set the parameters when the page is 0', () => {
    const obs = addPaginationFilters({}, {}, 0, config)
    expect(obs).toHaveProperty('size', 100)
    expect(obs).toHaveProperty('from', 0)
  })
})

describe('swapRawFilter', () => {
  it('should swap the raw filter for the value', () => {
    const obs = swapRawFilter({raw: 'downtown-edmonton'}, {}, 1, config)
    expect(obs).toHaveProperty('raw', ["LM_Char25_2:≈Downtown_EDMO"])
  })

  it('should throw if that rawFieldSet is not defined', () => {
    expect(() => {
      swapRawFilter({raw: 'foobar'}, {}, 1, config)
    }).toThrow()
  })

  it('should add in agent set raw filters', () => {
    const obs = swapRawFilter({agentSetRaw: ['LM_Char1_10:≈No']}, {}, 1, config)
    expect(obs).toHaveProperty('raw', ['LM_Char1_10:≈No'])
  })

  it('should combine agentSetRaw filters and rawFieldSets if necessary', () => {
    const obs = swapRawFilter({raw: 'downtown-edmonton', agentSetRaw: ['LM_Char1_10:≈No']}, {}, 1, config)
    expect(obs.raw).toHaveLength(2)
  })

  it('should not tack on empty raw filters arrays', () => {
    const obs = swapRawFilter({}, {}, 1, config)
    expect(obs.raw).toBeFalsy()
  })
})

describe('addBoundingBox', () => {
  it('should add a bounding box based on the map realPosition', () => {
    const obs = addBoundingBox({}, {map: {
      realPosition: {
        centerLat: 53.539767549690865,
        centerLng: -113.49919796552228,
        east: -113.47859860028791,
        north: 53.55171405408738,
        south: 53.52781767317219,
        west: -113.51979733075666,
        zoom: 15
      }
    }}, 0, config)
    expect(obs['bounding_box.top_left.lat']).toEqual(53.55171405408738)
    expect(obs['bounding_box.top_left.lon']).toEqual(-113.51979733075666)
    expect(obs['bounding_box.bottom_right.lat']).toEqual(53.52781767317219)
    expect(obs['bounding_box.bottom_right.lon']).toEqual(-113.47859860028791)
  })
})

it('should build filters', () => {
  const obs = buildFilters({filters: {
    low_price: 100000
  }}, 0, config)
  expect(obs).toHaveProperty('low_price', 100000)
})
