<template>
  <div class="simple-gallery" v-if="listing.location || hasImages">
    <div class="strap-container container">
      <div class="gallery-outer" v-if="hasImages">

        <!-- <div class="map-controls">
          <a v-if="mapVisible" @click="mapVisible = false">Hide Map</a>
          <a v-else @click="mapVisible = true">Show Map</a>
        </div> -->

        <div class="gallery-control is-left">
          <button class="button gallery-button is-primary" @click="previous">
            <span class="icon icon-chevron-left"></span>
          </button>
        </div>

        <div class="gallery-images">
          <div class="gallery-image" :style="imgStyle"></div>
        </div>

        <div class="gallery-control is-right">
          <button class="button gallery-button is-primary" @click="next">
            <span class="icon icon-chevron-right"></span>
          </button>
        </div>

      </div>
    </div>

    <!-- <div class="map-outer">
      <div class="map-inner" :style="mapStyles" ref="map" v-if="listing.location">
        <google-map :center="{ lat: listing.location.lat, lng: listing.location.lon }" />
      </div>
    </div> -->

  </div>
</template>

<script>
// import GoogleMap from '../GoogleMap'

export default {
  name: 'SimpleGallery',

  components: {
   // GoogleMap
  },

  props: {
   listing: {
     type: Object,
     required: true
   },

   strap: {
     type: Object,
     required: true
   }
  },

  data () {
    return {
      index: 0,
      mapVisible: false
    }
  },

  created () {
    this.mapVisible = !this.hasImages
  },

  computed: {
    mapStyles () {
      const y = this.$data.mapVisible ? 0 : 100

      return {
       transform: `translateY(${y}%)`
      }
    },

    hasImages () {
      if (this.$store.state.editing) return true
      if (this.listing.images && this.listing.images.length) return true

      return false
    },

    imgStyle () {
      const imgUrl = this.listing.images[this.index]

      return {
        backgroundImage: `url("${imgUrl}")`
      }
    }
  },

  methods: {
    next () {
      this.index = (this.index + 1) % this.listing.images.length
    },

    previous () {
      this.index -= 1
      if (this.index < 0) this.index = this.listing.images.length
    }
  }
}
</script>

<style scoped lang="sass">
.simple-gallery
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: relative

.strap-container
  height: 100%
  position: relative

.gallery-outer
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: relative

.gallery-control
  top: 0
  width: 60px
  height: 100%
  z-index: 1
  position: absolute
  &.is-left
    left: 4px
  &.is-right
    right: 4px

.gallery-button
  width: 60px
  height: 60px
  border-radius: 60px
  font-size: 150%
  position: absolute
  top: 50%
  margin-top: -30px

.gallery-images
  top: 0
  left: 68px
  right: 68px
  height: 100%
  position: absolute

.gallery-image
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: relative
  background-position: 50% 50%
  background-size: contain
  background-repeat: no-repeat

.map-outer
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 2
  overflow: hidden
  position: absolute
  pointer-events: none

.map-inner
  top: 0
  left: 0
  width: 100%
  height: 100%
  pointer-events: auto
  position: relative

.map-controls
  height: 60px
  position: absolute
  right: 0
  bottom: -60px
  padding: 12px 0
  z-index: 2
  a
    padding: .5em .75em
    font-size: 14px
    display: inline-block
    text-decoration: underline
</style>
