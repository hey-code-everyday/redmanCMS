import {
  thousandsSeparator,
  formatSqft,
  formatPrice,
  formatPriceRounded,
  createDecodeSlug,
  listingDetailsHref,
  deslugify
} from '../formatting'

describe('thousandsSeparator', () => {
  it('should not touch numbers of three digits or less', () => {
    const obs = thousandsSeparator(123)
    expect(obs).toEqual('123')
  })

  it('should separate numbers of more than three digits', () => {
    const obs = thousandsSeparator(1234)
    expect(obs).toEqual('1 234')
  })

  it('should accept a custom separator if provided', () => {
    const obs = thousandsSeparator(12345678, ',')
    expect(obs).toEqual('12,345,678')
  })
})

describe('formatSqft', () => {
  it('should return false for falsy values', () => {
    const obs = formatSqft(0)
    expect(obs).toBeFalsy()
  })

  it('should format 666 sqft', () => {
    const obs = formatSqft(666)
    expect(obs).toEqual('666 sqft')
  })

  it('should round to whole numbers', () => {
    const obs = formatSqft(1666.1111)
    expect(obs).toEqual('1666 sqft')
  })
})

describe('formatPrice', () => {
  it('should format prices with gaps as thousand separators', () => {
    const obs = formatPrice(1000000)
    expect(obs).toEqual('$1 000 000')
  })

  it('should round to whole dollars', () => {
    const obs = formatPrice(1000.50)
    expect(obs).toEqual('$1 001')
  })

  it('should return null for 0', () => {
    const obs = formatPrice(0)
    expect(obs).toBeNull()
  })

  it('should return null for negative numbers', () => {
    const obs = formatPrice(-10)
    expect(obs).toBeNull()
  })

  it('should return null for NaN', () => {
    const obs = formatPrice(NaN)
    expect(obs).toBeNull()
  })
})

describe('formatPriceRounded', () => {
  it('should format thousands as K', () => {
    const obs = formatPriceRounded(250000)
    expect(obs).toEqual('$250K')
  })

  it('should format millions as M', () => {
    const obs = formatPriceRounded(2000000)
    expect(obs).toEqual('$2M')
  })

  it('should return null for 0', () => {
    const obs = formatPriceRounded(0)
    expect(obs).toBeNull()
  })

  it('should return null for negative numbers', () => {
    const obs = formatPriceRounded(-10)
    expect(obs).toBeNull()
  })

  it('should return null for NaN', () => {
    const obs = formatPriceRounded(NaN)
    expect(obs).toBeNull()
  })
})

describe('createDecodeSlug', () => {
  const decodeSlug = createDecodeSlug(/(\d)-bedrooms/, 'bedrooms', '%p')

  it('should return a function', () => {
    expect(() => {
      decodeSlug('foo-bar')
    }).not.toThrow()
  })

  it('should decode 2-bedrooms', () => {
    const obs = decodeSlug('100k-1m--2-bedrooms--less-than-60-years--950-sqft--house-condo')
    expect(obs).toEqual({bedrooms: '2p'})
  })

  it('should return null if there is no match', () => {
    const obs = decodeSlug('foo-bar')
    expect(obs).toBeNull()
  })
})

describe('listingDetailsHref', () => {
  it('should insert the actual MLS# into the URL', () => {
    const result = listingDetailsHref('/details/%slug%', 'E12345')
    expect(result).toEqual('/details/E12345')
  })

  it('it should include the address if there is one', () => {
    const result = listingDetailsHref('/details/%slug%', 'E12345', '2920 17 Ave')
    expect(result).toEqual('/details/2920-17-ave--E12345')
  })

  it('should handle %mls% instead for compatibility', () => {
    const result = listingDetailsHref('/details/%mls%', 'E12345')
    expect(result).toEqual('/details/E12345')
  })
})

describe('deslugify', () => {
  it('should deslugify a slug', () => {
    const result = deslugify('west-edmonton')
    expect(result).toEqual('West Edmonton')
  })
})
