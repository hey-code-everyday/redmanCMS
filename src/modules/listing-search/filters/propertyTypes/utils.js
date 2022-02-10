// @flow

type allowedPropertyTypes = 'house' | 'condo' | 'townhouse' | 'land' | 'rural' | 'commercial' | 'investment'

export const definitions = {
  house: 'House',
  condo: 'Condo',
  townhouse: 'Townhouse',
  land: 'Land',
  commercial: 'Commercial',
  rural: 'Rural',
  mobile: 'Mobile',
  investment: 'Investment'
}

export const filters = ['property_types']

export function commaList (items: Array<string>) {
  if (items.length === 1) {
    return items[0]
  } else if (items.length === 2) {
    return `${items[0]} & ${items[1]}`
  } else {
    const [head, ...tail] = items
    return `${head}, ${commaList(tail)}`
  }
}

export function toText (propertyTypes: Array<allowedPropertyTypes>) {
  if (!propertyTypes || !propertyTypes.length) {
    return false
  }
  const labels = propertyTypes.map((propertyType, i) =>
    i ? definitions[propertyType].toLowerCase() : definitions[propertyType]
  )
  return commaList(labels)
}

export function sidebarText (values: Object) {
  const propertyTypes = values.property_types && values.property_types.split('|')
  return toText(propertyTypes)
}

export function decodeSlug (slug: string) {
  const slugParts = slug.split('-')
  const matchedTypes = Object.keys(definitions).filter(propertyType =>
    slugParts.indexOf(propertyType) !== -1
  )
  if (matchedTypes.length === 0) return null
  return {property_types: matchedTypes.join('|')}
}
