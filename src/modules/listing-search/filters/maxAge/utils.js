export const filters = ['construction_age']

export function numericValue (rawValue: string) {
  if (!rawValue) {
    return 0
  } else {
    return Number(rawValue.match(/now-(\d+)y\/d/)[1])
  }
}

export function rawValue (numericValue: number) {
  return `now-${numericValue}y/d`
}

export function sidebarText (filterValues: Object) {
  const value = numericValue(filterValues.construction_age)
  if (value === 1) {
    return 'Less than a year'
  } else if (value) {
    return `Less than ${value} years`
  }
  return false
}
