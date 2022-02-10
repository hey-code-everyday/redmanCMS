<template>
  <lazy-component>
    <div class="listing-card card var--app-card">
      <a class="card-link" :href="cardLink"></a>
      <div class="card-image">
        <div class="title sold-listing__banner">
          SOLD
        </div>
        <ImageContainer :images="listing.photos.map(row => row.url)" :alt="getHelperAlt" :_id="`image-${listing.mlsNum}`" />
        <div class="overlay is-fg">
          <div class="overlay-inner">
            <div>
              <h4 v-if="listing.soldPrice">
                {{ listing.soldPrice | listingPrice }}
              </h4>
              <p v-if="listing.bathsTotalDecimal || listing.bedrooms || listing.area">
                <span v-if="listing.bedrooms">{{ listing.bedrooms }} beds</span>
                <span v-if="listing.bathsTotalDecimal">{{ listing.bathsTotalDecimal }} baths</span>
                <span v-if="listing.squareFeet">{{ Math.round(listing.squareFeet) }} sqft</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <p v-if="listing.streetAddress">
            <strong>{{ listing.streetAddress }}</strong>
          </p>
          <p v-else class="is-blurred">
            <strong></strong>
          </p>
          <p>
            <span v-if="listing.city">{{ listing.city }}, </span>
            <span v-if="listing.state">{{ listing.state }}</span>
            <span class="is-soft">MLS® #{{ listing.mlsNum }}</span>
          </p>
          <p class="is-soft is-co" v-if="listing.listOfficeName && listing.listOfficeId">
            {{ getCourtesyOf }}
          </p>
        </div>
      </div>
    </div>
  </lazy-component>
</template>

<script>

import { encodeSoldDetailsUrl, courtesyOfSold } from '@/helpers/listings'
import { getSoldAlt } from '@/helpers/listing-cards'
import ImageContainer from '@/modules/listing-search/components/Results/Item/ImageContainer'


export default {
  name: 'ListingCardSold',

  components: {
    ImageContainer
  },

  props: {
    listing: {
      type: Object,
      required: true
    }
  },


  computed: {
    cardLink () {
      return encodeSoldDetailsUrl(this.listing)
    },
    primaryColor () {
      return '#fff'
    },
    getCourtesyOf () {
      return courtesyOfSold(this.$store, this.listing)
    },
    getHelperAlt () {
      return getSoldAlt(this.listing)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/_all'
@import '../assets/sass/variables'

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

.sold-listing__banner
  user-select: none
  position: absolute
  z-index: 12
  box-shadow: 0px 0px 5px 3px #ffffff4d
  text-shadow: 0px 0px 5px white
  border: none
  background: #d10a53
  left: 0
  +mobile
    padding: 0.1rem 0.1rem 0.1rem 0.5rem
    top: 0.7rem
    width: 60px
    font-size: 15px
    border-radius: 0 5px 5px 0
  +tablet
    padding: 0.2rem 0.2rem 0.2rem 0.5rem
    top: 0.7rem
    width: 60px
    font-size: 15px
    border-radius: 0 8px 8px 0
  +desktop
    padding: 0.3rem 0.3rem 0.3rem 0.7rem
    top: 1rem
    width: 80px
    font-size: 20px
    border-radius: 0 10px 10px 0
  +widescreen
    padding: 0.3rem 0.3rem 0.3rem 0.7rem
    top: 1rem
    width: 80px
    font-size: 20px
    border-radius: 0 10px 10px 0
</style>
