const slugs = [
  { name: 'access', slug: 'access' },
  { name: 'privacy', slug: 'privacy-policy' },
  { name: 'disclaimer', slug: 'disclaimer' }
]

export default {
  get slugs () {
    return slugs.map(item => item.slug)
  },

  get all () {
    const all = slugs.reduce((acc, item) => {
      acc[item.name] = item.slug
      return acc
    }, {})
    return all
  },

  isInternal (slug) {
    const result = slugs.find(item => item.slug === slug)
    return result !== undefined
  }
}
