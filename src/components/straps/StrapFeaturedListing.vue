<template>
  <div class="strap-latest-listings is-aligned-left">
    <div class="strap-container container pad-medium">
      <header class='strap-header content is-main is-hidden-mobile'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <!-- Error -->
      <template v-if="error">
        <div class="strap-latest-listings__error">
          Sorry, there was a problem loading the listing. <br />
          Please try again later.
        </div>
      </template>

      <!-- Loading -->
      <template v-else-if="loading">
        <div class="strap-latest-listings__loading" :style="{ color: strap_palette.text }">
          <span class="loader" :style="{ borderLeftColor: strap_palette.text, borderBottomColor: strap_palette.text }"></span><br />
          Loading...
        </div>
      </template>

      <div v-else-if="listing" class="columns">
        <div class="column is-7 is-image">
          <div class="strap-latest-listings__listings-inner pad-medium trim-tb">
            <div class="strap-latest-listings__listings">
              <img v-if="listing.images && listing.images.length" :src="listing.images[0]" />
              <span v-else class="no-image">Image Not Available</span>
              <br/>
              <span v-if="listing.agent && listing.agent.length && isEREB">
                {{ getCourtesyOf }}
              </span>
            </div>
          </div>
        </div>
        <div class="column is-5 is-content">
          <header class='strap-header content'>
            <h3 class="title is-title">
              <template v-if="listing.address">
                {{ listing.address }}
              </template>
              <template v-else>
                <span v-if="listing.city">{{ listing.city }}, </span>
                <span v-if="listing.province">{{ listing.province }}</span>
              </template>
            </h3>
            <p class="subtitle">
              <template v-if="listing.address">
                <span v-if="listing.city">{{ listing.city }}, </span>
                <span v-if="listing.province">{{ listing.province }}</span>
              </template>
              <span class="is-soft">MLS # {{ listing.publicId }}</span>
            </p>
            <p class="is-soft is-co" v-if="listing.agent && listing.agent.length && !isEREB">
              {{ getCourtesyOf }}
            </p>
          </header>
          <div class='strap-content content'>
            <p v-if="listing.bathrooms || listing.bedrooms || listing.area" class="level">
              <span class="level-item" v-if="listing.price">
                <strong>{{ listing.price | listingPrice }}</strong>
              </span>
              <span class="level-item" v-if="listing.bedrooms">
                <span class="icon"><i class="icon-bed"></i></span>
                <span>{{ listing.bedrooms }} beds</span>
              </span>
              <span class="level-item" v-if="listing.bathrooms">
                <span class="icon"><i class="icon-bathtub"></i></span>
                <span>{{ listing.bathrooms }} baths</span>
              </span>
              <span class="level-item" v-if="listing.area">
                <span class="icon"><i class="icon-rulers"></i></span>
                <span>{{ Math.round(listing.area) }} sqft</span>
              </span>
            </p>
            <p>
              {{ description }}
            </p>
            <a :href="detailsUrl" class="button strap-button is-primary">
              <span>View Listing</span>
            </a>
          </div>
        </div>
      </div>

      <div v-else>
        Listing not found.
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import mixinStrap from '@/mixins/strap'
import { courtesyOf } from '@/helpers/listings'

import EditableTitle from '@/components/editable/EditableTitle'
import defaultTitle from '@/store/defaults/components/title'

import {
  mapListings,
  encodeDetailsUrl,
  prefetchListings,
  preconfiguredOptions
} from '@/helpers/listings'

function fetchListing (store, mls, done, error) {
  api.getListings(store.state, [mls]).then(response => {
    const result = mapListings(response)
    done({ listings: result, search: false })
  }).catch(err => {
    error(err)
  })
}

export default {
  name: 'StrapFeaturedListing',

  components: {
    EditableTitle
  },

  mixins: [mixinStrap],

  prefetch (resolve, reject, store, state) {
    const { mls } = state.state

    if (mls) fetchListing(store, mls, resolve, reject)
    else prefetchListings(resolve, reject, store, state, { size: 1 })
  },

  afterPrefetch (err, result) {
    if (err) {
      this.loading = false
      this.$set(this, 'error', err)

      console.warn(err)
      return
    }

    const search = result.search
    const listings = result.listings

    this.loading = false
    this.$set(this, 'listing', listings[0])
    this.$set(this, 'preconfiguredSearch', search || {})
  },

  data () {
    return {
      error: false,
      loading: true,
      listing: { empty: true },
      preconfiguredSearch: {}
    }
  },

  computed: {
    description () {
      const { description } = this.listing
      if (!description) return ''

      return description.slice(0, 280) + (description.length > 280 ? '...' : '')
    },

    detailsUrl () {
      return encodeDetailsUrl(this.listing)
    },

    getCourtesyOf: function () {
      return courtesyOf(this.$store, this.listing)
    },

    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  methods: {
    fetchData () {
      if (!this.$store.getters.authenticated) return

      const { mls } = this.strap_state

      let filters = {
        size: 1,
        from: 0
      }

      this.loading = true
      this.listing = { empty: true }

      if (mls) this.fetchListing()
      else this.fetchSearch(filters)
    },

    fetchSearch (filters) {
      new Promise((resolve, reject) => {
        prefetchListings(resolve, reject, this.$store, this.strap_state, filters)
      }).then(result => {
        const listings = result.listings
        const search = result.search

        if (listings.length === 0) {
          const err = new Error('Listing not found.')
          console.warn(err)

          this.loading = false
          this.$set(this, 'error', err)

          return
        }

        this.loading = false
        this.$set(this, 'error', false)
        this.$set(this, 'listing', listings[0])
        this.$set(this, 'preconfiguredSearch', search || {})
      }).catch(err => {
        console.warn(err)

        this.loading = false
        this.$set(this, 'error', err)
      })
    },

    fetchListing () {
      const { mls } = this.strap_state

      fetchListing(this.$store, mls, result => {}, err => {
        console.warn(err)
      })
    }
  },

  mounted () {
    if (this.listing.empty) this.fetchData()
  },

  watch: {
    strap_state () {
      this.fetchData()
    }
  },

  initialState (strap, state) {
    return {
      mls: '',
      source: 'gus',
      title: defaultTitle({ html: 'Featured Listing' }),
      useRealtorListings: false,
      centerSearch: false,
      predefinedSearch: '',
      useAdvancedSetup: false,
      advancedSetup: ''
    }
  },

  schema () {
    return [
      {
        title: 'Featured Listing',
        tabs: [
          {
            title: 'Setup',
            fields: [
              {
                key: 'state.mls',
                type: 'text',
                label: 'Listing MLS',
                default: '',
                hint: 'Leave blank to show the newest listing in your feed.'
              },
              {
                key: 'state.predefinedSearch',
                type: 'dropdown',
                label: 'Preconfigured Search',
                default: 'slide',
                hint: 'Display results from a preconfigured search',
                options () {
                  return preconfiguredOptions.call(this)
                }
              },
              {
                key: 'state.centerSearch',
                type: 'checkbox',
                label: 'Local Listings',
                text: 'Only show results from within my area',
                default: true,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.useRealtorListings',
                type: 'checkbox',
                label: 'Realtor Listings',
                text: 'Only display listings posted by the Realtor',
                default: false,
                onValue: true,
                offValue: false
              }
            ]
          }
        ]
      },
      {
        title: 'Advanced Setup',
        tabs: [
          {
            title: 'Listings Setup',
            initial: true,
            fields: [
              {
                key: 'state.useAdvancedSetup',
                type: 'checkbox',
                label: 'Use Advanced Setup',
                text: 'Override the listings setup with my custom filters',
                default: false,
                onValue: true,
                offValue: false,
                hidden: true
              },
              {
                key: 'state.advancedSetup',
                type: 'multiText',
                label: 'Advanced Setup',
                default: '',
                hint: 'JSON object that represents the search filters.',
                hidden: true
              }
            ]
          }
        ]
      }
    ]
  },

  migrations (strap, state) {
    return [
      {
        useRealtorListings: false,
        centerSearch: false
      }, // Issue #40
      {
        predefinedSearch: ''
      }, // Issue #73
      {
        useAdvancedSetup: false,
        advancedSetup: ''
      } // Issue #127
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-header
  &.is-main
    margin-bottom: 2rem

.strap-latest-listings
  position: relative
  min-height: 500px

.strap-latest-listings__listings-outer
  position: absolute
  z-index: 1
  top: 0
  right: 0
  bottom: 0
  width: calc(66% - 100px)

.strap-latest-listings__listings-inner
  position: relative
  width: 100%
  padding-left: 0

+mobile
  .strap-latest-listings__listings-inner
    padding: 0
    width: 100vw
    margin-left: -2.5rem

  .strap-container
    padding-top: 0

.columns
  position: relative
  z-index: 0

.column
  &.is-content
    text-align: left

  &.is-image

.level
  font-size: 16px

.level-item
  text-align: left
  justify-content: flex-start
  align-items: center
  vertical-align: middle

  .icon
    display: inline-block
    opacity: 0.6

.strap-latest-listings__listings
  position: relative
  white-space: nowrap

p.is-co
  margin-top: -1rem
  font-size: 14px

.listing-card
  display: inline-flex !important
  height: 100%
  white-space: normal
  width: 350px
  margin-right: 2rem

.strap-latest-listings__error
  padding: 50px

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

.no-image
  font-size: 120%
  opacity: 0.6
</style>
