<template>
  <div class="strap-listings-feed" ref="strap">
    <div class="strap-container container pad-small">

      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class='strap-content'>
        <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />

        <div class="strap-listings__toolbar" v-if="strap_state.showToolbar">
          <div class="level">
            <div class="level-left">
              <div class="level-item">

                <!-- <div :class="[ 'dropdown', (toolbar.filtersOpen ? 'is-active' : '') ]">
                  <div class="dropdown-trigger">
                    <span @click="toolbar.filtersOpen = !toolbar.filtersOpen">
                      <span>Filter by <strong>{{ 'TODO ...' }}</strong></span>
                      <span class="icon is-small">
                        <i class="icon-chevron-down"></i>
                      </span>
                    </span>
                  </div>
                  <div class="dropdown-menu">
                    <div class="dropdown-content">
                      TODO: Filters
                    </div>
                  </div>
                </div> -->

              </div>
            </div>
            <div class="level-right">
              <div class="level-item">

                <div :class="[ 'dropdown', 'is-right', (toolbar.sortOpen ? 'is-active' : '') ]">
                  <div class="dropdown-trigger">
                    <span @click="toolbar.sortOpen = !toolbar.sortOpen">
                      <span>Sort by <strong>{{ toolbar.sortOptions[toolbar.filters.sort] }}</strong></span>
                      <span class="icon is-small">
                        <i class="icon-chevron-down"></i>
                      </span>
                    </span>
                  </div>
                  <div class="dropdown-menu">
                    <div class="dropdown-content">
                      <a v-for="(val, key) in toolbar.sortOptions" class="dropdown-item" @click="sortBy(key)">{{ val }}</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <template v-if="error">
          <div class="strap-listings__error pad">
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
          <div class="strap-listings__loading pad" :style="{ color: strap_palette.text }">
            <span class="loader" :style="{ borderLeftColor: strap_palette.text, borderBottomColor: strap_palette.text }"></span><br />
            Loading...
          </div>
        </template>

        <template v-else>
          <transition-group
            name="listing"
            class="strap-listings__feed pad trim-lr"
            tag="div"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
          >
            <template v-if="listings.length">
              <div class="listing-card__outer"
                v-for="(l, i) in listings"
                :key="l.id"
              >
                <listing-card
                    v-if="!isEREB"
                    :listing="l"
                    class="listing-card"
                  />
                  <listing-card-edm
                    v-else="isEREB"
                    :listing="l"
                    class="listing-card is-ereb"
                  />
              </div>
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

        <div class="strap-buttons" v-if="!moreResults">
          <a href="/search" class="button strap-button is-primary" @click="fetchNext">
            <span>View All Listings</span>
          </a>
        </div>
        <div class="strap-buttons" v-else-if="!error">
          <div v-if="!loadingNext" class="button strap-button is-primary" @click="fetchNext">
            <span>View More</span>
          </div>
          <div v-else class="button strap-button is-primary is-loading">
          </div>
          <div class="button strap-button is-outlined" @click="scrollToTop">
            <span>Back to Top</span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import EmptyCard from '@/components/EmptyCard'
import ListingCard from '@/components/ListingCard'
import ListingCardEdm from '@/components/ListingCardEDM'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import {
  prefetchListings,
  preconfiguredOptions
} from '@/helpers/listings'

let Velocity = null
if (process.browser) Velocity = require('velocity-animate')

export default {
  name: 'StrapSoldListingsFeed',

  components: {
    EmptyCard,
    ListingCard,
    ListingCardEdm,
    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  computed: {
    isMobile () {
      return process.browser ? (window.innerWidth <= 768) : true
    },

    isTablet () {
      return process.browser ? (window.innerWidth > 768 && window.innerWidth < 1024) : false
    },

    hideAgentInCourtesyOfMessage () {
      return this.$store.state.gus.config.hideAgentInCourtesyOfMessage
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  prefetch (resolve, reject, store, state) {
    prefetchListings(resolve, reject, store, state, { size: 9 })
  },

  afterPrefetch (err, result) {
    if (err) {
      this.loading = false
      this.$set(this, 'error', err)

      console.warn(err)
      return
    }

    const size = this.isMobile ? 1 : (this.isTablet ? 4 : 9)
    const listings = result.listings
    const search = result.search
    const config = result.config

    if (listings.length < size) {
      this.moreResults = false
    }

    this.loading = false
    this.$set(this, 'config', config)
    this.$set(this, 'listings', listings)
    this.$set(this, 'preconfiguredSearch', search || {})
  },

  data () {
    return {
      error: false,
      moreResults: true,
      loading: true,
      loadingNext: false,
      listings: [],
      currentIndex: 0,

      // Toolbar
      toolbar: {
        sortOpen: false,
        sortOptions: {
          list_date_des: 'Recently Listed',
          list_date_asc: 'Longest Listed',
          price_asc: 'Lowest Price',
          price_des: 'Highest Price'
        },
        filtersOpen: false,
        filters: {
          sort: 'list_date_des'
        }
      },

      // Preconfigued searches
      config: {},
      preconfiguredSearch: {},

      // Animation
      delay: 150,
      lastDelay: 0
    }
  },

  methods: {
    fetchData (cached) {
      if (!cached && !this.$store.getters.authenticated) return

      let filters = this.$data.toolbar.filters
      filters.size = this.isMobile ? 1 : (this.isTablet ? 4 : 9)
      filters.from = 0

      this.loading = true
      this.lastDelay = this.delay
      this.listings = []
      this.currentIndex = 0

      new Promise((resolve, reject) => {
        prefetchListings(resolve, reject, this.$store, this.strap_state, filters, cached)
      }).then(result => {
        const listings = result.listings
        const search = result.search
        const config = result.config

        if (listings.length < filters.size) {
          this.moreResults = false
        }

        this.loading = false
        this.$set(this, 'error', false)
        this.$set(this, 'config', config)
        this.$set(this, 'listings', listings)
        this.$set(this, 'preconfiguredSearch', search || {})
      }).catch(err => {
        console.warn(err)

        this.loading = false
        this.$set(this, 'error', err)
      })
    },

    fetchNext () {
      let filters = this.$data.toolbar.filters
      filters.size = this.isMobile ? 1 : (this.isTablet ? 2 : 3)
      filters.from = this.listings.length

      this.loadingNext = true
      this.lastDelay = this.delay

      new Promise((resolve, reject) => {
        prefetchListings(
          resolve,
          reject,
          this.$store,
          this.strap_state,
          filters,
          {
            search: this.preconfiguredSearch,
            config: this.config
          }
        )
      }).then(result => {
        const listings = result.listings

        if (listings.length < filters.size) {
          this.moreResults = false
        }

        this.loadingNext = false
        this.$set(this, 'listings', this.listings.concat(listings))
      }).catch(err => {
        console.warn(err)

        this.loadingNext = false
        this.$set(this, 'error', err)
      })
    },

    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(30px)'

      if (!process.browser) return

      Velocity(
        el,
        { opacity: 0, translateY: '30px' }
      )
    },

    enter: function (el, done) {
      this.lastDelay += this.delay
      const delay = this.lastDelay

      if (!process.browser) return

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, translateY: '0px' },
          { complete: done, duration: '300ms' }
        )
      }, delay)
    },

    leave: function (el, done) {
      this.lastDelay += this.delay
      const delay = this.lastDelay

      if (!process.browser) return

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, translateY: '30px' },
          { complete: done, duration: '300ms' }
        )
      }, delay)
    },

    sortBy (sort) {
      this.toolbar.filters.sort = sort
      this.toolbar.sortOpen = false

      this.fetchData({
        search: this.preconfiguredSearch,
        config: this.config
      })
    },

    scrollToTop () {
      const { strap } = this.$refs
      strap.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  },

  mounted () {
    if (this.listings.length === 0) this.fetchData()
  },

  watch: {
    strap_state () {
      this.fetchData()
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Latest Sold Listings' }),
      text: defaultQuill(),
      useRealtorListings: false,
      centerSearch: false,
      predefinedSearch: '',
      showToolbar: false,
      useAdvancedSetup: false,
      advancedSetup: ''
    }
  },

  migrations (strap, state) {
    return [
      {
        predefinedSearch: '',
        showToolbar: false
      }, // Issue #73
      {
        useAdvancedSetup: false,
        advancedSetup: ''
      } // Issue #127
    ]
  },

  schema () {
    return [
      {
        title: 'Listings',
        tabs: [
          {
            title: 'Display Options',
            initial: true,
            fields: [
              {
                key: 'state.showToolbar',
                type: 'checkbox',
                label: 'Show Toolbar',
                text: 'Display a toolbar with additional filters and sorting.',
                default: false,
                onValue: true,
                offValue: false
              }
            ]
          },
          {
            title: 'Listings Setup',
            initial: true,
            fields: [
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
                text: 'Only display results from within my area',
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
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

$listingTransition: all 500ms

.strap-listings-feed
  position: relative

.listing-card
  display: inline-flex !important
  height: 100%
  white-space: normal
  width: 100%

.is-ereb.listing-card
  height: auto

.strap-listings__error

.strap-listings__loading
  text-align: center
  opactiy: 0.6

.strap-listings__toolbar
  font-size: 16px

  &:not(:first-child)
    margin-top: 2.5rem

  .dropdown-trigger
    cursor: pointer

    .icon
      margin: 3px 0 0 3px
      font-size: 12px

  .dropdown-menu
    text-align: left
    z-index: 999

.strap-listings__feed
  display: flex
  flex-wrap: wrap
  margin: -1rem

  .listing-card__outer
    width: 33.3%
    flex: 0 0 33.3%
    box-sizing: border-box
    padding: 1rem

  .listing-card
    margin: 0

+tablet-only
  .strap-listings__feed
    .listing-card__outer
      width: 50%
      flex: 0 0 50%

+mobile
  .strap-listings__feed
    padding-left: 0
    padding-right: 0
    margin: -1rem 0

    .listing-card__outer
      width: 100%
      flex: 0 0 100%
      padding: 1rem 0

.strap-button
  transition: opacity 250ms ease-in-out

.loader
  +loader
  opactiy: 0.6
  display: inline-block
  width: 3rem
  height: 3rem
  margin-bottom: 1rem
  border-left-color: $wsBorder
  border-bottom-color: $wsBorder

.empty-card,
.error-card
  margin: 0

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
