// @flow
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'

import resolveMarkers from './resolveMarkers'
import resolveInfoWindow from './resolveInfoWindow'
import resolvePolygons from './resolvePolygons'
import resolveDrawingMode from './resolveDrawingMode'

import type {StateT, ReactiveMapT} from './definitions'

const GoogleMapsApiLoader = require('google-maps-api-loader')

const defaultState = {
  position: 'center',
  centerLat: 0,
  centerLng: 0,
  zoom: 1,
  markers: [],
  infoWindow: null,
  polygons: [],
  drawingMode: null,
  drawingManagerOverlay: null
}

const Prototype = {
  publish: function (type: string, payload: Object) {
    this.subscribers.forEach(subscriber => subscriber(type, payload, this.state))
  },

  getMap: function (domElement, initialState) {
    const googleMap = new this.google.maps.Map(domElement, {
      center: {lat: initialState.centerLat, lng: initialState.centerLng},
      zoom: initialState.zoom,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      zoomControl: true,
      zoomControlOptions: {
        position: this.google.maps.ControlPosition.LEFT_CENTER
      }
    })

    const publishInfrequently = debounce(() => {
      const bounds = googleMap.getBounds()
      const center = googleMap.getCenter()
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      this.publish('@@RGM/BOUNDS_CHANGED', {
        centerLat: center.lat(),
        centerLng: center.lng(),
        zoom: googleMap.getZoom(),
        north: ne.lat(),
        east: ne.lng(),
        south: sw.lat(),
        west: sw.lng()
      })
    }, 500).bind(this)

    googleMap.addListener('bounds_changed', publishInfrequently)

    return googleMap
  },

  dispatch: function (nextState) {
    if (!isEqual(this.state.markers, nextState.markers)) {
      const markers = resolveMarkers.call(this, this.state.markers, nextState.markers)
      this.state.markers = markers
    }

    if (!isEqual(this.state.infoWindow, nextState.infoWindow)) {
      const infoWindow = resolveInfoWindow.call(this, this.state.infoWindow, nextState.infoWindow)
      this.state.infoWindow = infoWindow
    }

    if (!isEqual(this.state.polygons, nextState.polygons)) {
      const polygon = resolvePolygons.call(this, this.state.polygons, nextState.polygons)
      this.state.polygons = polygon
    }

    if (this.state.drawingMode !== nextState.drawingMode) {
      const drawingMode = resolveDrawingMode.call(this, this.state.drawingMode, nextState.drawingMode)
      this.state.drawingMode = drawingMode
    }

    if (
      nextState.position === 'center' &&
        (
          this.state.position !== 'center' ||
          this.state.centerLat !== nextState.centerLat ||
          this.state.centerLng !== nextState.centerLng ||
          this.state.zoom !== nextState.zoom
        )
    ) {
      this.refs.map.setCenter({lat: nextState.centerLat, lng: nextState.centerLng})
      this.refs.map.setZoom(nextState.zoom)
      this.state.centerLat = nextState.centerLat
      this.state.centerLng = nextState.centerLng
      this.state.zoom = nextState.zoom
    } else if (nextState.position === 'fit' && this.refs.markers) {
      const bounds = new this.google.maps.LatLngBounds()
      this.refs.markers.forEach(marker => bounds.extend(marker.getPosition()))
      this.refs.map.fitBounds(bounds)

      this.state.position = 'fit'
    } else if (
      nextState.position === 'fitPolygon' &&
      nextState.polygons.length &&
      this.refs.polygons.length
    ) {
      const bounds = new this.google.maps.LatLngBounds()
      this.state.polygons.forEach(polygon => {
        polygon.coords.forEach(coord => bounds.extend({lat: coord.lat, lng: coord.lng}))
      })
      this.refs.map.fitBounds(bounds)

      this.state.position = 'fitPolygon'
    } else if (nextState.position === 'manual') {
      this.state.position = 'manual'
    }
  },

  subscribe: function (subscriber) {
    this.subscribers.push(subscriber)
  }
}

export const testReactiveMap = (mock: Object, domElement: Object, initialState: StateT): ReactiveMapT => {
  const reactiveMap = Object.assign(Object.create(Prototype), {
    state: defaultState,
    domElement,
    apiKey: 'TestApiKey',
    subscribers: [],
    google: mock,
    refs: {}
  })
  reactiveMap.refs.map = reactiveMap.getMap(domElement, initialState)
  reactiveMap.dispatch(initialState)
  return reactiveMap
}

export default (apiKey: string, domElement: Object, initialState: StateT): ReactiveMapT => {
  const reactiveMap = Object.assign(Object.create(Prototype), {
    state: defaultState,
    domElement,
    apiKey,
    subscribers: [],
    refs: {}
  })

  return new Promise((resolve, reject) => {
    GoogleMapsApiLoader({
      libraries: ['drawing'],
      apiKey
    }).then(google => {
      reactiveMap.google = google
      reactiveMap.refs.map = reactiveMap.getMap(domElement, initialState)
      reactiveMap.dispatch(initialState)
      return resolve(reactiveMap)
    }).catch(e => reject(e))
  })
}
