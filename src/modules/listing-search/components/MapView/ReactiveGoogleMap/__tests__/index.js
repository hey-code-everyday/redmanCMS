import {testReactiveMap as testMap} from '../index'
import deepFreeze from 'deep-freeze'

const addListener = jest.fn()
const setCenter = jest.fn()
const setZoom = jest.fn()
const setMap = jest.fn()
const openInfoWindow = jest.fn()
const closeInfoWindow = jest.fn()

const fakeGoogle = {
  maps: {
    Map: jest.fn(function () {
      this.addListener = addListener
      this.setCenter = setCenter
      this.setZoom = setZoom
    }),
    Marker: jest.fn(function (setup) {
      this.addListener = addListener
      this.setMap = setMap
      this.title = setup.title
    }),
    InfoWindow: jest.fn(function () {
      this.addListener = addListener
      this.close = closeInfoWindow
      this.open = openInfoWindow
    }),
    Polygon: jest.fn(function () {
      this.setMap = setMap
    }),
    ControlPosition: {
      LEFT_BOTTOM: true
    },

    drawing: {
      DrawingManager: jest.fn(function (setup) {
        this.addListener = addListener
        this.setMap = setMap
      }),
      OverlayType: {POLYGON: 'polygon'}
    }
  }
}

describe('initiation', () => {
  const state = {
    position: 'center',
    centerLat: 54,
    centerLng: -113,
    zoom: 11
  }

  it('should create a map', () => {
    const map = testMap(fakeGoogle, {}, state)
    expect(fakeGoogle.maps.Map).toHaveBeenCalled()
    expect(map.refs).toHaveProperty('map')
  })
})

describe('dispatch', () => {
  let map
  beforeEach(() => {
    const state = {
      centerLat: 54,
      centerLng: -113,
      zoom: 11,
      markers: [{lat: 54.1, lng: -113.1, title: 'old'}]
    }
    deepFreeze(state)
    map = testMap(fakeGoogle, {}, state)
  })

  describe('dispatch markers', () => {
    it('should add new markers', () => {
      map.dispatch({
        markers: [{lat: 53.9, lng: -112.9, title: 'new'}]
      })
      expect(map.state.markers).toHaveLength(1)
      expect(map.state.markers[0]).toHaveProperty('title', 'new')
    })

    it('should throw is any of the new markers do not have titles', () => {
      expect(() => {
        map.dispatch({
          markers: [{lat: 53.9, lng: -112.9}]
        })
      }).toThrow()
    })

    it('should create markers', () => {
      map.dispatch({
        markers: [{lat: 53.9, lng: -112.9, title: 'new'}]
      })
      expect(fakeGoogle.maps.Marker).toHaveBeenCalled()
    })

    it('should remove markers from refs and the map', () => {
      map.dispatch({
        markers: [{lat: 53.9, lng: -112.9, title: 'new'}]
      })
      expect(setMap).toHaveBeenCalledWith(null)
      expect(map.refs.markers).toHaveLength(1)
    })
  })

  describe('dispatch info window', () => {
    let map
    beforeEach(() => {
      const state = {
        centerLat: 54,
        centerLng: -113,
        zoom: 11,
        markers: [{lat: 54.1, lng: -113.1, title: 'old'}, {lat: 53.9, lng: -112.9, title: 'new'}],
        infoWindow: {content: 'old content', lat: 53.9, lng: -112.9}
      }
      deepFreeze(state)
      map = testMap(fakeGoogle, {}, state)
    })

    it('should replace the info window in the state', () => {
      map.dispatch({
        markers: [{lat: 54.1, lng: -113.1, title: 'old'}, {lat: 53.9, lng: -112.9, title: 'new'}],
        infoWindow: {content: 'new content', lat: 53.9, lng: -112.9}
      })
      expect(map.state.infoWindow).toHaveProperty('content', 'new content')
    })

    it('should close the old info window', () => {
      map.dispatch({
        markers: [{lat: 54.1, lng: -113.1, title: 'old'}, {lat: 53.9, lng: -112.9, title: 'new'}],
        infoWindow: {content: 'new content', lat: 53.9, lng: -112.9}
      })
      expect(closeInfoWindow).toHaveBeenCalled()
    })

    it('should open a new info window', () => {
      map.dispatch({
        markers: [{lat: 54.1, lng: -113.1, title: 'old'}, {lat: 53.9, lng: -112.9, title: 'new'}],
        infoWindow: {content: 'new content', lat: 53.9, lng: -112.9}
      })
      expect(fakeGoogle.maps.InfoWindow).toHaveBeenCalled()
    })
  })

  describe('dispatch polygons', () => {
    let map
    const coords = [
      {lat: 25.774, lng: -80.190},
      {lat: 18.466, lng: -66.118},
      {lat: 32.321, lng: -64.757}
    ]
    beforeEach(() => {
      const state = {
        centerLat: 54,
        centerLng: -113,
        zoom: 11,
        polygons: [{coords}]
      }
      deepFreeze(state)
      map = testMap(fakeGoogle, {}, state)
    })

    it('should add the polygon to the state', () => {
      map.dispatch({
        polygons: [{strokeColor: '#F00', coords}]
      })
      expect(map.state.polygons).toHaveLength(1)
      expect(map.state.polygons[0]).toHaveProperty('strokeColor')
    })

    it('should generate a new polygon and add it to the refs', () => {
      map.dispatch({
        polygons: [{strokeColor: '#F00', coords}]
      })
      expect(fakeGoogle.maps.Polygon).toHaveBeenCalled()
      expect(map.refs.polygons).toHaveLength(1)
    })

    it('should remove all existing polygons', () => {
      map.dispatch({
        polygons: []
      })
      expect(setMap).toHaveBeenCalledWith(null)
      expect(map.refs.polygons).toHaveLength(0)
    })
  })

  describe('dispatch drawingMode', () => {
    let map
    let state
    beforeEach(() => {
      state = {
        centerLat: 54,
        centerLng: -113,
        zoom: 11
      }
      deepFreeze(state)
      map = testMap(fakeGoogle, {}, state)
    })

    it('should update the state', () => {
      map.dispatch({
        drawingMode: 'polygon',
        ...state
      })
      expect(map.state).toHaveProperty('drawingMode', 'polygon')
    })

    it('should create a drawingManager with an attached event listener', () => {
      map.dispatch({
        drawingMode: 'polygon',
        ...state
      })
      expect(map.refs).toHaveProperty('drawingManager')
      expect(map.refs.drawingManager.setMap).toHaveBeenCalledWith(map.refs.map)
    })

    it('should turn off the drawing manager', () => {
      map.dispatch({
        drawingMode: 'polygon',
        ...state
      })
      map.dispatch({
        drawingMode: null,
        ...state
      })
      expect(map.state.drawingMode).toBeFalsy()
      expect(map.refs.drawingManager.setMap).toHaveBeenCalledWith(null)
    })
  })
})
