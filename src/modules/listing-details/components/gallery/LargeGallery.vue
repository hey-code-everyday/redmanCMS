<template>
  <div
    class="large-listing-gallery"
    v-if="listing.location || hasImages || hasAdditionalLinks"
  >
    <!-- Gallery -->
    <div class="large-gallery-outer" v-if="hasImages">
      <div
        class="map-outer"
        :style="mapStyles"
        ref="map"
        v-if="listing.location && loadMap"
      >
        <google-map
          :center="{lat: listing.location.lat, lng: listing.location.lon}"
        />
      </div>
      <large-gallery-slider
        :current-index="currentIndex"
        :listing="listing"
        :isSold="strap.name === 'strap-sold-details' ? true : false"
        @changeIndex="changeIndex($event)"
        @image-clicked="openModal"
      />
    </div>

    <!-- Show Map if no images, but location-->
    <div class="large-gallery-outer" v-if="!hasImages && listing.location">
      <div
        class="map-outer"
        :style="mapStyles"
        ref="map"
        v-if="listing.location && loadMap"
      >
        <google-map
          :center="{lat: listing.location.lat, lng: listing.location.lon}"
        />
      </div>
    </div>

    <!-- Show if no images and location-->
    <div class="large-gallery-outer" v-if="!hasImages && !listing.location">
      No photos availible
    </div>

    <!-- Thumbnails -->
    <div class="small-gallery-outer" v-if="hasImages">
      <small-gallery-slider
        :current-selected="currentIndex"
        :current-index="currentIndexSmall"
        :current-index-big="currentIndex"
        @changeIndex="changeIndices($event)"
        @nextPrevClicked="changeIndex($event)"
        @toggleMap="toggleMap"
        :listing="listing"
      />
    </div>
  </div>
</template>

<script>
import GoogleMap from '../GoogleMap'
import LargeGallerySlider from './LargeGallerySlider'
import SmallGallerySlider from './SmallGallerySlider'
import CustomModalLargeImage from '@/components/ui/modals/custom/CustomModalLargeImage'

export default {
  name: 'gallery',

  components: {
    GoogleMap,
    LargeGallerySlider,
    SmallGallerySlider,
    CustomModalLargeImage
  },

  props: {
    listing: {type: Object, required: true},
    strap: {type: Object, required: true},
    forms: {type: Object, required: false}
  },

  data() {
    return {
      mapVisible: false,
      currentIndex: 0,
      currentIndexSmall: 0,
      loadMap: false,
    }
  },

  computed: {
    mobile() {
      return window.innerWidth < 1024
    },

    mapStyles() {
      const y = this.$data.mapVisible ? 0 : 100

      return {
        transform: `translateY(${y}%)`
      }
    },

    hasAdditionalLinks() {
      if (this.$store.state.editing) return false
      if (!this.listing.additionalLinks) return false
      let howMany = Object.keys(this.listing.additionalLinks).length
      if (howMany) return true
      return false
    },

    hasImages() {
      if (this.$store.state.editing) return true

      if (
        (this.listing.images && this.listing.images.length) ||
        (this.listing.publicInfo.additionalMedia &&
          this.listing.publicInfo.additionalMedia.length)
      )
        return true

      return false
    },

    media() {
      return (
        this.listing &&
        this.publicInfo.additionalMedia.concat(this.listing.images)
      )
    }
  },

  methods: {
    mapButtonStyle(active) {
      if (active) {
        const palette = this.$store.getters.palette(
          this.strap.config.style.theme
        )

        return {
          backgroundColor: palette.uiPrimary.bgColor,
          color: palette.uiPrimary.textColor
        }
      }

      return {}
    },

    changeIndices(index) {
      this.$set(this.$data, 'currentIndex', index)
      this.$set(this.$data, 'currentIndexSmall', index)
      if (this.mapVisible) this.mapVisible = false
    },

    changeIndex(index) {
      this.$set(this.$data, 'currentIndex', index)
    },

    toggleMap() {
      this.mapVisible = !this.mapVisible
      if (this.mapVisible) this.loadMap = true
    },

    openModal() {
      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          listing: this.listing,
          currentIndex: this.currentIndex,
          forms: this.forms
        },
        component: CustomModalLargeImage,
        settings: {
          width: '65vw',
          height: '90vh',
          padded: false,
          palette: this.$store.state.website.theme.straps.default
        }
      })
    }
  },

  created() {
    this.mapVisible = !this.hasImages
    this.loadMap = !this.hasImages
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

$mapColor: #efebe2
$mediaColor: #303841
$mediaTextColor: #ffffff

.large-listing-gallery
  position: relative
  flex-direction: column
  width: 100%
  height: 100%
  overflow: hidden

.map-outer,
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.map-outer
  z-index: 2
  background-color: $mapColor
  transition: transform 350ms ease-in-out

.large-gallery-outer
  display: flex
  overflow: hidden
  position: relative
  height: 85%
  +widescreen
    display: block
  +mobile
    height: 75%

.small-gallery-outer
  height: 15%
  +mobile
    height: 25%

.slider-controls
  position: absolute
  pointer-events: none
  z-index: 3
  top: 0
  left: 0
  width: 100%
  height: 100%

  > div
    position: relative
    z-index: 2
    width: 100%
    height: 100%

.controls-inner
  position: relative
  display: flex
  justify-content: flex-end
  flex-direction: column
  width: 100%
  height: 100%
  padding: 30px 50px

  +mobile
    padding: 20px

.controls-left
  margin-right: auto
  align-self: flex-end
  position: absolute
  left: 3%
  bottom: 28%

.button
  height: 48px
  width: 48px
  margin-right: 1px
  border: none

  i
    font-size: 24px

  &.is-active
    cursor: default

  &.has-text
    width: auto

.field
  pointer-events: auto
  display: inline-flex
  margin-bottom: 0
  vertical-align: bottom

  &.has-addons
    .control
      .button
        position: relative

      &:last-child
        .button
          &:after
            display: none

.var--gus-button-media,
.var--gus-button-media:hover,
.var--gus-button-media.is-active
  color: $mediaTextColor !important
  background-color: $mediaColor
</style>
