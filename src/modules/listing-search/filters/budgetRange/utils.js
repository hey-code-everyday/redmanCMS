// @flow

import type {Tag} from '../../helpers/tags'
import {formatPriceRounded} from '../../helpers/formatting'

export const filters = ['low_price', 'high_price']

export function formatRange (lowPrice: number, highPrice: number) {
  const low = formatPriceRounded(lowPrice)
  const high = formatPriceRounded(highPrice)
  if (low && high) {
    return `${low} - ${high}`
  } else if (low) {
    return `Above ${low}`
  } else if (high) {
    return `Below ${high}`
  }
  return null
}

export function sidebarText (values: Object) {
  return formatRange(values.low_price, values.high_price)
}

export function panelText (lowPrice: number, highPrice: number) {
  return formatRange(lowPrice, highPrice) || 'Any amount'
}

export function generateTag (propertyInfo: Object, values: Object, config: Object): Tag | boolean {
  return {
    label: '$350K - $450K',
    checked: false,
    values: {low_price: 350000, high_price: 450000}
  }
}

export function decodeSlug (slug: string) {
  let low, high
  // expressions like "100k-1m"
  const rangeMatch = /(\d+[mk])-(\d+[mk])/.exec(slug)
  // expressions like 'below-100k'
  const belowMatch = /below-(\d+[mk])/.exec(slug)
  // expressions like 'above-1m'
  const aboveMatch = /above-(\d+[mk])/.exec(slug)

  // get the matches and assign to low and/or high
  if (rangeMatch && rangeMatch.length >= 3) {
    low = rangeMatch[1]
    high = rangeMatch[2]
  } else if (belowMatch && belowMatch.length >= 2) {
    high = belowMatch[1]
  } else if (aboveMatch && aboveMatch.length >= 2) {
    low = aboveMatch[1]
  } else {
    return null
  }

  // translate '100k' to number 100000
  const [lowVal, highVal] = [low, high].map(valueStr => {
    if (!valueStr) return null
    return Number(valueStr.replace('k', '000').replace('m', '000000'))
  })

  return {
    low_price: lowVal,
    high_price: highVal
  }
}
