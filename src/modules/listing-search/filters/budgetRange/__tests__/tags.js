import {selectBreakpoint, getTag} from '../tags'

describe('selectBreakpoint', () => {
  it('should select a breakpoint', () => {
    const result = selectBreakpoint(215000)
    expect(result).toHaveProperty('low_price', 200000)
    expect(result).toHaveProperty('high_price', 225000)
  })

  it('should select edge case breakpoints with an unset value', () => {
    const result = selectBreakpoint(1500000)
    expect(result).toHaveProperty('low_price', 1000000)
  })

  it('should return null if the price falls outside of all breakpoints', () => {
    const result = selectBreakpoint(0)
    expect(result).toBeFalsy()
  })
})

describe('getTag', () => {
  const tag = getTag({})

  it('should return a tag with a values and a label', () => {
    const result = tag({price: 215000}, {})
    expect(result).toHaveProperty('label', '$200K - $225K')
    expect(result).toHaveProperty('values')
  })
})
