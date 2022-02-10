<template>
  <div class="listings-map-view gus-layer-map" :aria-hidden="!isOpen" v-show="isOpen" @click="closeMap">
    <div class="listings-map-modal var--gus-reset-colors" @click="noop">
      <div class="columns">
        <div v-show="!isMobile" class="column is-hidden-touch is-one-third-desktop is-one-quarter-widescreen map-sidebar-wrapper" style="margin-top:0.75rem">
          <PageTitle />
          <NumResults />
          <SaveSearch />
          <CurrentFilters />
          <PopularSearches />
        </div>
        <div class="column map-wrapper">
          <div v-show="!isMobile" class="map-wrapper__recenter-wrapper layer-fg">

            <button type="button" v-if="hasPolygon" @click="clear" class="map-wrapper__draw var--gus-bg-primary">
              <i class="icon-cross"></i>
            </button>
            <button type="button" v-else
              :class="['map-wrapper__draw', drawMode ? 'var--gus-border-primary' : 'var--gus-bg-primary']"
              @click="toggleDrawing">
              <i class="icon-pencil4"></i>
            </button>

            <button type="button" class="var--gus-bg-primary map-wrapper__recenter" @click="recenter">
              <i class="icon-aim"></i>
            </button>
          </div>

          <TheMap @reqCloseMap="closeMap" />

          <MapToolbar v-show="!isMobile" @reqCloseMap="closeMap" />
          <div v-show="isMobile" class="mobile-toolbar layer-fg">
            <div v-if="hasPolygon" class="button is-primary" @click="clear">Clear Drawing</div>
            <div v-else class="button is-primary" @click="toggleDrawing">Draw on Map</div>
            <div class="button is-primary" @click="recenter">Recenter Map</div>
            <div class="delete" @click="closeMap"></div>
          </div>

          <div v-if="openMarker && !loading" class="property-modal-wrapper" @click="closeMarker">
            <div class="property-modal">
              <Item v-show="!isEREB" v-if="listings.length === 1" :listing="listings[0]" />
              <listing-card-edm v-show="isEREB" v-if="listings.length === 1" :listing="listings[0]._source" />
              <CondoTabs v-if="listings.length > 1" :listings="listings" />
            </div>
          </div>

          <div v-if="loading" class="loading-wrapper">
            <div class="loading gus-loading"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../Sidebar'
import MapToolbar from '../Toolbar/MapToolbar'
import TheMap from './TheMap'
import PageTitle from '../Sidebar/PageTitle.vue'
import SaveSearch from '../SaveSearch'
import NumResults from '../Sidebar/NumResults.vue'
import CurrentFilters from '../Sidebar/CurrentFilters.vue'
import PopularSearches from '../Sidebar/PopularSearches'
import Item from '../Results/Item'
import ListingCardEdm from '@/components/ListingCardEDM'
import CondoTabs from './CondoTabs'

export default {
  name: 'mapView',

  props: ['isOpen'],

  components: {
    Sidebar,
    MapToolbar,
    TheMap,
    PageTitle,
    NumResults,
    SaveSearch,
    CurrentFilters,
    PopularSearches,
    Item,
    ListingCardEdm,
    CondoTabs
  },

  computed: {
    openMarker () {
      return this.$store.state.gus.map.openMarker
    },

    listings () {
      if (!this.openMarker) return []
      return this.$store.state.gus.map.markers.filter(marker =>
        this.$store.state.gus.map.openMarker.split('|').indexOf(marker._id) !== -1
      )
    },

    loading () {
      return this.$store.state.gus.map.markersLoadState === 1 ||
        this.$store.state.gus.map.positionLoadState === 1
    },

    drawMode () {
      return this.$store.state.gus.map.drawMode
    },

    hasPolygon () {
      return this.$store.state.gus.geo && this.$store.state.gus.geo.geometry
    },

    isMobile () {
      return this.$store.getters.isMobile
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  methods: {
    closeMap: function () {
      this.$emit('reqCloseMap')
      this.$store.commit('endDrawing')
    },

    clear: function () {
      this.$store.commit('clearGeo')
      this.$store.dispatch('submit')
      this.$store.dispatch('requestMapPosition')
    },

    toggleDrawing: function () {
      if (this.drawMode) {
        this.$store.commit('endDrawing')
      } else {
        this.$store.commit('beginDrawing')
      }
    },

    noop: function (e) {
      e.stopPropagation()
      return false
    },

    requestPosition: function () {
      this.$store.dispatch('requestMapPosition')
    },

    recenter: function () {
      this.$store.commit('recenterMap')
    },

    closeMarker: function () {
      this.$store.commit('closeMarker')
    }
  },

  created () {
    this.requestPosition()
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

.listings-map-view
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  &[aria-hidden]
    visibility: hidden
    z-index: -1
  +mobile
    top: 50px
    bottom: 40px

+with-palette
  .listings-map-view
    background-color: var(--#{$palette}-bgColor)

.columns
  margin: 0 !important
  height: 100%

.listings-map-modal
  position: relative
  height: 100%
  width: 100%
  @media (min-width: 769px)
    overflow: hidden

.map-sidebar-wrapper
  padding: 2rem

.map-wrapper
  height: 100%
  padding: 0
  position: relative

.map-wrapper__recenter-wrapper
  position: absolute
  left: 2rem
  bottom: 2rem

.map-wrapper__recenter,
.map-wrapper__draw
  font-size: 1.5rem
  padding: 0 0.5em
  cursor: pointer
  height: 46px
  border-radius: 3px
  line-height: 46px
  text-align: center
  border: none
  margin-right: 10px
  box-shadow: 0 2px 7px rgba(#000, 0.15)
  &.var--gus-border-primary
    border: 2px solid

.property-modal-wrapper
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(10, 10, 10, 0.2)

.property-modal
  position: absolute
  top: 25%
  bottom: 0
  left: 0
  right: 0
  max-width: 300px
  margin-left: auto
  margin-right: auto

.loading-wrapper
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  text-align: center
  pointer-events: none
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  font-size: 5rem
  opacity: 0.5

.mobile-toolbar
  +mobile
    position: absolute
    top: 10px
    left: 10px
    right: 10px
    height: 28px
    display: flex
  +tablet
    position: absolute
    top: 60px
    left: 10px
    right: 10px
    height: 28px
    display: flex
  .button
    font-size: 16px
    font-weight: bold
    height: 100%
    margin-right: 10px
  .delete
    margin-left: auto
    max-height: 28px
    max-width: 28px
    min-height: 28px
    min-width: 28px
</style>
