// @flow
import {toText} from '../bedrooms/utils'

import {createDecodeSlug} from '../../helpers/formatting'

export const filters = ['bathrooms']

export function sidebarText (values: Object) {
  const raw = toText(values.bathrooms)
  return raw && `${raw} bathrooms`
}

export const decodeSlug = createDecodeSlug(/(\d)-bathrooms/, 'bathrooms', '%p')
