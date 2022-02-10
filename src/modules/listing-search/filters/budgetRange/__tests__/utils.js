import {formatRange, decodeSlug} from '../utils'

describe('formatRange', () => {
  it('should return be false if neither filter is set', () => {
    const obs = formatRange(null, null)
    expect(obs).toBeFalsy()
  })

  it('should return "Above X" if only the low_price filter is set', () => {
    const obs = formatRange(50000, null)
    expect(obs).toEqual('Above $50K')
  })

  it('should return "Below X" if only the high_price filter is set', () => {
    const obs = formatRange(null, 500000)
    expect(obs).toEqual('Below $500K')
  })

  it('should return "X - Y" if both filters are set', () => {
    const obs = formatRange(50000, 1000000)
    expect(obs).toEqual('$50K - $1M')
  })
})

describe('decodeSlug', () => {
  it('should find the budget range as encoded in the entire string', () => {
    const obs = decodeSlug('100k-1m--2-bedrooms--less-than-60-years--950-sqft--house-condo')
    expect(obs).toEqual({
      low_price: 100000,
      high_price: 1000000
    })
  })

  it('should find a price below', () => {
    const obs = decodeSlug('below-1m')
    expect(obs).toHaveProperty('high_price', 1000000)
  })

  it('should find a price above', () => {
    const obs = decodeSlug('above-100k')
    expect(obs).toHaveProperty('low_price', 100000)
  })

  it('should return null if nothing is found', () => {
    const obs = decodeSlug('foo-bar')
    expect(obs).toBeNull()
  })
})
