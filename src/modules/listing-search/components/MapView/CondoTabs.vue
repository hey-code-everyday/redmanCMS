<template>
  <div :class="`condo-tabs${(maxDisplay > 3) ? ' condo-tabs--overflow' : ''}`">
    <ul class="condo-tabs__menu var--gus-primary" role="navigation">

      <li v-for="(listing, i) in listings" :key="listing._id">
        <a v-if="i < maxDisplay" :href="`#condo-container-${listing._id}`" @click="e => onChange(e, listing._id)" :class="`${(activeListingID === listing._id) ? ' highlighted' : ''}`">
          {{listing._source.address}}
        </a>
      </li>
      <a v-if="numMore > 0" href="#condo-container-more" @click="seeAll" class="condo-tabs__see-all">See {{numMore}} more ...</a>

    </ul>

    <div v-for="listing in listings" class="condo-tabs__item-container" :id="`condo-container-${listing._id}`" :aria-hidden="activeListingID !== listing._id">
      <Item v-if="!isEREB" :listing="listing" />
      <listing-card-edm v-if="isEREB" :listing="listing._source" />
    </div>

  </div>
</template>

<script>
import Item from '../Results/Item'
import ListingCardEdm from '@/components/ListingCardEDM'

export default {
  components: {
    Item,
    ListingCardEdm
  },

  props: ['listings'],

  data: function () {
    return {
      maxDisplay: 3,
      activeListingID: this.listings[0]._id
    }
  },

  computed: {
    numMore: function () {
      return this.listings.length - this.maxDisplay
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  methods: {
    onChange: function (e, id) {
      e.preventDefault()
      e.stopPropagation()
      this.activeListingID = id
      return false
    },

    seeAll: function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.maxDisplay = this.listings.length
      return false
    }
  }
}

</script>

<style scoped lang="sass">

.condo-tabs
  background: white

.condo-tabs__menu
  padding: 0
  li a
    padding: 0.25em 0.8em
    width: 100%
    display: inline-block
    color: inherit
    &.highlighted
      background-color: rgba(10, 10, 10, 0.1)
      color: inherit

.condo-tabs__see-all
  padding: 0.25em 0.8em

.condo-tabs__item-container[aria-hidden]
  display: none

.condo-tabs--overflow .condo-tabs__menu
  max-height: 110px
  overflow-y: scroll



</style>
