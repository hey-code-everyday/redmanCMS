import type {Tag} from '../../helpers/tags.js'
import type {allowedPropertyTypes} from './utils'
import {definitions} from './utils'

// find the first propertyType that is mentioned in the configuration object
export const selectPropertyType: ?allowedPropertyTypes = (propertyTypes: Array<allowedPropertyTypes>, configPropertyTypes: Array<allowedPropertyTypes>) => {
  return propertyTypes.reduce((acc, propertyType) => {
    return configPropertyTypes.indexOf(propertyType) !== -1 ? propertyType : null
  }, null)
}

export const getTag: ?Tag = (config: Object) => (listingData: Object) => {
  const propertyType = selectPropertyType(listingData.building_types, config.types)
  if (!propertyType) return null

  return {
    label: definitions[propertyType],
    values: {property_types: propertyType}
  }
}
