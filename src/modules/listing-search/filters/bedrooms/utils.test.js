import {toText, decodeSlug} from './utils'

describe('toText', () => {
  it('should be falsy if the value is null or undefined', () => {
    const obs = toText(undefined)
    expect(obs).toBeFalsy()
  })

  it('should be falsy if the value is 1p', () => {
    const obs = toText('1p')
    expect(obs).toBeFalsy()
  })

  it('should be "At least x" if the value is "xp"', () => {
    const obs = toText('3p')
    expect(obs).toEqual('3')
  })

  it('should throw on other values', () => {
    expect(() => {
      toText('foo')
    }).toThrow()
  })
})

describe('decodeSlug', () => {
  it('should decode 2-bedrooms', () => {
    const obs = decodeSlug('100k-1m--2-bedrooms--less-than-60-years--950-sqft--house-condo')
    expect(obs).toEqual({
      bedrooms: '2p'
    })
  })

  it('should return null if there is no match', () => {
    const obs = decodeSlug('foo-bar')
    expect(obs).toBeNull()
  })
})
