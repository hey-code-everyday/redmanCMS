<template>
  <div class="listing-card card var--app-card" :class="hasOpenHouse ? 'open-house-outer' : ''">
    <a class="card-link" :href="cardLink"></a>
    <div v-if="hasOpenHouse" class="open-house">
      <div v-if="listing.open_houses" class="inner-lablel">
        {{getDate}} • {{getTime}}
      </div>
    </div>
    <div class="">
      <ImageContainer :images="listing.images" :alt="getHelperAlt" :_id="`image-${listing._id || listing.publicId}`" />
    </div>
    <div class="card-content">
      <p class="courtesy-of" v-if="listing.agent && listing.agent.length">
        {{ getCourtesyOf }}
      </p>
      <div class="columns is-mobile is-gapless">
        <div class="column is-half left-column">
          <div class="content">
            <p class="listing-info" v-if="listing.bathrooms || listing.bedrooms || listing.area">
              <span v-if="listing.bedrooms">{{ listing.bedrooms }} beds</span>
              <span v-if="listing.bathrooms">{{ listing.bathrooms }} baths</span>
              <span v-if="listing.area">{{ Math.round(listing.area) }} sqft</span>
            </p>
            <p class="listing-address" v-if="listing.address">
              {{ listing.address }}
            </p>
            <p v-else class="is-blurred">
              <strong></strong>
            </p>
            <p class="listing-location">
              <span v-if="listing.city">{{ listing.city }}, </span>
              <span v-if="listing.province">{{ listing.province }}</span>
            </p>
            <p class="listing-MLS">
              <span class="is-soft">MLS® #{{ listing.id || listing.publicId }}</span>
            </p>
          </div>
        </div>
        <div class="column right-column">
          <span class="price" v-if="listing.price">
            <strong>{{ listing.price | listingPrice }}</strong>
          </span>
          <div class="listing-favorite">
            <Heart :mls="listing.id || listing.publicId" :address="listing.address" isEDM="true" />
          </div>
        </div>
      </div>
    </div>
    <Tags v-show="hasTags" class="search-tags" :mls="listing.id || listing.publidId" :listingData="listing" />
  </div>
</template>

<script>

import { encodeDetailsUrl, courtesyOf, formatDate, formatTime } from '@/helpers/listings'
import { getSearchResultAlt } from '@/helpers/listing-cards'
import favoriteListingMixin from '@/mixins/favorite-listing'
import Tags from '@/modules/listing-search/components/Results/Item/Tags'
import ImageContainer from '@/modules/listing-search/components/Results/Item/ImageContainer'
import Heart from '@/modules/listing-search/components/Results/Item/Heart'

export default {
  name: 'ListingCardEdm',

  mixins: [favoriteListingMixin],

  props: {
    listing: {
      type: Object,
      required: true
    },
    hasTags: {
      type: Boolean,
      required: false
    },
    hasOpenHouse: {
      type: Boolean,
      required: false
    }
  },

  components: {
    Tags,
    ImageContainer,
    Heart
  },

  computed: {
    cardLink () {
      return encodeDetailsUrl(this.listing)
    },
    getCourtesyOf () {
      return courtesyOf(this.$store, this.listing)
    },
    getHelperAlt () {
      return getSearchResultAlt(this.listing)
    },
    getDate () {
      return formatDate(this.listing)
    },
    getTime () {
      return formatTime(this.listing)
    }
  },
  metaInfo: function () {
    let l = this.listing
    let residenceSchemaType = 'Place'
    l.building_types.forEach(t => {
      if (t === 'house') residenceSchemaType = 'SingleFamilyResidence'
      if (t === 'condo') residenceSchemaType = 'SingleFamilyResidence'
      if (t === 'townhouse') residenceSchemaType = 'SingleFamilyResidence'
    })
    const residenceSchema = {
      '@context': 'http://schema.org',
      '@type': residenceSchemaType,
      'address': {
        '@context': 'http://schema.org',
        "@type": "PostalAddress",
        'streetAddress': l.address,
        'addressLocality': l.city,
        'addressRegion': l.province
      }
    }
    if (l.location && l.location.lat) {
      residenceSchema.geo = {
        '@context': 'http://schema.org',
        '@type': 'GeoCoordinates',
        'latitude': l.location.lat,
        'longitude': l.location.lon
      }
    }
    return {
      script: [{
        innerHTML: JSON.stringify(residenceSchema),
        type: 'application/ld+json'
      }]
    }
  }
}
</script>

<style lang="sass" scoped>
.listing-card
  display: flex
  flex-direction: column
  text-align: left
  font-size: 14px

  p
    margin-bottom: 0px
    max-width: 100%
    line-height: 1.4em

  .columns.is-gapless:not(:last-child)
    margin-bottom: 0

  .card-content
    flex: 1
    padding: 0 1em 1em 1em

  .courtesy-of
    text-align: center
    margin: 5px 0 5px 0
    height: 30px

  .right-column
    text-align: right

    p
      span
        display: inline-block
        margin-right: 5px

    .price
      overflow: hidden
      white-space: nowrap
      font-weight: bold
      line-height: 1.5
      font-size: 22px

  .left-column
    margin-top: 4.5px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis


.card-link
  display: block
  position: absolute
  z-index: 0
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 998

.is-blurred
  strong
    position: relative
    display: inline-block
    width: 75%
    height: 1rem

    &:before
      position: absolute
      z-index: 0
      content: ''
      width: 100%
      height: 100%
      box-shadow: 0 0 0 10px inset
      border-radius: 1px
      opacity: 0.1

    &:after
      position: absolute
      z-index: 1
      content: 'Address Hidden'
      width: 100%
      height: 100%
      font-size: 11px
      text-transform: uppercase
      text-align: center
      font-weight: lighter
      opacity: 0.4

.listing-favorite
  margin-top: 1.15em
  position: relative
  z-index: 999

  a
    pointer-events: auto
    display: block
    height: 32px
    font-size: 28px

.search-tags
  margin: -10px 10px 10px 10px
  pointer-events: auto
  position: relative
  z-index: 999

.listing-location, .listing-address, .listing-info
  overflow: hidden
  text-overflow: ellipsis

.no-results
  text-align: center

.no-results__title
  font-size: 1rem
  font-weight: 700
  margin: 1em 0

.open-house-outer
  margin-top: 10px

  .open-house
    text-align: center
    font-size: 20px
    font-weight: bolder
    color: #fff
    background-color: var(--default-text)

</style>
