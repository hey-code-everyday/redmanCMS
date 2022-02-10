<template>
  <div class="listing-amenities">
    <span class="tag" v-for="tag in tags"><span class='var--gus-link'>{{ tag }}</span></span>
  </div>
</template>

<script>
export default {
  name: 'ListingAmenities',

  props: {
    listing: { type: Object, required: true }
  },

  computed: {
    mobile () {
      return window.innerWidth < 1024
    },

    tags () {
      const listing = this.listing
      if (listing == null) return []

      if (!listing.facts || !listing.facts.length) return []

      let items = []
      const amenities = listing.facts.find(fact => fact.key.toLowerCase() === 'amenities')
      if (amenities && amenities.value) {
        items = amenities.value.split(',')
      }

      return items
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-amenities
  .tag,
  .link
    display: inline-flex
    margin: 4px 6px 4px 0

    +mobile
      margin: 4px 4px 4px 0

  .tag
    position: relative
    background-color: transparent

    span
      text-decoration: none
      max-width: 200px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      display: block

    &:after
      position: absolute
      content: ''
      top: 0
      left: 0
      right: 0
      bottom: 0
      border: solid 1px
      border-radius: 100px
      opacity: 0.3

  .link
    font-size: 0.75rem
    text-decoration: underline

</style>
