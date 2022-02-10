// @flow

import type {PolygonT} from './definitions'
import update from 'immutability-helper'

export default function (prevPolygons: Array<PolygonT>, nextPolygons: Array<PolygonT>) {
  this.refs.polygons && this.refs.polygons.forEach(polygon => {
    polygon.setMap(null)
  })

  // reset or vivify refs
  this.refs.polygons = []

  // add new markers
  nextPolygons && nextPolygons.forEach(nextPolygon => {
    // check that markers are valid

    const googlePolygon = new this.google.maps.Polygon({
      ...nextPolygon,
      paths: nextPolygon.coords,
      map: this.refs.map
    })
    this.refs.polygons = update(this.refs.polygons, {$push: [googlePolygon]})
  })

  return nextPolygons
}
