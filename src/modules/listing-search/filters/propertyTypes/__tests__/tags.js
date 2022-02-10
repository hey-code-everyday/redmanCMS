import {selectPropertyType} from '../tags'

describe('selectPropertyType', () => {
  it('should select a single property type from an array based on what is allowed in the configuration', () => {
    const result = selectPropertyType(['house', 'condo'], ['condo'])
    expect(result).toEqual('condo')
  })

  it('should return null if no suitable property type can be found', () => {
    const result = selectPropertyType(['house'], ['condo'])
    expect(result).toBeFalsy()
  })
})
