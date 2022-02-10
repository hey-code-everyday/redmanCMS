<template>
  <div class="gus gus-layer-base">
    <div :class="mapMode ? '' : 'gus-toolbar hide-mobile'">
      <Toolbar @reqOpenMap="openMap" :mapMode="mapMode" />
    </div>

    <div :class="`columns ${mapMode ? 'map-mode-column' : 'margin-0'}`">
      <div :class="columnClassName">
        <Sidebar v-if="!mapMode" />
        <TheMap v-else :mapMode="mapMode" :hoverSearchItem="hoverSearchItem" />
      </div>
      <div :class="mapMode ? 'is-half-desktop is-half-widescreen is-one-third-tablet is-one-third-mobile gus-list column map-mode-result-mobile' : 'gus-list column'">
        <NagBar v-if="!isCompleteVow" />
        <Results
          v-if="!hideResults && !hideListingResults"
          :mapMode="mapMode"
          @showMapInfoWindow="showMapInfoWindow"  
        />
      </div>
    </div>

    <Toast />
  </div>
</template>

<script>
import Toolbar from './Toolbar'
import Results from './Results'
import Sidebar from './Sidebar'
import Toast from './Toast'
import TheMap from '@/modules/listing-search/components/MapView/TheMap'
import { changeMapListingSearchSectionZindexTop } from '@/modules/listing-search/helpers/changeElementAttribute'

export default {
  name: 'gus',

  components: {
    Toolbar,
    Results,
    Sidebar,
    NagBar: () => import(/* webpackChunkName: "nag-bar" */ '@/modules/nags/components/NagBar.vue'),
    Toast,
    TheMap
  },

  props: {
    mapMode: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      mapLoaded: false,
      hideResults: false,
      isVow: false,
      hoverSearchItem: false,
    }
  },

  watch: {
    isVow (nextIsVow) {
      this.toHideResults()
    }
  },

  computed: {
    isCompleteVow () {
      this.$set(this, 'isVow', this.$store.getters.isVow)
      return this.$store.getters.isVow
    },

    hideListingResults () {
      return this.toHideResults()
    },

    mapView () {
      return this.$store.state.gus.anchor === 'map'
    },

    columnClassName () {
      if (this.mapMode && this.mapView) {
        return 'anchor-map-search-listing'
      } else if (this.mapMode) {
        return 'column is-two-thirds-tablet is-half-desktop is-half-widescreen the-map-mobile map-mode-map_containner hide-tablet'
      } else {
        return 'column is-3-tablet is-one-quarter-desktop is-one-third-widescreen hide-mobile'
      }
    },
  },

  methods: {
    openMap () {
      this.mapLoaded = true
      this.$store.commit('setAnchor', 'map')
    },

    toHideResults() {
      //first condition checks for VOW; second condition checks for DDF acceptance 
      let toHide = (this.$store.getters.message('hideAllListingsUntilUserVow') &&
        !this.isCompleteVow) || (this.$store.state.config.sources[0] === 'idx-ddf-v5' && !this.isCompleteVow)

      this.$set(this, 'hideResults', toHide)
    },

    showMapInfoWindow(searchList) {
      this.hoverSearchItem = searchList
    }
  },

  created() {
    this.toHideResults()
    if (this.hideResults) this.$store.dispatch('attemptVow')
  },

  mounted () {
    if (process.browser) {
      changeMapListingSearchSectionZindexTop(this.$store.state, 'map')
      const anchor = localStorage.getItem('setAnchor')
      if (anchor) {
        this.$store.commit('setAnchor', anchor)
      }
      localStorage.removeItem('setAnchor')
    }
  }
}
</script>

<style scoped lang="sass">
.hide-mobile
  display: none
  @media (min-width: 769px)
    display: block

.gus
  display: flex
  flex-direction: column

.gus-toolbar
  margin-bottom: 2rem

.gus-list
  padding: 0

.columns
  @media (max-width: 768px)
    margin-bottom: 0

.the-map-mobile
  @media (max-width: 768px)
    height: 30rem

.map-mode-map_containner
  padding: 0 !important

.hide-tablet
  display: none
  @media (min-width: 769px)
    display: block

.map-mode-result-mobile
  @media (max-width: 768px)
    width: 100% !important
    
.map-mode-column
  margin-left: 0 !important
  margin-right: 0 !important
  margin-bottom: 0 !important
  @media (min-width: 769px)
    height: 85vh
  @media (max-width: 768px)
    margin-bottom: 2rem !important
.margin-0
  @media (max-width: 768px)
    margin-left: 0 !important
    margin-right: 0 !important
    margin-bottom: 0 !important
</style>
