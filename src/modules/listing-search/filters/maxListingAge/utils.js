export const filters = ['listing_age']

export function numericValue (rawValue: string) {
  if (!rawValue) {
    return 0
  } else {
    return Number(rawValue.match(/now-(\d+)d\/d/)[1])
  }
}

export function rawValue (numericValue: number) {
  return `now-${numericValue}d/d`
}

export function sidebarText (filterValues: Object) {
  const value = numericValue(filterValues.listing_age)
  if (value === 1) {
    return 'Listed today'
  } else if (value) {
    return `Listed less than ${value} days ago`
  }
  return false
}
