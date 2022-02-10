<template>
  <header class="listing-header">
    <div v-show="mobile && listing.price" class="title is-5 var--gus-title price-div">
      {{ listing.price | listingPrice }}
    </div>
    <h1 :class="`title ${mobile ? 'is-5' : 'is-2'} var--gus-title`">
      {{ titleForSale }}
      <span v-if="listing.address && (listing.city || listing.province || postalCode)" class="subtitle">
        {{ address }}
      </span>
    </h1>
    <p class="subtitle">
      <span class="is-soft var--gus-text-soft">&nbsp;MLS® #
        <template v-if="listing.publicId">
          {{ listing.publicId }}
        </template>
        <template v-else>
          {{ listing.id }}
        </template>
      </span>
    </p>
    <Heart v-show="mobile"
      class="listing-heart"
      :mls="listing.id"
      :address="listing.address"
      :dark="true"
    />

    <div v-show="mobile"
      class="listing-calc"
      @click="showCalculator"
    >
      <i class="is-soft icon-calculator2" :style="showCalc ? 'color: var(--default-uiPrimary-bgColor);' : ''"></i>
    </div>

    <transition tag="div"
      name="fade">
      <listing-mortgage-card
        class="mortgage-calculator"
        :listing="listing"
        :forms="forms"
        :theme="theme"
        v-show="mobile && showCalc"
      />
    </transition>

  </header>
</template>

<script>
import Heart from '@/modules/listing-search/components/Results/Item/Heart'
import ListingMortgageCard from 'listing-details@/components/listing/ListingMortgageCard'

export default {
  name: 'ListingHeader',

  components: {
    Heart,
    ListingMortgageCard
  },

  props: {
    listing: { type: Object, required: true },
    forms: { type: Object, required: true },
    theme: { type: String, default: 'default' }
  },

  data() {
    return {
      showCalc: false
    }
  },

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    },
    
    postalCode() {
      if (!this.listing.additionalDetails) return false
      let postalCode = ''
      this.listing.additionalDetails.map(additionalDetail => {
        additionalDetail.details.map(detail => {
          if (Object.keys(detail)[0] === 'Postal Code') {
            postalCode = detail['Postal Code']
          }
        })
      })
      return postalCode === '' ? false : postalCode
    },
    
    address() {
      return `
        ${this.listing.city ? this.listing.city : ''}
        ${this.listing.province ? ', ' + this.listing.province : ''}
        ${this.postalCode ? ', ' + this.postalCode : ''}
      `
    },

    titleForSale() {
      let type = this.listing.building_types
        ? this.listing.building_types[0]
        : ''
      if (type) {
        type = type.replace(/retsrd/gi, "")
        const titleForSale = `${
          this.listing.address ? this.listing.address : this.address
        }, ${type.slice(0, 1).toUpperCase().concat(type.slice(1))} for sale ${
          this.neighbourhood ? ' in ' + this.neighbourhood : ''
        }`
        return titleForSale.replace(/undefined/g, '')
      } else {
        return this.listing.address ? this.listing.address : this.address
      }
    },

    neighbourhood() {
      if (this.listing.neighbourhood) {
        return this.listing.neighbourhood.split('_')[0]
      } else if (this.listing.additionalDetails) {
        const communityInfo = this.listing.additionalDetails.find(
          (a) => a.heading.toLowerCase() === 'community information'
        )
        const neighbourhood =
          communityInfo && communityInfo.details
            ? communityInfo.details.find((a) => a['Neighbourhood/Community'])
            : undefined
        return neighbourhood && neighbourhood['Neighbourhood/Community']
          ? neighbourhood['Neighbourhood/Community'].split('_')[0]
          : undefined
      }
      return undefined
    }
  },

  methods: {
    showCalculator() {
      if (this.showCalc) {
        this.$set(this, 'showCalc', false)
      } else {
        this.$set(this, 'showCalc', true)
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

$listingTransition: all 500ms

.listing-header
  h1
    margin-top: 1rem
    display: grid
  +mobile
    position: sticky
    top: 50px
    z-index: 1
    margin: 10px 0 !important
    padding: 10px 0
    // &:after
    //   left: 0
    //   right: 0
    //   bottom: 0
    //   content: ''
    //   display: block
    //   position: absolute
    //   height: 10px
    //   background: red
    h1,
    .subtitle
      margin: 0
    h1
      font-size: 16px
    .subtitle
      font-size: 16px
    .price-div
      font-size: 16px

.listing-heart
  position: absolute
  right: 0
  top: 3px

.listing-calc
  position: absolute
  right: 0px
  top: -24px
  margin-top: 25px
  font-size: 1.5em
  height: 1.1em
  margin-right: 40px


.fade-enter-active
  transition: all 300ms ease

.fade-leave-active
  transition: all 300ms ease

.fade-enter, .fade-leave-to
  transform: translateY(-10px)
  opacity: 0

+with-palette
  .listing-header
    +mobile
      background: var(--#{$palette}-bgColor)
.price-div
  margin-bottom: 0
</style>
