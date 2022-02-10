import type {Tag} from '../../helpers/tags.js'

export const getTag: ?Tag = (config: Object) => (listingData: Object) => {
  const baths = Math.round(listingData.bathrooms)
  if (!baths || baths < 2) return null

  return {
    label: `${baths} baths`,
    values: {bathrooms: `${baths}p`}
  }
}
