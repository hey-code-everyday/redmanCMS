<template>
  <div class="item card">
    <header :class="mapMode ? 'item__header top-0' : 'item__header'">
      <h3 v-if="listing._source.address" class="item__title">
        <strong>{{ listing._source.address }}</strong>
      </h3>
      <p class="item__subtitle">
        <span v-if="listing._source.city">{{ listing._source.city }}</span>
        <span v-if="listing._source.province">{{ listing._source.province }}</span>
        <span>MLS® # {{ listing._source.publicId || listing._id }}</span>
      </p>
      <div class="item__heart">
        <Heart :mls="listing._id" :address="listing._source.address" :dark="true" />
      </div>
      <a :href="href" class="item__link"></a>
    </header>

    <div class="item__image">
      <ImageContainer :images="this.listing._source.images" :alt="alt" :_id="`image-${listing._id}`" />
      <a :href="href" class="item__link"></a>
    </div>

    <div class="item__description">
      <a :href="href" class="item__link"></a>
      <div class="item__stats">
        <strong class="item__stat" v-if="price">{{ price }}</strong>
      </div>
      <div class="item__stats">
        <span class="item__stat" v-if="bed">{{ bed }}</span>
        <span class="item__stat" v-if="bath">{{ bath }}</span>
        <span class="item__stat" v-if="sqft">{{ sqft }}</span>
      </div>
    </div>

    <div class="item__co">
      {{ courtesyOf }}
    </div>
  </div>
</template>

<script>
import {formatSqft, formatPrice, listingDetailsHref} from '../../../helpers/formatting'
import { getSearchResultAlt } from '@/helpers/listing-cards'
import ImageContainer from './ImageContainer'
import Tags from './Tags'
import Heart from './Heart'

export default {
  name: 'item',

  props: ['listing', 'mapMode'],

  components: {
    ImageContainer,
    Tags,
    Heart
  },

  computed: {
    bed () {
      const num = Math.round(this.listing._source.bedrooms)
      return num ? `${num} bed` : ''
    },

    bath () {
      const num = Math.round(this.listing._source.bathrooms)
      return num ? `${num} bath` : ''
    },

    price () {
      return formatPrice(this.listing._source.price) || ''
    },

    sqft () {
      return formatSqft(this.listing._source.area) || ''
    },

    alt () {
      return getSearchResultAlt(this.listing._source)
    },

    href () {
      return listingDetailsHref(this.$store.state.config.gus.listingDetailsHref, this.listing._id, this.listing._source.address)
    },

    courtesyOf () {
      const agent = this.listing._source.agent[0]
      if (!agent) return false

      return `C/O ${agent.name}, ${agent.office}`
    },

    boardInfo () {
      let boardInfo
      try {
        boardInfo = this.$store.state.nag.remoteProfile.listingDetails
      } catch (e) {
        boardInfo = null
      }
      return boardInfo
    }
  },

  metaInfo () {
    if (
      !this.listing._source.address ||
      !this.listing._source.location
    ) return {}

    const content = `{
      "@context": "http://schema.org",
      "@type": "SingleFamilyResidence",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": ${this.listing._source.location.lat},
        "longitude": ${this.listing._source.location.lon}
      },
      "address": "${this.listing._source.address}"
    }`
    return {
      script: [
        {innerHTML: content, type: 'application/ld+json'}
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../../../../assets/sass/variables'

.item
  color: inherit
  font-size: 16px
  line-height: 1.3
  flex-direction: column
  a
    color: inherit !important
  &:hover
    color: inherit
    cursor: default

+with-palette
  .item,
  .item__header
    background-color: var(--#{$palette}-bgColor)

.rm-dark-website
  .item
    box-shadow: 0 0 0 1px rgba(245,245,245,0.2);

.item__link
  position: absolute
  display: block
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 15

.top-0
  top: 0 !important

.item__header
  top: 50px
  z-index: 2
  display: flex
  padding: 10px
  position: sticky
  min-height: 54px
  flex-direction: column
  justify-content: center
  background-color: #fff
  p,
  h3
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
  .item__link
    right: 58px

.item__heart
  display: flex
  align-items: center
  top: 0
  right: 10px
  bottom: 0
  position: absolute

.item__subtitle
  opacity: 0.5
  font-size: 16px
  span
    &:not(:last-child):after
      content: ','

.item__image
  width: calc(100% - 20px)
  margin: 0 10px
  border-radius: 3px
  overflow: hidden
  position: relative
  z-index: 1

.item__description
  display: flex
  padding: 10px 10px 5px 10px
  position: relative
  z-index: 1
  .item__link
    bottom: -24px

.item__stats
  &:last-child:not(:only-child)
    margin-left: auto

.item__stat
  &:not(:last-child):after
    content: ' · '

.item__co
  opacity: 0.5
  overflow: hidden
  font-size: 16px
  white-space: nowrap
  text-overflow: ellipsis
  padding: 0 10px 10px 10px
  position: relative
  z-index: 1
</style>
