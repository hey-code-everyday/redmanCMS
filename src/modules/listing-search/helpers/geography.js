// @flow

export function createGeo (data: Object) {
  const type = (!data.point && data['whosonfirst.id'])
    ? 'whosonfirst'
    : (!data.point && data['pre_indexed_shape.id'])
    ? 'pre_indexed_shape'
    : (data.centre_lat && data.centre_lon)
    ? 'location'
    : (data.raw)
    ? 'fake'
    : null

  if (!type) return null

  return {
    ...data,
    type
  }
}
