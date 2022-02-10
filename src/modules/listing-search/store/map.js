// @flow

import update from 'immutability-helper'
import {formatPriceRounded} from '../helpers/formatting'
import loginActionStorage from '@/helpers/loginActionStorage'
import * as c from '../mapConstants'

import type StateT from './stateShape'
import type {
  StateT as MapStateT,
  PolygonT,
  MarkerT
} from '../components/MapView/ReactiveGoogleMap/definitions'

type StoreT = {
  state: StateT,
  dispatch: Function,
  commit: Function
}

//
// ACTIONS

// {requestMapPosition} fetch any additional information needed to
// position the map
// This is an elaborate switch that dispatches other actions depending on
// the value of geo.type
export const requestMapPosition = ({state, dispatch}: StoreT) => {
  // signal that we are going to load data
  state.map.positionLoadState = 1
  state.map.userRequestedPosition = null

  if (!state.geo || state.geo.type === 'location') {
    state.map.positionLoadState = 2
  } else if (state.geo.type === 'whosonfirst') {
    dispatch('getGeo').then(() => {
      state.map.positionLoadState = 2
    })
  } else if (state.geo.type === 'pre_indexed_shape') {
    dispatch('preIndexedShape').then(() => {
      state.map.positionLoadState = 2
    })
  }
}

// {requestMapMarkers} populate the map based on its position
// Will call either searchMap or searchMapMarkers depending on the zoom level
export const requestMapMarkers = (
  {state, dispatch, commit}: StoreT,
  realPosition: Object
) => {
  state.map.realPosition = realPosition
  if (!realPosition) return
  if (!realPosition.zoom) {
  } else if (realPosition.zoom >= state.config.map.zoomToDoSearch) {
    dispatch('searchMap')
  } else if (realPosition.zoom >= state.config.map.zoomToEnhanceClusters) {
    dispatch('searchMapClusters', 6)
  } else if (realPosition.zoom >= state.config.map.defaultPosition.zoom) {
    dispatch('searchMapClusters', 5)
  } else if (realPosition.zoom >= 10) {
    dispatch('searchMap')
  } else {
    commit('clearMarkers')
    if (state.anchor === 'map') dispatch('notify', 'Zoom in to see properties')
  }
}

/**
 * Takes an array of lat lng coords and creates a geojson object
 * @param  {array} polygon Array of Objects like {lat: number, lng: number}
 * @return {Object} valid geojson object of type: "Polygon"
 */
export const polygon2GeoJson = (polygon: PolygonT) => {
  const closedPolygon = polygon.concat(polygon[0])
  return {
    type: 'Polygon',
    coordinates: [closedPolygon.map(point => [point.lng, point.lat])]
  }
}

export const customPolygon = (store: StoreT, polygon: PolygonT) => {
  const {dispatch} = store
  const geojson = polygon2GeoJson(polygon)
  dispatch('submitGeoJson', geojson)
    .then(() => {
      dispatch('requestMapPosition')
      // need to resubmit the search now that real polygon is present in DB
      console.log('submit')
      return dispatch('submit')
    })
    .then(() => {
      loginActionStorage.deferUntilLogin(store, 'openPanel', 'SaveSearch')
    })
}
export const formatPolygons = (
  position: ?Object,
  color: string
): Array<PolygonT> => {
  const mapCoords = coords => {
    return Array.isArray(coords[0][0])
      ? mapCoords(coords[0])
      : coords.map(coord => ({lat: coord[1], lng: coord[0]}))
  }

  if (!position) return []

  return position.coordinates.map(coordinateSet => ({
    strokeColor: color,
    coords: mapCoords(coordinateSet),
    ...c.POLYGON
  }))
}

// {pythag}
// Find the distance between two points that have lat and lng attributes
const pythag = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.lat - point2.lat, 2) + Math.pow(point1.lng - point2.lng, 2)
  )
}

// {collapseNearbyMarkers}
// identifies properties nearby and collapses them into a single marker
//
// each of the returned markers has a lat, lng and title attribute in
// addition to the starting attributes
//
// If multiple properties fall into a cluster the title is a | joined string
// of their titles
const collapseNearbyMarkers = markers =>
  markers.reduce((acc, marker) => {
    if (marker.point) {
      // skip this step for clusters generated on the backend
      return update(acc, {$push: [marker]})
    } else if (marker._source && marker._source.location) {
      // for properties, see if they are close to any properties already
      // in acc
      const lat = marker._source.location.lat
      const lng = marker._source.location.lon

      // loop through properties processed so far
      for (var i = 0; i < acc.length; i++) {
        const accMarker = acc[i]
        const distance = pythag(accMarker, {lat, lng})

        // if close, replace that marker with a "cluster"
        if (distance < c.COLLAPSE_DISTANCE) {
          // create title by joining existing title with |
          const title = [accMarker.title, marker._id].join('|')
          const replacementMarker = {...accMarker, title, isGroup: true}
          return update(acc, {$splice: [[i, 1, replacementMarker]]})
        }
      }

      // if it is not close to ANY marker create a new one
      const newMarker = {
        ...marker,
        lat,
        lng,
        title: marker._id,
        isGroup: false
      }
      return update(acc, {$push: [newMarker]})
    }

    // fallback - if no point OR location, leave this one out
    return acc
  }, [])
export const formatMarkers = (
  markers: Array<Object>,
  color: string,
  openMarker: ?string
): Array<MarkerT> => {
  const clusterIcon = {
    fillColor: color,
    ...c.CLUSTER_ICON
  }
  const propertyIcon = {
    fillColor: color,
    ...c.PROPERTY_ICON
  }
  const condoIcon = {
    fillColor: color,
    ...c.CONDO_ICON
  }
  const openPropertyIcon = {
    strokeColor: color,
    ...c.OPEN_PROPERTY_ICON
  }
  const openCondoIcon = {
    strokeColor: color,
    ...c.OPEN_CONDO_ICON
  }

  return collapseNearbyMarkers(markers).map(marker => {
    if (marker.point) {
      // is cluster
      const lat = marker.point.lat
      const lng = marker.point.lon
      const label = {color: '#fff', text: String(marker.doc_count)}
      const title = `${marker.key}-${marker.doc_count}`

      // transform clusters of more than 10 to have larger physical size
      const icon =
        marker.doc_count > 10
          ? update(clusterIcon, {
              scale: {
                $apply: base =>
                  (base * Math.log(marker.doc_count)) / Math.log(10)
              }
            })
          : clusterIcon
      return {
        icon,
        title,
        label,
        lat,
        lng
      }
    } else if (marker.isGroup) {
      // is a group of properties
      // these attributes have been assigned by collapseNearbyMarkers
      const {lat, lng, title} = marker
      const label = String(title.split('|').length)
      return title === openMarker
        ? {
            icon: openCondoIcon,
            title: 'open',
            label: {color, fontWeight: '700', text: label},
            lat,
            lng
          }
        : {
            icon: condoIcon,
            title,
            label: {color: '#fff', fontWeight: '700', text: label},
            lat,
            lng
          }
    } else {
      // is property
      const {lat, lng, title} = marker
      // use the price as the label for single properties, otherwise use the
      // number of properties in the cluster
      const label = formatPriceRounded(marker._source.price)
      return title === openMarker
        ? {
            icon: openPropertyIcon,
            title: 'open',
            label: {color, text: label},
            lat,
            lng
          }
        : {
            icon: propertyIcon,
            title,
            label: {color: '#fff', text: label},
            lat,
            lng
          }
    }
  })
}

// GETTER
// {mapState}
// Returns a mapState that can be consumed by ReactiveGoogleMaps
export const mapState = (state: StateT): MapStateT => {
  // duck type whether this is the full application state or just the gus state
  if (state.gus) return mapState(state.gus)

  const {config} = state
  const defaults: MapStateT = {
    position: 'center',
    centerLat: config.map.defaultPosition.centre_lat,
    centerLng: config.map.defaultPosition.centre_lon,
    zoom: config.map.defaultPosition.zoom,
    markers: [],
    polygons: [],
    drawingMode: null
  }
  const color = config.styles.mapMarkerColor || config.styles.primaryColor

  let mapData
  if (state.map.userRequestedPosition) {
    mapData = state.map.userRequestedPosition
  } else if (state.geo) {
    const geo = state.geo
    const type = geo.type
    const centerLat = geo.centre_lat
    const centerLng = geo.centre_lon
    mapData = update(defaults, {
      $merge: {
        position:
          type === 'whosonfirst' || type === 'pre_indexed_shape'
            ? 'fitPolygon'
            : 'center',
        centerLat: centerLat || config.map.defaultPosition.centre_lat,
        centerLng: centerLng || config.map.defaultPosition.centre_lon,
        zoom:
          type === 'location'
            ? config.map.zoomToDoSearch
            : config.map.defaultPosition.zoom
      }
    })
  } else {
    mapData = defaults
  }

  if (state.map.markers) {
    mapData.markers = formatMarkers(
      state.map.markers,
      color,
      state.map.openMarker
    )
  } else {
    mapData.markers = []
  }

  if (state.geo && state.geo.type !== 'location' && state.geo.geometry) {
    try {
      mapData.polygons = formatPolygons(state.geo.geometry, color)
    } catch (e) {
      console.error('Unable to decode polygon')
      return defaults
    }
  } else if (state.geo && state.geo.centre_lat && state.geo.centre_lon) {
    mapData.markers.push({
      title: 'map-center',
      lat: state.geo.centre_lat,
      lng: state.geo.centre_lon,
      icon: {strokeColor: config.styles.primaryColor, ...c.SORT_CENTER_ICON}
    })
  }

  mapData.drawingMode = state.map.drawMode ? 'polygon' : null

  return mapData
}

export const nextZoom = (state: StateT) => (currentZoom: number) => {
  const {zoomToEnhanceClusters, zoomToDoSearch} = state.config.map
  if (currentZoom < zoomToEnhanceClusters) return zoomToEnhanceClusters
  else if (currentZoom < zoomToDoSearch) return zoomToDoSearch
  return currentZoom + 1
}
