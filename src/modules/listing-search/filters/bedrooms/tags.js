import type {Tag} from '../../helpers/tags.js'

export const getTag: ?Tag = (config: Object) => (listingData: Object) => {
  const beds = listingData.bedrooms
  if (!beds || beds < 2) return null

  return {
    label: `${beds} beds`,
    values: {bedrooms: `${beds}p`}
  }
}
