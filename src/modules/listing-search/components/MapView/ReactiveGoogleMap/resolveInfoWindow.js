
import type {InfoWindowT} from 'definitions'

export default function (prevInfoWindow: InfoWindowT, nextInfoWindow: InfoWindowT) {
  // get rid of the old info window if it exists
  if (this.refs.infoWindow) {
    this.refs.infoWindow.close()
    this.refs.infoWindow = null
  }

  if (nextInfoWindow) {
    const content = nextInfoWindow.content
    const data = nextInfoWindow.data
    const googleInfoWindow = new this.google.maps.InfoWindow({
      content: nextInfoWindow.content,
      position: {lat: nextInfoWindow.lat, lng: nextInfoWindow.lng},
      closeBoxURL: ''
    })
    googleInfoWindow.addListener('domready', e => {
      this.publish('@@RGM/INFO_WINDOW_LOADED', {content, data})
    })
    googleInfoWindow.addListener('closeclick', () => {
      this.publish('@@RGM/INFO_WINDOW_REQ_CLOSE', {content, data})
    })
    googleInfoWindow.open(this.refs.map)
    this.refs.infoWindow = googleInfoWindow
  }

  return nextInfoWindow
}
