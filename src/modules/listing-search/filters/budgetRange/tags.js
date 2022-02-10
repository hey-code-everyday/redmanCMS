// @flow

import {formatRange} from './utils'
import type {Tag} from '../../helpers/tags.js'

type Breakpoint = {
  low_price: ?number,
  high_price: ?number,
  label: ?string
}

// TODO: break this down and refactor it assuming anyone every asks for customization
const BREAKPOINTS = (() => {
  var low = 25000
  var breakpoints = []
  while (low < 300000) {
    var high = low + 25000
    breakpoints.push({low_price: low, high_price: high, label: formatRange(low, high)})
    low = high
  }
  while (low < 700000) {
    high = low + 50000
    breakpoints.push({low_price: low, high_price: high, label: formatRange(low, high)})
    low = high
  }
  low = 700000
  high = 1000000
  breakpoints.push({low_price: low, high_price: high, label: formatRange(low, high)})
  breakpoints.push({low_price: high, high_price: null, label: formatRange(high, 0)})
  return breakpoints.slice()
})()

// select the FIRST breakpoint that overlaps the price
export const selectBreakpoint = (price: number, breakpoints: Array<Breakpoint> = BREAKPOINTS): ?Breakpoint => {
  return breakpoints.reduce((found, breakpoint) => {
    if (found) return found
    if (
      (!breakpoint.low_price || price >= breakpoint.low_price) &&
      (!breakpoint.high_price || price <= breakpoint.high_price - 1)
    ) return breakpoint
    return null
  }, null)
}

// facade function that shims the breakpoints to the values expected by Tags.vue
export const getTag: ?Tag = (config: Object) => (listingData: Object) => {
  const breakpoint = selectBreakpoint(listingData.price)
  if (!breakpoint) return null

  return {
    label: breakpoint.label,
    values: {low_price: breakpoint.low_price, high_price: breakpoint.high_price}
  }
}
