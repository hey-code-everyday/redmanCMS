import {
  createGeo
} from '../geography'

describe('createGeo', () => {
  it('should infer a whosonfirst type as long as it has a whosonfirst id', () => {
    const location = {
      locationTitle: 'Holyrood',
      'whosonfirst.id': 12345
    }
    const geo = createGeo(location)
    expect(geo.type).toEqual('whosonfirst')
  })

  it('should infer a location type if it is flagged as a point, even if it has a whosonfirst id', () => {
    const location = {
      locationTitle: 'Holyrood',
      'whosonfirst.id': 12345,
      point: true,
      centre_lat: 54,
      centre_lon: -113
    }
    const geo = createGeo(location)
    expect(geo.type).toEqual('location')
  })

  it('should infer a pre_indexed_shape type as long there is pre_indexed_shape ID', () => {
    const location = {
      locationTitle: 'Holyrood',
      'pre_indexed_shape.id': 12345
    }
    const geo = createGeo(location)
    expect(geo.type).toEqual('pre_indexed_shape')
  })

  it('should infer a location type as long as centre coordinates are set', () => {
    const location = {
      locationTitle: 'Holyrood',
      centre_lat: 54,
      centre_lon: -113
    }
    const geo = createGeo(location)
    expect(geo.type).toEqual('location')
  })

  it('should infer a fake type as long as there is a raw field value', () => {
    const location = {
      locationTitle: 'Holyrood',
      raw: ['raw_field_bullshit']
    }
    const geo = createGeo(location)
    expect(geo.type).toEqual('fake')
  })
})
