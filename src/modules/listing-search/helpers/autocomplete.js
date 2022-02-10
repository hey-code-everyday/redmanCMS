
export const KEYS = ['listing', 'address', 'neighbourhood', 'locality']

export const DEFINITIONS = {
  listing: 'Listings',
  address: 'Addresses',
  neighbourhood: 'Neighbourhoods',
  locality: 'Cities/Towns'
}

export const sort = (results: Array<Object>) => {
  return KEYS.reduce((acc, key) => {
    const value = results.filter(result => result.type === key)
    return value.length
      ? Object.assign({}, acc, {
        [key]: value,
        all: acc.all.concat(value)
      })
      : acc
  }, {
    total: results.length,
    all: []
  })
}
