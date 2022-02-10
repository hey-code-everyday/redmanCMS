import {
  encodeValue
} from './utils'

describe('encodeTextValue', () => {
  it('should encode a text value with an operator inside square brackets', () => {
    const result = encodeValue('office', {
      rawFieldOperator: '≈or'
    })
    expect(result).toEqual('≈or[office]')
  })

  it('should encode a single text value WITHOUT square brackets if it has no operator', () => {
    const result = encodeValue('office', {})
    expect(result).toEqual('office')
  })

  it('should encode a single text value WITHOUT square brackets if the operator is ≈', () => {
    const result = encodeValue('office', {
      rawFieldOperator: '≈'
    })
    expect(result).toEqual('office')
  })

  it('should encode an array of values as comma-separated inside square brackets', () => {
    const result = encodeValue(['office', 'industrial'], {
      rawFieldOperator: '≈or'
    })
    expect(result).toEqual('≈or[office,industrial]')
  })

  it('should encode an array of values as comma-separated inside square brackets', () => {
    const result = encodeValue(['office'], {
      rawFieldOperator: '≈or'
    })
    expect(result).toEqual('≈or[office]')
  })

  it('should handle lack of rawFieldOperator and just leave it out', () => {
    const result = encodeValue(['office', 'industrial'], {})
    expect(result).toEqual('[office,industrial]')
  })

  it('should return null if value is an empty string', () => {
    const result = encodeValue('', {
      rawFieldOperator: '≈or'
    })
    expect(result).toBeNull()
  })

  it('should return null if value is an empty array', () => {
    const result = encodeValue([], {
      rawFieldOperator: '≈or'
    })
    expect(result).toBeNull()
  })
})
