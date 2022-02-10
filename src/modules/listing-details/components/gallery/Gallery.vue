 <template>
  <div class="listing-gallery" v-if="listing.location || hasImages">

    <div class="gallery-outer" v-if="hasImages">
      <gallery-slider :listing="listing" />
    </div>

    <div class="map-outer" :style="mapStyles" ref="map" v-if="listing.location && loadMap">
      <GoogleMap
      :center="{ lat: listing.location.lat, lng: listing.location.lon }" />
    </div>

    <div class="slider-controls" v-if="hasImages">
      <div>
        <div class="controls-inner">

          <div class="controls-left" v-if="listing.location">
            <div class="field has-addons">
              <p class="control">
                <a
                @click="mapVisible = false"
                :class="[ 'button', 'var--gus-button-media' ]"
                :style="mapButtonStyle(!mapVisible)">
                  <span class="icon is-small">
                    <i class="icon-picture"></i>
                  </span>
                </a>
              </p>
              <p class="control">
                <a
                @click="showMap()"
                :class="[ 'button', 'has-text', 'var--gus-button-media' ]"
                :style="mapButtonStyle(mapVisible)">
                  View Map
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import GoogleMap from '../GoogleMap'
import GallerySlider from './GallerySlider'

export default {
  name: 'gallery',

  components: {
    GoogleMap,
    GallerySlider
  },

  props: {
    listing: { type: Object, required: true },
    strap: { type: Object, required: true }
  },

  computed: {
    mobile () {
      return window.innerWidth < 1024
    },

    mapStyles () {
      const y = this.$data.mapVisible ? 0 : 100

      return {
        transform: `translateY(${y}%)`
      }
    },

    hasAdditionalLinks () {
      if (!this.listing.additionalLinks) return false
      let howMany = Object.keys(this.listing.additionalLinks).length
      if (howMany) return true
      return false
    },

    hasImages () {
      if (this.$store.state.editing) return true

      if (
        (this.listing.images &&
        this.listing.images.length) ||
        (this.listing.publicInfo.additionalMedia &&
        this.listing.publicInfo.additionalMedia.length)
      ) return true

      return false
    }
  },

  methods: {
    mapButtonStyle (active) {
      if (active) {
        const palette = this.$store.getters.palette(this.strap.config.style.theme)

        return {
          backgroundColor: palette.uiPrimary.bgColor,
          color: palette.uiPrimary.textColor
        }
      }

      return {}
    },

    showMap () {
      this.mapVisible = true
      this.loadMap = true
    }
  },

  data () {
    return {
      mapVisible: false,
      loadMap: false,
    }
  },

  created () {
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

.listing-gallery
  position: relative
  display: flex
  flex-direction: column
  width: 100%
  height: 35vw
  min-height: 300px
  max-height: 600px
  overflow: hidden

.map-outer,
.gallery-outer
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.map-outer
  z-index: 2
  background-color: $mapColor
  transition: transform 350ms ease-in-out

.gallery-outer
  z-index: 1

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
  +mobile
    height: 32px
    width: 40px
    font-size: 16px
    i
      font-size: 18px

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
