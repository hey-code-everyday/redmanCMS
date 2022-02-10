<template>
  <div :class="`results-wrapper${loading ? ' results-wrapper--loading' : ''} ${mapMode ? 'map-mode-result-scroll' : ''}`">
    <div v-if="listings.length && mapMode" class="map-listing-search_header">
      <MapListingSearchResultHeader />
    </div>
    <ul :class="mapMode ? 'results-map-mode' : 'results'" id="results">
      <li
        :class="mapMode ? 'result-map-mode' : 'result'"
        v-for="listing in listings"
        v-bind:key="listing._id"
        @mouseover="showMapInfoWindow(listing)"
        @mouseleave="showMapInfoWindow(false)"
      >
        <ItemMobile
          v-show="isMobile && !isEREB"
          :listing="listing"
          :mapMode="mapMode"
        />
        <Item :listing="listing" v-show="!isMobile && !isEREB" />
        <listing-card-edm
          v-if="isEREB"
          :listing="listing._source"
          :hasTags="true"
          class="listing-card"
        />
      </li>
    </ul>

    <div class="results-inner">
      <div v-if="!listings.length" class="no-results">
        <h2 class="no-results__title">
          No listings found. Try expanding your search?
        </h2>
        <NoResults class="no-results__icon" />
      </div>

      <div class="pagination">
        <a
          :href="prevPageHref"
          v-if="hasPrevPage"
          @click="prev"
          class="button is-primary pagination__prev var--gus-bg-primary"
          ><span>Previous</span></a
        >
        <p class="num-results page-between-buttons" v-if="mapMode && listings.length">Page <strong>{{thisPage}}</strong> of <strong>{{totalPages}}</strong></p>
        <a
          :href="nextPageHref"
          v-if="hasNextPage"
          @click="next"
          class="button is-primary pagination__next var--gus-bg-primary"
          ><span>Next</span></a
        >
      </div>
      <p class="disclaimer">{{ disclaimer }}</p>
      <p v-if="lastUpdate" class="disclaimer">
        Results last updated {{ lastUpdate }}
      </p>
    </div>

    <div v-if="mapMode" class="app-page__footer map-search-listing__footer">
      <hr />
      <app-footer :footer="$store.state.footer" :key="$store.state.footer.name" />
    </div>
  </div>
</template>

<script>
import Item from './Item/index.vue'
import ItemMobile from './Item/Mobile.vue'
import NoResults from './NoResults.vue'
import ListingCardEdm from '@/components/ListingCardEDM'
import ListingCard from '@/components/ListingCard'
import dayjs from 'dayjs'
import MapListingSearchResultHeader from './MapListingSearchResultHeader'
import { elementScrollToTopIfNeeded } from '../../helpers/elementScrollToTop'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'results',

  components: {
    Item,
    ItemMobile,
    NoResults,
    ListingCardEdm,
    ListingCard,
    MapListingSearchResultHeader,
    AppFooter
  },
  
  props: {
    mapMode: {
      type: Boolean,
      default: () => false
    }
  },

  methods: {
    prev: function(e) {
      e.preventDefault()
      this.$store.dispatch('submit', this.$store.state.gus.page - 1)
      if (this.mapMode) {
        elementScrollToTopIfNeeded('map-listing-search-side-header')
      }
    },
    next: function(e) {
      e.preventDefault()
      this.$store.dispatch('submit', this.$store.state.gus.page + 1)
      if (this.mapMode) {
        elementScrollToTopIfNeeded('map-listing-search-side-header')
      }
    },
    submit: function (e) {
      if (this.$route.query.page) {
        return this.$store.dispatch('submit', parseInt(this.$route.query.page) - 1)
      }
      return this.$store.dispatch('submit', 0)
    },
    showMapInfoWindow: function(listing) {
      if (this.mapMode) {
        this.$emit('showMapInfoWindow', listing)
      }
    }
  },

  computed: {
    isMobile () {
      return this.$store.getters.isMobile
    },

    listings: function () {
      return this.$store.state.gus.searchResults
    },

    loading: function () {
      return this.$store.state.gus.searchWaiting
    },

    hasPrevPage: function () {
      return this.$store.getters.hasPrevPage()
    },

    hasNextPage: function () {
      return this.$store.getters.hasNextPage()
    },

    prevPageHref: function () {
      return this.$store.getters.prevPageHref()
    },

    nextPageHref: function () {
      return this.$store.getters.nextPageHref()
    },

    disclaimer: function () {
      return this.$store.state.gus.searchResultsDisclaimer
    },

    lastUpdate: function () {
      let localTime
      const format = 'MMM D, YYYY [at] h:mm a'
      try {
        let when = dayjs(this.$store.state.gus.lastUpdate)
        let utc = Number(when.utcOffset())
        when = when.add(utc, 'minute')
        localTime = when.format(format)
      } catch (e) {
        localTime =
          dayjs(this.$store.state.gus.lastUpdate).format(format) + ' GMT'
      }
      return localTime
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    },
    
    thisPage () {
      return this.$store.state.gus.page + 1
    },
    totalPages () {
      return this.$store.getters.totalPages()
    }
  },
  created () {
    this.submit()
  },
  serverPrefetch () {
    return this.submit()
  }
}
</script>

<style lang="sass">
.results-wrapper--loading
  opacity: 0.8
  cursor: wait

.results-wrapper
  position: relative
  z-index: 0

.results
  @media (min-width: 768px)
    display: flex
    flex-wrap: wrap
    align-items: stretch

.results-map-mode
  @media (min-width: 769px)
    display: flex
    flex-wrap: wrap
    align-items: stretch
    margin: 0 0.5rem 0 0

.result
  flex: 1 0 auto
  width: 100%
  margin: 10px 0
  @media (min-width: 769px)
    margin: 0.5rem
    width: calc(50% - 1rem)
  @media (min-width: 1008px)
    flex: 0 0 auto

.result-map-mode
  flex: 1 0 auto
  width: 100%
  margin: 10px 0
  @media (min-width: 1023px)
    margin: 0.5rem
    width: calc(50% - 1rem)
  @media (min-width: 1008px)
    flex: 0 0 auto

.no-results
  text-align: center

.no-results__title
  font-size: 1.5rem
  font-weight: 700
  margin: 1em 0

.disclaimer
  margin: 1rem 0
  opacity: 0.5
  line-height: 1.3
  text-align: center
  @media (max-width: 768px)
    font-size: 11px
    margin: 10px 0

.pagination
  margin: 20px 0
  @media (min-width: 769px)
    margin: 2rem 0

.pagination__prev,
.pagination__next
  min-width: 100px
  @media (max-width: 768px)
    height: 28px
    font-size: 16px
    line-height: 28px
    font-weight: bold

.pagination__next
  margin-left: auto
  @media (min-width: 769px)
    margin-right: 1rem

.results-inner
  @media (max-width: 768px)
    padding: 0 10px

.pagination__prev
  @media (min-width: 769px)
    margin-left: 1rem

.page-between-buttons
  position: absolute
  width: 8rem
  left: calc(50% - 4rem)
  @media (max-width: 1023px)
    width: 4rem
    left: calc(50% - 2rem)

.map-listing-search_header
  margin: 1rem
  display: block
  @media (max-width: 768px)
    display: none

.map-mode-result-scroll
  max-height: 85vh
  overflow-y: auto
  padding: 0 .5rem
  @media (max-width: 768px)
    padding: 0
    max-height: unset
</style>
