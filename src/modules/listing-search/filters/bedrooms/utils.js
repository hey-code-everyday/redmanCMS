// @flow

import {createDecodeSlug} from '../../helpers/formatting'

export const filters = ['bedrooms']

export function toText (bedrooms: string) {
  const match = bedrooms && bedrooms.match(/(\d+)p/)
  if (!bedrooms || bedrooms === '1p') {
    return false
  } else if (match) {
    return match[1]
  } else {
    throw new Error('Invalid value for bedrooms')
  }
}

export function panelText (bedrooms: string) {
  const raw = toText(bedrooms)
  return raw ? `At least ${raw}` : 'Any amount'
}

export function sidebarText (values: Object) {
  const raw = toText(values.bedrooms)
  return raw && `${raw} bedrooms`
}

export const decodeSlug = createDecodeSlug(/(\d)-bedrooms/, 'bedrooms', '%p')
