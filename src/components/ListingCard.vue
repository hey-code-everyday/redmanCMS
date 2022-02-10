<template>
  <lazy-component>
    <div class="listing-card card var--app-card">
      <a class="card-link" :href="cardLink"></a>
      <div class="card-image">
        <div class="listing-favorite">
          <Heart :mls="listing.id || listing.publicId" :address="listing.address" />
        </div>
        <ImageContainer :images="listing.images" :alt="getHelperAlt" :_id="`image-${listing.id || listing.publicId}`" />
        <div class="overlay is-fg">
          <div class="overlay-inner">
            <div>
              <h4 v-if="listing.price">
                {{ listing.price | listingPrice }}
              </h4>
              <p v-if="listing.bathrooms || listing.bedrooms || listing.area">
                <span v-if="listing.bedrooms">{{ listing.bedrooms }} beds</span>
                <span v-if="listing.bathrooms">{{ listing.bathrooms }} baths</span>
                <span v-if="listing.area">{{ Math.round(listing.area) }} sqft</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <p v-if="listing.address">
            <strong>{{ listing.address }}</strong>
          </p>
          <p v-else class="is-blurred">
            <strong></strong>
          </p>
          <p>
            <span v-if="listing.city">{{ listing.city }}, </span>
            <span v-if="listing.province">{{ listing.province }}</span>
            <span class="is-soft">MLS® #{{ listing.id }}</span>
          </p>
          <p class="is-soft is-co" v-if="listing.agent && listing.agent.length">
            {{ getCourtesyOf }}
          </p>
        </div>
      </div>
    </div>
  </lazy-component>
</template>

<script>

import { encodeDetailsUrl, courtesyOf } from '@/helpers/listings'
import { getAlt } from '@/helpers/listing-cards'
import ImageContainer from '@/modules/listing-search/components/Results/Item/ImageContainer'
import Heart from '@/modules/listing-search/components/Results/Item/Heart'


export default {
  name: 'ListingCard',

  components: {
    ImageContainer,
    Heart
  },

  props: {
    listing: {
      type: Object,
      required: true
    }
  },


  computed: {
    cardLink () {
      return encodeDetailsUrl(this.listing)
    },
    primaryColor () {
      return '#fff'
    },
    getCourtesyOf () {
      return courtesyOf(this.$store, this.listing)
    },
    getHelperAlt () {
      return getAlt(this.listing)
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
  height: 330px

  strong
    font-size: 16px

  p
    margin-bottom: 0
    white-space: nowrap
    max-width: 100%
    text-overflow: ellipsis
    overflow: hidden

    &.is-co
      font-size: 12px

  .card-content
    flex: 1

.card-link
  display: block
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 12

.card-image
  position: relative
  pointer-events: none
  background-color: #333
  overflow: hidden

  .overlay
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

    &.is-fg
      color: #fff
      z-index: 11
      padding: 20px
      text-shadow: 0 0 1px rgba(#000, 0.6)
      display: flex
      justify-content: flex-start
      align-items: flex-end
      background-size: 100% 100%
      background-image: linear-gradient(180deg, rgba(#303841, 0) 0%, rgba(#303841, 0) 60%, rgba(#303841, 0.4) 100%)

      h4
        font-weight: bold
        font-size: 1.5rem
        margin-bottom: 0
        line-height: 1.1

      p
        span
          display: inline-block
          margin-right: 5px

.is-blurred
  strong
    position: relative
    display: inline-block
    width: 50%
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
  position: absolute
  bottom: 1.5rem
  right: 1.5rem
  color: #fff
  z-index: 13

  a
    pointer-events: auto
    display: block
    height: 32px
    font-size: 28px
</style>
