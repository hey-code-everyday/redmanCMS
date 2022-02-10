import update from 'immutability-helper'

export const POLYGON = {
  strokeWeight: 2,
  fillColor: '#fff',
  fillOpacity: 0.2
}

export const CLUSTER_ICON = {
  path: 'm -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
  fillOpacity: 0.8,
  strokeWeight: 0,
  scale: 0.2
}

export const PROPERTY_ICON = {
  path: 'M -1 -0.5 h2 v1 h-0.67 l -0.33 0.5 l -0.33 -0.5 h -0.67 v-1',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 25
}

export const CONDO_ICON = update(PROPERTY_ICON, {$merge: {
  path: 'M -0.5 -0.5 h1 v1 h-0.33 l -0.2 0.5 l -0.2 -0.5 h -0.33 v-1',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 25
}})

export const OPEN_PROPERTY_ICON = update(PROPERTY_ICON, {$merge: {
  fillColor: '#fff',
  strokeWeight: 2
}})

export const OPEN_CONDO_ICON = update(CONDO_ICON, {$merge: {
  fillColor: '#fff',
  strokeWeight: 2
}})

export const SORT_CENTER_ICON = {
  path: 'm -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0 M -75, 0 L 75, 0 M 0, -75 L 0, 75',
  strokeWeight: 2,
  strokeColor: 'green',
  fillColor: 'transparent',
  scale: 0.3
}

export const COLLAPSE_DISTANCE = 1E-13
