import {getSrcForSize, getSrcset, getAltText, fitBoxes} from '../images'

// should replace https://redman-idx-edm.s3.amazonaws.com/224992169.000.jpg with
// https://redman-idx-edm.s3.amazonaws.com/medium/224992169.000.jpg

describe('getSrcForSize', () => {
  it('should replace a src url with a src for a specific url', () => {
    const result = getSrcForSize('https://redman-idx-edm.s3.amazonaws.com/224992169.000.jpg', 'medium')
    expect(result).toEqual('https://redman-idx-edm.s3.amazonaws.com/medium/224992169.000.jpg')
  })

  it('should throw if a the string cannot be parsed', () => {
    const f = () => getSrcForSize('foo')
    expect(f).toThrow()
  })
})

// should get sizes from
// function (src: url, sizes: [{name: 'medium', width: 768}])
// and return
// "https://redman-idx-edm.s3.amazonaws.com/medium/224992169.000.jpg 768w, https://redman-idx-edm.s3.amazonaws.com/small/224992169.000.jpg 504px"

describe('getSrcset', () => {
  it('should generate a full srcset based on a sizes object', () => {
    const result = getSrcset('https://redman-idx-edm.s3.amazonaws.com/224992169.000.jpg', [
      {name: 'medium', width: 768},
      {name: 'small', width: 504}
    ])
    expect(result).toEqual('https://redman-idx-edm.s3.amazonaws.com/medium/224992169.000.jpg 768w, https://redman-idx-edm.s3.amazonaws.com/small/224992169.000.jpg 504w')
  })
})

describe('getAltText', () => {
  it('should return a formatted string', () => {
    const source = {
      address: "559 CHAPPELLE Drive",
      bathrooms: 2.1,
      bedrooms: 3,
      building_types: ['house'],
      price: 319800
    }
    const result = getAltText(source)
    expect(result).toEqual('559 CHAPPELLE Drive, 3 bed, 2.1 bath, at $319,800')
  })

  it('should work if the beds are not provided', () => {
    const source = {
      address: "559 CHAPPELLE Drive",
      bathrooms: 2.1,
      building_types: ['house'],
      price: 319800
    }
    const result = getAltText(source)
    expect(result).toEqual('559 CHAPPELLE Drive, 2.1 bath, at $319,800')
  })

  it('should work if the baths are not provided', () => {
    const source = {
      address: "559 CHAPPELLE Drive",
      bedrooms: 3,
      building_types: ['house'],
      price: 319800
    }
    const result = getAltText(source)
    expect(result).toEqual('559 CHAPPELLE Drive, 3 bed, at $319,800')
  })

  it('should work if the address is not provided', () => {
    const source = {
      bathrooms: 2.1,
      bedrooms: 3,
      building_types: ['house'],
      price: 319800
    }
    const result = getAltText(source)
    expect(result).toEqual('Property, 3 bed, 2.1 bath, at $319,800')
  })

  it('should work if the price is not provided', () => {
    const source = {
      address: "559 CHAPPELLE Drive",
      bathrooms: 2.1,
      bedrooms: 3
    }
    const result = getAltText(source)
    expect(result).toEqual('559 CHAPPELLE Drive, 3 bed, 2.1 bath')
  })
})

describe('fitBoxes', () => {
  it('should fit a shorter box into a taller box by introducing a top offset', () => {
    const obs = fitBoxes({innerW: 3, innerH: 1, outerW: 3, outerH: 2})
    expect(obs).toHaveProperty('innerW', 3)
    // half the remaining space is placed on the top to center
    expect(obs).toHaveProperty('offsetT', 0.5)
  })

  it('should fit a taller box into a shorter box by shrinking it and introducing a left offset', () => {
    const obs = fitBoxes({innerW: 3, innerH: 6, outerW: 3, outerH: 2})
    // the innerH should be shrunk to 2, so the width will be half that or 1
    expect(obs).toHaveProperty('innerW', 1)
    // half the remaining space is placed on the left to center
    expect(obs).toHaveProperty('offsetL', 1)
  })
})
