<template>
  <div>
    <div itemscope itemtype="http://schema.org/Residence">
      <meta v-if="listing.address" itemprop="address" :content="`${listing.address}, ${listing.city}`">
      <meta v-if="listing.description" itemprop="description" :content="listing.description">
      <meta v-if="listing.images && listing.images.length > 0" itemprop="photo" :content="listing.images[0]">
      <div v-if="listing.location && listing.location.lon" itemprop="geo" itemscope itemtype="http://schema.org/GeoCoordinates">
        <meta itemprop="latitude" :content="listing.location.lon" />
        <meta itemprop="longitude" :content="listing.location.lat" />
      </div>
    </div>

    <div itemscope itemtype="http://schema.org/Offer">
      <meta itemprop="serialNumber" :content="listing.id" />
      <meta v-if="price" itemprop="price" :content="price" />
    </div>
  </div>
</template>

<script>
import filters from '@/filters'

export default {
  props: {
    listing: {
      type: Object,
      required: true
    }
  },

  computed: {
    price () {
      if (!this.listing || !this.listing.price) return ''
      return '$' + filters.price(this.listing.price)
    }
  }
}
</script>
