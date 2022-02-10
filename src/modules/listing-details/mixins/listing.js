export default {
  inject: ['state', 'actions'],

  computed: {
    listing () {
      return this.state.listing
    },

    tags () {
      const listing = this.listing
      if (listing == null) return []

      if (!listing.facts || !listing.facts.length) return []

      let items = []
      const amenities = listing.facts.find(fact => fact.key.toLowerCase() === 'amenities')
      if (amenities) {
        items = amenities.value.split(',')
      }

      return items
    },

    facts () {
      const listing = this.listing
      if (listing == null) return []

      if (!listing.facts || !listing.facts.length) return []

      const items = []
      listing.facts.forEach(fact => items.push(fact))

      return items
    },

    mobile () {
      return this.state.mobile
    }
  }
}
