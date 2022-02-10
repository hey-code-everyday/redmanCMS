
export type MarkerT = {
  lat: number,
  lng: number,
  title: string
}

export type InfoWindowT = {
  content: string,
  lat: number,
  lng: number
}

export type PolygonT = {
  coords: Array<{lat: number, lng: number}>
}

export type DrawingModeT = 'polygon'

export type StateT = {
  position: 'center' | 'fit' | 'manual' | 'fitPolygon',
  centerLat: number,
  centerLng: number,
  zoom: number,
  markers: Array<MarkerT>,
  activeMarker: ?MarkerT,
  infoWindow: string,
  polygons: Array<PolygonT>,
  drawingMode: ?DrawingModeT
}

export type RefsT = {
  map: Object,
  markers?: Array<Object>,
  infoWindow?: Object,
  polygons?: Array<Object>,
  drawingManager?: Object,
  drawingManagerOverlay?: Object
}

export type ReactiveMapT = {
  state: StateT,
  domElement: Object,
  apiKey: string,
  refs: RefsT,
  subscribers: Array<Function>
}
