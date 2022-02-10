import {formatSqft} from '../../helpers/formatting'

export const filters = ['interior_size']

export function numericValue (rawValue: string | number) {
  if (!rawValue) {
    return 0
  } else {
    return Number(rawValue.match(/(\d+)p/)[1])
  }
}

export function sidebarText (filterValues: Object) {
  const value = numericValue(filterValues.interior_size)
  return formatSqft(value)
}
