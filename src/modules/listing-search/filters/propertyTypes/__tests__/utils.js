import {toText, decodeSlug} from '../utils'

describe('toText', () => {
  it('should be false if the filter is falsy', () => {
    const obs = toText(null)
    expect(obs).toBeFalsy()
  })

  it('should be false if the filter is empty', () => {
    const obs = toText([])
    expect(obs).toBeFalsy()
  })

  it('should format a single value as the capitalized label', () => {
    const obs = toText(['house'])
    expect(obs).toEqual('House')
  })

  it('should format two values as an & seperated pair with the first value capitalized', () => {
    const obs = toText(['house', 'land'])
    expect(obs).toEqual('House & land')
  })

  it('should format three or more values as a comma separated list except that the last value is ampersand separated', () => {
    const obs = toText(['house', 'condo', 'townhouse', 'land'])
    expect(obs).toEqual('House, condo, townhouse & land')
  })
})

describe('decodeSlug', () => {
  it('should find any property type', () => {
    const obs = decodeSlug('100k-1m-2-bedrooms-less-than-60-years-950-sqft-house')
    expect(obs).toEqual({property_types: 'house'})
  })

  it('should find multiple property types and | separate them', () => {
    const obs = decodeSlug('100k-1m-2-bedrooms-less-than-60-years-950-sqft-house-condo')
    expect(obs).toEqual({property_types: 'house|condo'})
  })

  it('should not confuse a property types contained by another property type', () => {
    const obs = decodeSlug('950-sqft-townhouse')
    expect(obs).toEqual({property_types: 'townhouse'})
  })

  it('should be null if there are no matches', () => {
    const obs = decodeSlug('100k-1m-2-bedrooms-less-than-60-years-950-sqft')
    expect(obs).toBeNull()
  })
})
