<template>
  <div class="strap-latest-listings__listings-inner">
    <div class="is-listings">
      <!-- Error -->
      <template v-if="error">
        <div class="strap-latest-listings__error">
          <empty-card :key="-1" class="listing-card error-card">
            <h5 class="title is-5">
              Sorry, there was a problem loading listings. <br />
              Please try again later.
            </h5>
          </empty-card>
        </div>
      </template>

      <!-- Loading -->
      <template v-else-if="loading">
        <div class="strap-latest-listings__loading" :style="{ color: strapPalette.text }">
          <span class="loader" :style="{ borderLeftColor: strapPalette.text, borderBottomColor: strapPalette.text }"></span><br />
          Loading...
        </div>
      </template>

      <template v-else>
        <transition-group name="listing" class="strap-latest-listings__listings" :style="error ? 'justify-content: center' : ''" tag="div">
          <template v-if="listings && filteredListings.length && !isEREB">
            <listing-card
              v-for="(l, i) in filteredListings"
              :key="l.id"
              :listing="l"
              class="listing-card"
            />
          </template>
          <template v-else-if="listings && filteredListings.length && isEREB">
            <listing-card-edm
              v-for="(l, i) in filteredListings"
              :key="l.id"
              :listing="l"
              class="listing-card"
            />
          </template>
          <template v-else>
            <empty-card
              :key="-1"
              href="/search"
              class="listing-card empty-card"
            >
              <h5 class="title is-5">
                No Listings Available
              </h5>
              <p>
                Can't find what you're looking for? <br/>
                <a href="/search">Search for listings</a>
              </p>
            </empty-card>
          </template>
        </transition-group>
      </template>
    </div>
  </div>
</template>

<script>
// import api from '@/api'
import EmptyCard from '@/components/EmptyCard'
import ListingCard from '@/components/ListingCard'
import ListingCardEdm from '@/components/ListingCardEDM'

export default {
  name: 'ListingSlide',

  components: {
    EmptyCard,
    ListingCard,
    ListingCardEdm,
  },

  props: {
    listings: {
      type: Array,
      required: true
    },
    strapPalette: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true,
      default: true
    },
    error: {
      type: Boolean,
      required: true,
      default: false
    },
    currentIndex: {
      type: Number,
      required: true
    }
  },

  computed: {
    filteredListings () {
      return this.listings.slice(this.currentIndex)
      //return []
    },

    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  }
}

</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

$listingTransition: all 500ms
$listingTransform: translateX(calc(-100% - 2rem))

.strap-latest-listings__listings-inner
  width: 100%
  padding-top: 0
  padding-right: 0
  padding-bottom: 0

.strap-latest-listings__listings
  position: relative
  display: flex
  white-space: nowrap

.listing-card
  display: inline-flex !important
  height: 100%
  white-space: normal
  min-width: 335px
  max-width: 335px
  height: 360px
  margin-right: 2rem
  transition: $listingTransition

.listing-card.empty-card
  margin-right: 0px

.strap-latest-listings__loading
  padding: 50px
  text-align: center
  opactiy: 0.6

.loader
  +loader
  opactiy: 0.6
  display: inline-block
  width: 3rem
  height: 3rem
  margin-bottom: 1rem
  border-left-color: $wsBorder
  border-bottom-color: $wsBorder

.listing-leave-active
  position: absolute

  // + .listing-card
  //   transition: $listingTransition

  //   + .listing-card
  //     transition: $listingTransition

  //     + .listing-card
  //       transition: $listingTransition

  //       + .listing-card
  //         transition: $listingTransition

  //         + .listing-card
  //           transition: $listingTransition

.listing-enter,
.listing-leave-to
  opacity: 0
  transform: scale(0.9)

  // + .listing-card
  //   transform: $listingTransform

  //   + .listing-card
  //     transform: $listingTransform

  //     + .listing-card
  //       transform: $listingTransform

  //       + .listing-card
  //         transform: $listingTransform

  //         + .listing-card
  //           transform: $listingTransform

.listing-move
  transition: $listingTransition

.empty-card,
.error-card
  /deep/
    .content
      text-align: center
      white-space: normal
      overflow: visible
      text-overflow: visible
      height: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center


</style>
