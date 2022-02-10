// @flow

import type {MarkerT} from './definitions'
import update from 'immutability-helper'

export default function (prevMarkers: Array<MarkerT>, nextMarkers: Array<MarkerT>) {
  // vivify refs
  if (!this.refs.markers) this.refs.markers = []

  // add new markers
  nextMarkers && nextMarkers.filter(nextMarker => {
    if (!prevMarkers) return true
    return !prevMarkers.find(prevMarker => prevMarker.title === nextMarker.title)
  }).forEach(marker => {
    // check that markers are valid
    if (!marker.lat || !marker.lng || !marker.title) {
      throw new Error('ReactiveGoogleMap: Invalid marker passed in state')
    }

    const google = this.google
    const googleMarker = new google.maps.Marker({
      position: {lat: marker.lat, lng: marker.lng},
      map: this.refs.map,
      title: marker.title,
      label: marker.label,
      icon: marker.icon
    })
    googleMarker.addListener('click', e => {
      this.publish('@@RGM/MARKER_CLICK', marker)
    })
    this.refs.markers = update(this.refs.markers, {$push: [googleMarker]})
  })

  // remove markers we don't need anymore
  prevMarkers && prevMarkers.filter(prevMarker => {
    if (!nextMarkers) return true
    return !nextMarkers.find(nextMarker => nextMarker.title === prevMarker.title)
  }).forEach(marker => {
    const i = this.refs.markers.findIndex(ref => ref.title === marker.title)
    if (i === -1) return
    this.refs.markers[i].setMap(null)
    this.refs.markers = update(this.refs.markers, {$splice: [[i, 1]]})
  })

  return nextMarkers
}
