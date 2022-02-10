
<template>
  <div class="item var--gus-reset-colors var--gus-hover-box-shadow">
    <div class="item__header gus-layer-img">
      <a :href="href">
        <ImageContainer :images="this.listing._source.images" :alt="alt" :_id="`image-${listing._id}`" />
      </a>
      <div class="item__header-caption gus-layer-caption">

          <span class="item__price">{{price}}</span><br />
          <span class="item__stat">{{bed}}</span>
          <span class="item__stat">{{bath}}</span>
          <span class="item__stat">{{sqft}}</span>

        <Heart :mls="listing._id" :address="listing._source.address" />
      </div>
    </div>

    <div class="item__content">
      <a :href="href">
        <img v-if="boardInfo.boardLogoSrcSm" :src="boardInfo.boardLogoSrcSm" :alt="boardInfo.boardLogoSrcAlt" class="item__board-logo" />
        <h3 v-if="listing._source.address" class="item__address">{{listing._source.address}}</h3>
        <h4>
          <span class="item__city-state" v-if="listing._source.city || listing._source.province">
            <span>{{listing._source.city}}</span>
            <span>{{listing._source.province}}</span>
          </span>
          <span class="item__mls">MLS® # {{listing._source.publicId || listing._id}}</span>
        </h4>
        <h4 class="item__co">{{ getCourtesyOf }}</h4>
      </a>
      <Tags :mls="listing._id" :listingData="listing._source" />
    </div>

  </div>
</template>

<script>
import {formatSqft, formatPrice, listingDetailsHref} from '../../../helpers/formatting'
import { courtesyOf } from '../../../../../helpers/listings'
import { getSearchResultAlt } from '@/helpers/listing-cards'
import ImageContainer from './ImageContainer'
import Tags from './Tags'
import Heart from './Heart'

import filters from '@/filters'

export default {
  name: 'item',

  props: ['listing'],

  components: {
    ImageContainer,
    Tags,
    Heart
  },

  computed: {
    bed: function () {
      const num = Math.round(this.listing._source.bedrooms)
      return num ? `${num} bed` : ''
    },

    bath: function () {
      const num = Math.round(this.listing._source.bathrooms)
      return num ? `${num} bath` : ''
    },

    price: function () {
      return filters.listingPrice(this.listing._source.price)
    },

    sqft: function () {
      return formatSqft(this.listing._source.area) || ''
    },

    alt: function () {
      return getSearchResultAlt(this.listing._source)
    },

    href: function () {
      return listingDetailsHref(this.$store.state.config.gus.listingDetailsHref, this.listing._id, this.listing._source.address)
    },

    getCourtesyOf: function () {
      return courtesyOf(this.$store, this.listing._source)
    },

    boardInfo: function () {
      let boardInfo
      try {
        boardInfo = this.$store.state.nag.remoteProfile.listingDetails
      } catch (e) {
        boardInfo = null
      }
      return boardInfo
    }
  },

  metaInfo: function () {
    if (
      !this.listing._source.address ||
      !this.listing._source.location
    ) return {}
    let l = this.listing._source
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

<style scoped lang="sass">
@import '../../../../../assets/sass/variables'

.item
  flex-direction: column
  color: inherit
  border-radius: 3px
  a
    color: inherit !important
  &:hover
    color: inherit
    cursor: default

+with-palette
  .item,
  .item__header
    background-color: var(--#{$palette}-bgColor)
  .item__content
    color: var(--#{$palette}-text)

.item__header
  position: relative

.item__header-caption
  position: absolute
  padding: 1rem
  bottom: 0
  left: 0
  right: 0
  color: white
  line-height: 1
  background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, .5))
  pointer-events: none

.item__price
  font-size: 1.5rem
  font-weight: 700
  vertical-align: sub

.item__stat
  font-size: 0.8rem
  margin-right: 0.5em
  vertical-align: sub

.item__content
  position: relative
  padding: 1rem
  line-height: 1.2
  &::after
    content: ''
    display: block
    position: absolute
    pointer-events: none
    top: 0
    left: 0
    right: 0
    bottom: 0
    border: solid 1px
    border-top: none
    border-radius: 0 0 3px 3px
    opacity: 0.2

.item__board-logo
  float: right

.item__address
  font-weight: 700
  margin-bottom: 0.2rem

.item__city-state
  font-size: 0.85rem

  span:first-child
    &:not(:last-child)
      &:after
        content: ','

.item__mls
  font-size: 0.85rem

.item__co
  margin-top: 0.5rem
  font-size: 0.75rem
  opacity: 0.6
</style>
