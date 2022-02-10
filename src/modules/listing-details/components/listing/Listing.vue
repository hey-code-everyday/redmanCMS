<template>
  <div class="listing-details var--gus-panel" ref="container">

    <!-- Navigation -->
    <ListingNav />

    <div class="columns">
      <div class="column">

        <!-- Nag Bar -->
        <!-- <NagBar v-if="process.browser" /> -->

        <!-- Header -->
        <ListingHeader />

        <!-- Bed, bath, size -->
        <ListingIcons />

        <!-- Ammenities -->
        <ListingAmenities v-if="state.listing.facts" />

        <!-- <Redform :formID="state.config.redforms.moreInfo" :spaceID="state.config.spaceID" />
        <Redform :formID="state.config.redforms.requestShowing" :spaceID="state.config.spaceID" /> -->

        <!-- Description -->
        <ListingDescription />

        <!-- Key details -->
        <ListingTable v-if="state.listing.facts" />

        <!-- Disclaimer -->
        <p class="disclaimer" v-if="state.nag && state.nag.remoteProfile && state.nag.remoteProfile.listingDetails && state.nag.remoteProfile.listingDetails.listingDetailsDisclaimer">
          {{ state.nag.remoteProfile.listingDetails.listingDetailsDisclaimer }}
        </p>

      </div>
      <div class="column is-one-third">

        <!-- Side panel -->
        <ListingActionCard :container="container" />

      </div>
    </div>
  </div>
</template>

<script>
// Components
import ListingNav from 'listing-details@/components/Listing/ListingNav'
import ListingIcons from 'listing-details@/components/Listing/ListingIcons'
import ListingTable from 'listing-details@/components/Listing/ListingTable'
import ListingHeader from 'listing-details@/components/Listing/ListingHeader'
import ListingAmenities from 'listing-details@/components/Listing/ListingAmenities'
import ListingActionCard from 'listing-details@/components/Listing/ListingActionCard'
import ListingDescription from 'listing-details@/components/Listing/ListingDescription'
import Redform from 'listing-details@/components/Redform'

export default {
  name: 'listing',

  inject: ['state'],

  data () {
    return {
      ready: false,
      container: null,
      msg: 'Welcome to Your Vue.js App'
    }
  },

  mounted () {
    this.container = this.$refs.container
    this.ready = true
  },

  components: {
    // NagBar: () => import(/* webpackChunkName: "nag-bar" */ '@/modules/nags/components/NagBar.vue'),
    ListingNav,
    ListingIcons,
    ListingTable,
    ListingHeader,
    ListingAmenities,
    ListingActionCard,
    ListingDescription,
    Redform
  },

  computed: {
    process () {
      return process
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-details
  position: relative
  display: flex
  flex-direction: column
  width: 100%
  +mobile
    padding-bottom: 90px
  p,
  .label,
  .title,
  .content,
  .subtitle
    color: inherit
  .listing-container
    margin-bottom: 2.5rem !important
  .columns
    padding-top: 50px
    +mobile
      padding-top: 0

.disclaimer
  opacity: 0.6
  font-size: 11px
  margin-top: 5rem
</style>
