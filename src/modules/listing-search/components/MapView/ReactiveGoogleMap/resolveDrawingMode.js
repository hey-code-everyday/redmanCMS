
import type {DrawingModeT} from 'definitions'

export default function (prevDrawingMode: ?DrawingModeT, nextDrawingMode: DrawingModeT) {
  // get rid of the old info window if it exists
  if (!nextDrawingMode) {
    // destroy old drawingManager
    if (this.refs.drawingManager) {
      this.refs.drawingManager.setMap(null)
    }
    // destroy old shape
    if (this.refs.drawingManagerOverlay) {
      this.refs.drawingManagerOverlay.setMap(null)
    }
  } else if (nextDrawingMode) {
    // create new drawingManager
    this.refs.drawingManager = new this.google.maps.drawing.DrawingManager({
      drawingMode: this.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false
    })
    this.refs.drawingManager.setMap(this.refs.map)

    // when the user finishes, emit the coordinates
    this.refs.drawingManager.addListener('polygoncomplete', polygon => {
      this.refs.drawingManagerOverlay = polygon
      const coords = polygon.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      }))
      this.publish('@@RGM/POLYGON_COMPLETE', {
        coords
      })
    })
  }

  return nextDrawingMode
}
