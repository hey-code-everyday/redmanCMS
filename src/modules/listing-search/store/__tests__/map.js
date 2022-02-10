
import state from './state.json'
import clone from 'lodash/clone'

import {
  requestMapPosition,
  requestMapMarkers,
  polygon2GeoJson,
  formatPolygons,
  formatMarkers,
  mapState,
  nextZoom
} from '../map'

const dispatch = jest.fn(() => {
  return {
    then: jest.fn()
  }
})

const commit = jest.fn()

describe('requestMapPosition', () => {
  it('should request polygons when geo is whosonfirst', () => {
    const newState = clone(state)
    requestMapPosition({state: newState, dispatch})
    expect(dispatch).toHaveBeenCalledWith('getGeo')
  })

  it('should request polygons when geo is a pre_indexed_shape', () => {
    const newState = clone(state)
    newState.geo.type = 'pre_indexed_shape'
    requestMapPosition({state: newState, dispatch})
    expect(dispatch).toHaveBeenCalledWith('preIndexedShape')
  })

  it('should do a noop if geo is null', () => {
    const newState = clone(state)
    newState.geo = null
    requestMapPosition({state: newState, dispatch})
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should do a noop if geo is a location', () => {
    const newState = clone(state)
    newState.geo.type = 'location'
    requestMapPosition({state: newState, dispatch})
    expect(dispatch).not.toHaveBeenCalled()
  })

  // TODO raw fields (DO THE FUCKING SEARCH FIRST)
})

describe('requestMapMarkers', () => {
  it('should set the realMapPosition to the payload', () => {
    const newState = clone(state)
    requestMapMarkers({state: newState, dispatch}, {
      centerLat: 53.539767549690865,
      centerLng: -113.49919796552228,
      east: -113.47859860028791,
      north: 53.55171405408738,
      south: 53.52781767317219,
      west: -113.51979733075666,
      zoom: 15
    })
    expect(newState.map.realPosition).not.toBeNull()
  })

  it('should remove all the markers the map is zoomed out', () => {
    const newState = clone(state)
    requestMapMarkers({state: newState, dispatch, commit}, {
      centerLat: 53.539767549690865,
      centerLng: -113.49919796552228,
      east: -113.47859860028791,
      north: 53.55171405408738,
      south: 53.52781767317219,
      west: -113.51979733075666,
      zoom: 1
    })
    expect(commit).toHaveBeenCalledWith('clearMarkers')
  })

  it('should request the clustering endpoint when zoom is below threshold', () => {
    const newState = clone(state)
    requestMapMarkers({state: newState, dispatch}, {
      centerLat: 53.539767549690865,
      centerLng: -113.49919796552228,
      east: -113.47859860028791,
      north: 53.55171405408738,
      south: 53.52781767317219,
      west: -113.51979733075666,
      zoom: 11
    })
    expect(dispatch).toHaveBeenCalledWith('searchMapClusters', 5)
  })

  it('should request the q endpoint when zoom is at or above threshold', () => {
    const newState = clone(state)
    requestMapMarkers({state: newState, dispatch}, {
      centerLat: 53.539767549690865,
      centerLng: -113.49919796552228,
      east: -113.47859860028791,
      north: 53.55171405408738,
      south: 53.52781767317219,
      west: -113.51979733075666,
      zoom: 15
    })
    expect(dispatch).toHaveBeenCalledWith('searchMap')
  })
})

describe('polygon2GeoJson', () => {
  it('should transform polygons into the geojson format', () => {
    const input = [
      {lat: 53.63364637463477, lng: -113.769371509552},
      {lat: 53.56233603302632, lng: -113.76731157302856},
      {lat: 53.59943243309455, lng: -113.68491411209106}
    ]
    const output = {
      "type": "Polygon",
      "coordinates": [[
        [-113.769371509552, 53.63364637463477],
        [-113.76731157302856, 53.56233603302632],
        [-113.68491411209106, 53.59943243309455],
        [-113.769371509552, 53.63364637463477]
      ]]
    }
    const obs = polygon2GeoJson(input)
    expect(obs).toEqual(output)
  })
})

describe('formatPolygons', () => {
  it('should format Polygons', () => {
    const geometry = {
      "type": "Polygon",
      "coordinates": [
        [[-113.62415069667817, 53.6376627052997], [-113.62792671643722, 53.64943351695871]]
      ]
    }
    const result = formatPolygons(geometry, 'red')
    expect(result).toHaveLength(1)
    expect(result[0].coords).toHaveLength(2)
    expect(result[0].coords[0]).toEqual({lng: -113.62415069667817, lat: 53.6376627052997})
  })

  it('should format MultiPolygons', () => {
    const geometry = {
      "type": "MultiPolygon",
      "coordinates": [[
        [[-113.62415069667817, 53.6376627052997], [-113.62792671643722, 53.64943351695871]]
      ]]
    }
    const result = formatPolygons(geometry, 'red')
    expect(result).toHaveLength(1)
    expect(result[0].coords).toHaveLength(2)
    expect(result[0].coords[0]).toEqual({lng: -113.62415069667817, lat: 53.6376627052997})
  })

  it('should add constants', () => {
    const geometry = {
      "type": "MultiPolygon",
      "coordinates": [[
        [[-113.62415069667817, 53.6376627052997], [-113.62792671643722, 53.64943351695871]]
      ]]
    }
    const result = formatPolygons(geometry, 'red')
    expect(result[0].strokeColor).toEqual('red')
    expect(result[0].fillOpacity).toEqual(0.2)
  })
})

describe('formatMarkers', () => {
  it('should format clusters and give each one a unique title', () => {
    const markers = [
      {
        "key": "c3x2b",
        "doc_count": 132,
        "point": {
          "lat": 53.59130859375,
          "lon": -113.53271484375
        }
      }
    ]
    const result = formatMarkers(markers, 'red')
    expect(result).toHaveLength(1)
    expect(result[0].title).toEqual('c3x2b-132')
  })

  it('should format properties and use the MLS# as the title', () => {
    const markers = [
      {
        "_index": "idx-edm-v5.3",
        "_type": "listing",
        "_id": "E4087570",
        "_score": null,
        "_source": {
          "location": {
            "lon": -113.44758208443363,
            "lat": 53.53147934079722
          }
        }
      }
    ]
    const result = formatMarkers(markers, 'red')
    expect(result).toHaveLength(1)
    expect(result[0].title).toEqual('E4087570')
  })

  it('should leave out markers which are not a cluster or a property', () => {
    const markers = [
      {foo: 'bar'}
    ]
    const result = formatMarkers(markers, 'red')
    expect(result).toHaveLength(0)
  })

  it('should collapse markers with similar position', () => {
    const markers = [
      {
        "_index": "idx-edm-v5.3",
        "_type": "listing",
        "_id": "E4087570",
        "_score": null,
        "_source": {
          "location": {
            "lon": -113.44758208443363,
            "lat": 53.53147934079722
          }
        }
      },
      {
        "_index": "idx-edm-v5.3",
        "_type": "listing",
        "_id": "E4087571",
        "_score": null,
        "_source": {
          "location": {
            "lon": -113.44758208443363,
            "lat": 53.53147934079722
          }
        }
      }
    ]
    const result = formatMarkers(markers, 'red')
    expect(result).toHaveLength(1)
    expect(result[0].title).toEqual('E4087570|E4087571')
  })
})

describe('mapState', () => {
  it('should center the map and zoom in when geo is a location', () => {
    const newState = clone(state)
    newState.geo.type = 'location'
    const result = mapState(newState)
    expect(result).toHaveProperty('position', 'center')
    expect(result).toHaveProperty('centerLat', -113.541235)
    expect(result).toHaveProperty('centerLng', 53.564579)
    expect(result).toHaveProperty('zoom', 15)
  })

  it('should center the map if geo is null', () => {
    const newState = clone(state)
    newState.geo = null
    const result = mapState(newState)
    expect(result).toHaveProperty('position', 'center')
    expect(result).toHaveProperty('centerLat')
    expect(result).toHaveProperty('centerLng')
  })

  it('should allow a user requested position to override the default position', () => {
    const newState = clone(state)
    newState.map.userRequestedPosition = {position: 'center', centerLat: 49, centerLng: -115}
    const result = mapState(newState)
    expect(result).toHaveProperty('position', 'center')
    expect(result).toHaveProperty('centerLat', 49)
    expect(result).toHaveProperty('centerLng', -115)
  })

  it('should provide the available markers', () => {
    const result = mapState(state)
    expect(result).toHaveProperty('markers')
    expect(result.markers).toHaveLength(1)
    expect(result.markers[0]).toHaveProperty('lat', 53.5)
  })

  it('should add the centre location as a marker when a centre point has been requested', () => {
    const newState = clone(state)
    newState.geo = {
      type: 'location',
      centre_lat: 54.5,
      centre_lon: -113
    }
    const result = mapState(newState)
    expect(result).toHaveProperty('markers')
    expect(result.markers).toHaveLength(2)
    expect(result.markers[1]).toHaveProperty('lat', 54.5)
  })

  it('fit a polygon when geo is whosonfirst', () => {
    const result = mapState(state)
    expect(result).toHaveProperty('position', 'fitPolygon')
    expect(result).toHaveProperty('centerLat')
    expect(result).toHaveProperty('centerLng')
  })

  it('should add polygon coordinates', () => {
    const result = mapState(state)
    expect(result).toHaveProperty('polygons')
    expect(result.polygons[0]).toHaveProperty('coords', [
      {lat: 53.6376627052997, lng: -113.62415069667817},
      {lat: 53.64943351695871, lng: -113.62792671643722}
    ])
  })

  it('should be able to turn drawing mode on', () => {
    const newState = clone(state)
    newState.map.drawMode = true
    const result = mapState(newState)
    expect(result).toHaveProperty('drawingMode', 'polygon')
  })
})

describe('nextZoom', () => {
  const newState = clone(state)
  const f = nextZoom(newState)

  it('should return the zoomToEnhanceClusters if the zoom is below it', () => {
    const result = f(1)
    expect(result).toEqual(13)
  })

  it('should return the zoomToDoSearch if the zoom is below it', () => {
    const result = f(13)
    expect(result).toEqual(15)
  })

  it('should otherwise just increase the zoom by one', () => {
    const result = f(15)
    expect(result).toEqual(16)
  })
})
