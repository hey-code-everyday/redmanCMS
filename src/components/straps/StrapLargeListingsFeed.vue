<template>
  <div class="strap-listings-feed" ref="strap">
    <div :class="`custom-strap-container`">

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

        <div v-if="strap_state.showColumnedPrices" class="columned-price strap-content">
          <div class="columns is-gapless">
            <div class="column">
              <a :href="buildPriceUrl(currentPage, 'all')" @click.prevent="selectPriceRange('all')" >Search All</a><br/>
              <a :href="buildPriceUrl(currentPage, 'below-100k')" @click.prevent="selectPriceRange('below-100k')">Under $100,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '100k-200k')" @click.prevent="selectPriceRange('100k-200k')">$100,000 - $200,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '200k-300k')" @click.prevent="selectPriceRange('200k-300k')">$200,000 - $300,000</a><br/>
            </div>
            <div class="column">
              <a :href="buildPriceUrl(currentPage, '300k-400k')" @click.prevent="selectPriceRange('300k-400k')">$300,000 - $400,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '400k-500k')" @click.prevent="selectPriceRange('400k-500k')">$400,000 - $500,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '500k-600k')" @click.prevent="selectPriceRange('500k-600k')">$500,000 - $600,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '600k-700k')" @click.prevent="selectPriceRange('600k-700k')">$600,000 - $700,000</a><br/>
            </div>
            <div class="column">
              <a :href="buildPriceUrl(currentPage, '700k-800k')" @click.prevent="selectPriceRange('700k-800k')">$700,000 - $800,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '800k-900k')" @click.prevent="selectPriceRange('800k-900k')">$800,000 - $900,000</a><br/>
              <a :href="buildPriceUrl(currentPage, '900k-1m')" @click.prevent="selectPriceRange('900k-1m')">$900,000 - $1 Million</a><br/>
              <a :href="buildPriceUrl(currentPage, 'above-1m')" @click.prevent="selectPriceRange('above-1m')">Above $1 Million</a><br/>
            </div>
          </div>
        </div>

        <!-- Error -->
        <template v-if="error">
          <div class="strap-listings__error pad">
            <empty-card :key="-1" class="large-listing-card error-card">
              <h5 class="title is-5">
                Sorry, there was a problem loading listings. <br />
                Please try again later.
              </h5>
            </empty-card>
          </div>
        </template>

        <!-- Loading -->
        <template v-else-if="loading || loadingNext">
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
                :class="isEREB ? 'is-ereb' : ''"
              >
                <large-listing-card
                  v-if="!isEREB"
                  :listing="l" 
                  class="listing-card" />
                 <listing-card-edm
                    v-if="isEREB"
                    :listing="l"
                    class="listing-card"
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

        <div v-if="totalPages" class="page-count strap-content">
          Page {{currentPage}} of {{totalPages}}
        </div>

        <div class="strap-buttons" v-if="!moreResults">
          <a href="/search" class="button strap-button is-primary view-all-listings" @click="fetchNext">
            <span>View All Listings</span>
          </a>
        </div>
        <div class="strap-buttons" v-else-if="!error">
          <!--<div v-if="!loadingNext" class="button strap-button is-primary view-more" @click="fetchNext">
            <span>View More</span>
          </div>-->
          <a v-if="!loadingNext" v-show="currentPage > 1" :href="buildPageUrl(currentPage - 1)" @click.prevent="fetchPrev" class="button strap-button is-primary view-prev-listings">
            <span>Previous</span>
          </a>

          <a v-if="!loadingNext" v-show="currentPage < totalPages" :href="buildPageUrl(currentPage + 1)" @click.prevent="fetchNext" class="button strap-button is-primary view-next-listings">
            <span>Next</span>
          </a>

          <div v-else class="button strap-button is-primary is-loading">
          </div>
          <div class="button strap-button is-outlined back-to-top" @click="scrollToTop">
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
import LargeListingCard from '@/components/LargeListingCard'
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


function getPageFromUrl (url) {
  let reg = /\?page=(\d+)/
  let page = reg.exec(url)

  return (page ? page[1] : 1)
}

function getPriceFromUrl (url) {
  let reg = /price=(\w+-\w+)/
  let priceRange = reg.exec(url)

  return (priceRange ? priceRange[1] : 'all')
}

function setPriceFilters (priceRange) {
  let lowPrice = 0
  let highPrice = 0

  if (priceRange && priceRange != 'all') {
    if (priceRange === 'below-100k') {
      highPrice = 100000
    } else if (priceRange === 'above-1m'){
      lowPrice = 1000000
    } else {
      //does not contain million
      if (priceRange.indexOf('m') <= -1) {
        lowPrice = priceRange.split('-')[0].replace('k','') + '000'
        highPrice = priceRange.split('-')[1].replace('k','') + '000'
      } else {
        lowPrice = priceRange.split('-')[0]
        if (lowPrice.indexOf('m') <= -1) {
          lowPrice = lowPrice.replace('k','') + '000'
        } else {
          lowPrice = lowPrice.replace('m','') + '000000'
        }

        highPrice = priceRange.split('-')[1]
        if (highPrice.indexOf('m') <= -1) {
          highPrice = highPrice.replace('k','') + '000'
        } else {
          highPrice = highPrice.replace('m','') + '000000'
        }
      }
    }
  }
  return {lowPrice, highPrice} 
}

export default {
  name: 'StrapLargeFeaturedListings',

  components: {
    EmptyCard,
    LargeListingCard,
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

    strapPadding () {
      const { title, text } = this.strap_state

      if (
        (title.html === '' || title.html === '%3Cp%3E%3Cbr%3E%3C/p%3E') &&
        (text.html === '' || text.html === '%3Cp%3E%3Cbr%3E%3C/p%3E')
      ) {
        return 'pad-small'
      }

      return 'pad-medium'
    },
    
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  prefetch (resolve, reject, store, state) {
    let filters = {}
    let urlPage = Number(getPageFromUrl(store.state.config.requestUrl))

    //167 = max number of pages
    if (urlPage !== 167) filters.size = 9 
    if (urlPage >= 167) filters.size = 6

    filters.from = urlPage <= 1 ? 0 : (urlPage - 1) * 9

    let urlPrice = getPriceFromUrl(store.state.config.requestUrl)
    let filterPrices = setPriceFilters(urlPrice)

    if (filterPrices.highPrice) filters.high_price = filterPrices.highPrice
    if (filterPrices.lowPrice) filters.low_price = filterPrices.lowPrice

    prefetchListings(resolve, reject, store, state, filters)
  },

  afterPrefetch (err, result) {
    if (err) { 
      this.loading = false
      this.$set(this, 'error', err)

      console.warn(err)
      return
    }

    const size = 9
    const totalResults = result.hits
    const listings = result.listings
    const search = result.search
    const config = result.config

    if (listings.length < size) {
      this.moreResults = false
    }

    this.loading = false
    this.$set(this, 'config', config)
    this.$set(this, 'listings', listings)
    this.$set(this, 'totalResults', totalResults)
    this.$set(this, 'totalPages', Math.ceil(Number(totalResults)/9))
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
      lastDelay: 0,

      currentPage: Number(getPageFromUrl(this.$store.state.config.requestUrl)),
      priceRange: getPriceFromUrl(this.$store.state.config.requestUrl),
      totalPages : 167,
      totalResults: 1500
    }
  },

  methods: {
    selectPriceRange(priceRange) {
      this.$set(this, 'currentPage', 1)
      this.$set(this, 'priceRange', priceRange)
      this.fetchData(true)
    },

    fetchData (cached) {
      if (!cached && !this.$store.getters.authenticated) return

      let filters = this.$data.toolbar.filters
      if (this.currentPage <= 0) this.$set(this, 'currentPage', 1)

      if (this.currentPage + 1 < this.totalPages || !this.totalResults) {
        filters.size = 9
      } else if (this.currentPage === 167) {
        filters.size = 6
      } else {
        filters.size = this.totalResults - ((this.currentPage - 1) * 9)
      }

      filters.from = this.currentPage === 1 ? 0 : ((this.currentPage - 1) * 9)

      if (this.priceRange != 'all') {
        let filterPrices = setPriceFilters(this.priceRange)

        if (filterPrices.highPrice) filters.high_price = filterPrices.highPrice
        if (filterPrices.lowPrice) filters.low_price = filterPrices.lowPrice
      } else {
        delete filters.low_price
        delete filters.high_price
      }

      this.loading = true
      this.lastDelay = this.delay
      this.listings = []

      new Promise((resolve, reject) => {
        prefetchListings(resolve, reject, this.$store, this.strap_state, filters, cached)
      }).then(result => {

        const listings = result.listings
        const totalResults = result.hits
        const search = result.search
        const config = result.config

        if (listings.length < filters.size) {
          this.moreResults = false
        }

        this.loading = false
        this.$set(this, 'error', false)
        this.$set(this, 'config', config)
        this.$set(this, 'listings', listings)
        this.$set(this, 'totalResults', totalResults)
        this.$set(this, 'totalPages', Math.ceil(Number(totalResults)/9))
        this.$set(this, 'preconfiguredSearch', search || {})
      }).catch(err => {
        console.warn(err)

        this.loading = false
        this.$set(this, 'error', err)
      })
    },

    fetchNext () {
      let filters = this.$data.toolbar.filters
      if (this.currentPage + 1 < this.totalPages) {
        filters.size = 9
      } else {
        filters.size = this.totalResults - (this.currentPage * 9)
      }

      filters.from = (this.currentPage) * 9
      this.$set(this, 'currentPage', this.currentPage + 1)

      if (this.priceRange != 'all') {
        let filterPrices = setPriceFilters(this.priceRange)

        if (filterPrices.highPrice) filters.high_price = filterPrices.highPrice
        if (filterPrices.lowPrice) filters.low_price = filterPrices.lowPrice
      } else {
        delete filters.low_price
        delete filters.high_price
      }

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

        this.scrollToTop()

        if (listings.length < filters.size) {
          this.moreResults = false
        }

        this.loadingNext = false
        this.$set(this, 'listings', listings)
      }).catch(err => {
        console.warn(err)

        this.loadingNext = false
        this.$set(this, 'error', err)
      })
    },


    fetchPrev () {
      let filters = this.$data.toolbar.filters
      filters.size = 9

      this.$set(this, 'currentPage', this.currentPage - 1)
      filters.from = (this.currentPage === 1) ? 0 : (this.currentPage - 1) * 9

      if (this.priceRange != 'all') {
        let filterPrices = setPriceFilters(this.priceRange)

        if (filterPrices.highPrice) filters.high_price = filterPrices.highPrice
        if (filterPrices.lowPrice) filters.low_price = filterPrices.lowPrice
      } else {
        delete filters.low_price
        delete filters.high_price
      }

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
        this.scrollToTop()

        if (listings.length < filters.size) {
          this.moreResults = false
        }

        this.loadingNext = false
        this.$set(this, 'listings', listings)
        //this.$set(this, 'listings', this.listings.concat(listings))
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
      }, 10)
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
    },

    buildPriceUrl (pageNum, priceRange) {
      let slug = this.$store.state.page.slug
      slug = slug + '?page=1'
      slug = slug + '&price=' + priceRange

      return slug
    },

    buildPageUrl (pageNum) {

      let slug = this.$store.state.page.slug
      slug = slug + '?page=' + pageNum
      slug = slug + '&price=' + this.priceRange

      return slug
    }

  },

  mounted () {
    if (this.listings.length === 0) this.fetchData()
  },

  watch: {
    strap_state () {
      this.fetchData()
    },
    totalResults () {
      this.fetchData()
    },
    priceRange () {
      this.fetchData()
    }
  },

  updated: function () {
    if (this.currentPage === 0) this.currentPage = 1
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages

    if (this.currentPage && this.priceRange) {
      let url = `?page=${this.currentPage}&price=${this.priceRange}`
      window.history.pushState({}, '', url)
    }
  },

  /*metaInfo () {
    const { page, config, website } = this.$store.state

    let ldJson = {
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      'about': page.metaInfo.description,
      'genre': 'real estate',
      'url': config.requestUrl,
      'author': {
        '@type': 'Person',
        'name': website.config.display.siteName
      }
    }

    const meta = []
    const title = page.metaInfo.title
    const description = page.metaInfo.description + ' Page ' + this.currentPage + ' of ' + this.totalPages

    // Facebook

    meta.push({
      vmid: 'og:type',
      property: 'og:type',
      content: 'article'
    })
    meta.push({
      vmid: 'og:title',
      property: 'og:title',
      content: title
    })
    meta.push({
      vmid: 'og:description',
      property: 'og:description',
      content: description
    })

    // Twitter

    meta.push({ vmid: 'twitter:title', name: 'twitter:title', content: title })
    meta.push({ vmid: 'twitter:description', name: 'twitter:description', content: description })

    return {
      title,
      meta: [
        {
          name: 'description',
          content: description
        },
        ...meta
      ],
      script: [
        {
          innerHTML: JSON.stringify(ldJson),
          type: 'application/ld+json'
        }
      ]
    }
  },*/
  metaInfo () {
    const link = []
    const protocol = this.$store.state.config.websiteProtocol || 'https'
    const hostname = this.$store.state.config.websiteDomain
    link.push({rel: 'canonical', href: `${protocol}://${hostname}/${this.buildPageUrl(this.currentPage)}`})
    return { link }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Latest Listings' }),
      text: defaultQuill(),
      useRealtorListings: false,
      centerSearch: false,
      predefinedSearch: '',
      showToolbar: false,
      useAdvancedSetup: false,
      advancedSetup: '',
      showColumnedPrices: false
    }
  },

  migrations (strap, state) {
    return [
      {
        predefinedSearch: '',
        showToolbar: false,
        showColumnedPrices: false
      }, // Issue #73, 747
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
              },
              {
                key: 'state.showColumnedPrices',
                type: 'checkbox',
                label: 'Show Columned Price Ranges',
                text: 'Display columned price ranges',
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

.custom-strap-container
  +desktop
    padding: 1rem
    margin: 1rem
  +tablet
    padding: .8rem
    margin: .8rem   
  +mobile
    padding: .2rem
    margin: .2rem

.strap-listings-feed
  position: relative

.columned-price
  +desktop
    margin-top: 10px

.page-count
  margin-bottom: 10px

.listing-card
  display: inline-flex !important
  height: 100%
  white-space: normal
  width: 100%

.strap-listings__error

.strap-listings__loading
  text-align: center
  opactiy: 0.6

.strap-listings__toolbar
  font-size: 16px

  &:not(:first-child)
    margin-top: .5rem

  .dropdown-trigger
    cursor: pointer

    .icon
      margin: 3px 0 0 3px
      font-size: 12px

  .dropdown-menu
    text-align: left
    z-index: 9999

.strap-listings__feed
  display: flex
  flex-wrap: wrap
  margin: -1rem

  .listing-card__outer
    width: 33.3%
    flex: 0 0 33.3%
    box-sizing: border-box
    padding: 0px .2rem 0px .2rem

    &.is-ereb
      margin-bottom: 0.6rem

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
      +desktop
        padding: 1rem 0

.strap-button
  transition: opacity 250ms ease-in-out
  +mobile
    width: 90%

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
