<template>
  <div :class="`summery-gallery__containner ${containnerClass}`">
    <div :class="`summery-gallery-outer ${images.length === 0 ? 'padding-bottom-50vh' : ''} ${(images.length === 0 && !showMap) ? 'padding-bottom-0' : ''}`">
      <!-- Gallery -->
      <div class="summery-gallery__images" v-if="images.length > 0">
        <div class="summery-gallery__image-left">
          <img
            v-if="images[0]"
            @click="toggleGallery(0)"
            class="left-item-img"
            :src="images[0]"
            :alt="getAltTag(1)"
          />
          <div v-else class="left-item-svg position-relative">
            <div class="item__noimage-wrapper"><NoResults /></div>
          </div>
        </div>

        <div class="summery-gallery__image-right">
          <div class="right-img__div border-top-mobile">
            <div class="side-img__div border-left-desktop">
              <img
                v-if="images[1]"
                class="side-img__child"
                :src="images[1]"
                @click="toggleGallery(1)"
                :alt="getAltTag(2)"
              />
              <div v-else>
                <div class="item__noimage-wrapper"><NoResults /></div>
              </div>
            </div>
            <div class="side-img__div border-left">
              <img
                v-if="images[2]"
                class="side-img__child hide-mobile"
                :src="images[2]"
                @click="toggleGallery(2)"
                :alt="getAltTag(3)"
              />
              <div v-else class="hide-mobile">
                <div class="item__noimage-wrapper"><NoResults /></div>
              </div>
              <div
                class="show-mobile"
                @click="toggleGallery(2)"
              >
                <img
                  v-if="images[2]"
                  :src="images[2]"
                  class="side-img__child"
                  :alt="getAltTag(3)"
                />
                <div v-else class="item__noimage-wrapper"><NoResults /></div>
                <div class="summery-gallery__imgcount" v-if="images.length - 2 > 0">
                  + {{ images.length - 2 }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-img__div border-top hide-mobile">
            <div class="side-img__div border-left-desktop">
              <img
                v-if="images[3]"
                class="side-img__child"
                :src="images[3]"
                @click="toggleGallery(3)"
                :alt="getAltTag(4)"
              />
              <div v-else>
                <div class="item__noimage-wrapper"><NoResults /></div>
              </div>
            </div>
            <div class="side-img__div border-left">
              <img
                v-if="images[4]"
                :src="images[4]"
                @click="toggleGallery(4)"
                class="side-img__child"
                :alt="getAltTag(5)"
              />
              <div v-else class="item__noimage-wrapper"><NoResults /></div>
              <div
                v-if="images.length - 4 > 0"
                class="summery-gallery__imgcount"
                @click="toggleGallery(4)"
              >
                + {{ images.length - 4 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div v-if="listing.location && loadMap">
        <div
          class="map-outer"
          :style="mapStyles"
        >
          <google-map :center="{lat: listing.location.lat, lng: listing.location.lon}" />
        </div>
      </div>
    </div>

    <!-- Toggle buttons -->
    <div
      class="summery-gallery__selection"
      v-if="listing.location || images.length > 0 || videos.length > 0 || others.length > 0 || hasAdditionalLinks"
    >
      <a
        v-if="listing.location"
        @click="toggleMap"
        class="toggle-button"
      >
        <span class="icon icon-map-marker"></span> Map
      </a>
      <template v-if="hasAdditionalLinks">
        <a
          v-for="addLinkKey in Object.keys(listing.additionalLinks)"
          :href="listing.additionalLinks[addLinkKey]"
          :key="`additional-link__${addLinkKey}`"
          class="toggle-button"
          target="_blank"
        >
          <i :class="addLinkIcon(addLinkKey)"></i>
          {{ addLinkKey }}
        </a>
      </template>
      <a
        v-if="images.length > 0"
        @click="toggleGallery(0)"
        class="toggle-button"
      >
        <Photo />
        {{ images.length }} Photos
      </a>
      <a
        v-if="videos.length > 0"
        @click="toggleGallery(images.length - 1)"
        class="toggle-button"
      >
        <Video />
        {{ videos.length }} Videos
      </a>
      <a
        v-if="others.length > 0"
        @click="toggleGallery(images.length + videos.length - 1)"
        class="toggle-button"
      >
        <i class="icon-paper-clip"></i>
        {{ others.length }} Others
      </a>
    </div>

    <!-- Controls -->
    <div :class="`slider-controls ${images.length > 0 ? '' : 'set-default-height'}`" v-if="$store.state.editing">
      <div class="controls-underlay var--gus-media-grad"></div>
      <div>
        <div class="controls-inner">
          <div class="controls-right">
            <!-- Media edit UI -->

            <div
              class="field ws-ui"
              style="background:transparent"
            >
              <div
                :class="[
                  'dropdown',
                  showAddMedia && 'is-active',
                  'is-right',
                  'is-up'
                ]"
              >
                <div class="dropdown-trigger">
                  <div
                    class="button is-primary"
                    :style="{width: 'auto', border: 'none'}"
                    @click="showAddMedia = !showAddMedia"
                  >
                    <span class="icon">
                      <i class="icon-plus"></i>
                    </span>
                    <span>Add Media</span>
                  </div>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    <a
                      class="dropdown-item"
                      @click="addImage(), (showAddMedia = false)"
                    >Add Image</a>
                    <a
                      class="dropdown-item"
                      @click="addVideo(), (showAddMedia = false)"
                    >Add Video</a>
                    <a
                      class="dropdown-item"
                      @click="addOther(), (showAddMedia = false)"
                    >Add Other</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sold Marker -->
    <div v-if="isSoldResult" class="is-sold-marker">
      <h1 class="title is-5 var--gus-title">SOLD</h1>
    </div>
  </div>
</template>

<script>
import GoogleMap from '@/modules/listing-details/components/GoogleMap'
import NoResults from '@/modules/listing-search/components/Results/NoResults'
import defaultHtml from '@/store/defaults/components/html'
import defaultImage from '@/store/defaults/components/image'
import defaultYoutubeVideo from '@/store/defaults/components/youtubeVideo'
import Photo from '@/modules/listing-details/components/SVG/Photo'
import Video from '@/modules/listing-details/components/SVG/Video'

export default {
  name: 'SummeryGallery',

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

  components: {
    GoogleMap,
    NoResults,
    Photo,
    Video,
  },

  data: () => ({
    loadMap: false,
    showMap: false,
    showAddMedia: false,
  }),

  computed: {
    hasAdditionalLinks() {
      if (this.$store.state.editing) return false
      if (!this.listing.additionalLinks) return false
      let howMany = Object.keys(this.listing.additionalLinks).length
      if (howMany) return true
      return false
    },

    images() {
      if (this.listing.publicInfo.additionalMedia || this.listing.images)
        return this.listing.images.concat(this.listing.publicInfo.additionalMedia.filter(media => media.type === 'image').map(img => img.data.imageUrl))

      return []
    },

    videos() {
      if (this.listing.publicInfo.additionalMedia)
        return this.listing.publicInfo.additionalMedia.filter(media => media.type === 'video')

      return []
    },

    others() {
      if (this.listing.publicInfo.additionalMedia)
        return this.listing.publicInfo.additionalMedia.filter(media => media.type === 'other')

      return []
    },

    mapClass() {
      if (this.showMap) {
        return this.images.length > 0 ? 'show-google-map' : 'show-google-map-only'
      } else {
        return 'hide-google-map'
      }
    },

    containnerClass() {
      if (this.showMap && this.images.length === 0) {
        return 'height-50'
      } else {
        return ''
      }
    },

    isSoldResult() {
      return this.$route.path.split('/')[1] === 'sold'
    },

    mapStyles() {
      const y = this.showMap ? 0 : 100

      return {
        transform: `translateY(${y}%)`
      }
    },

    postalCode() {
      if (!this.listing.additionalDetails) return false
      let postalCode = ''
      this.listing.additionalDetails.map(additionalDetail => {
        additionalDetail.details.map(detail => {
          if (Object.keys(detail)[0] === 'Postal Code') {
            postalCode = detail['Postal Code']
          }
        })
      })
      return postalCode
    },
  },

  mounted() {
    this.initDetailsModalState()
  },

  methods: {
    initDetailsModalState() {
      const result = {
        searchResult: Object.assign({}, this.listing),
        strap: Object.assign({}, this.strap)
      }
      this.$store.commit('SET_NEW_LISTING_DETAILS_SEARCH_RESULT', result)
    },

    toggleMap() {
      this.loadMap = true
      this.showMap = !this.showMap
    },

    toggleGallery(id) {
      this.$store.commit('SET_NEW_LISTING_DETAILS_MODAL_IMG_ID', id)
      this.$store.commit('SHOW_NEW_LISTING_DETAILS_MODAL')
    },

    addImage() {
      const image = {type: 'image', data: defaultImage()}
      this.listing.publicInfo.additionalMedia.push(image)
      this.initDetailsModalState()
      this.toggleGallery(this.images.length - 1)
      this.$store.dispatch('startEditing')
    },

    addVideo() {
      const video = {type: 'video', data: defaultYoutubeVideo()}
      this.listing.publicInfo.additionalMedia.push(video)
      this.initDetailsModalState()
      this.toggleGallery(this.images.length + this.videos.length - 1)
      this.$store.dispatch('startEditing')
    },

    addOther() {
      const other = {type: 'other', data: defaultHtml()}
      this.listing.publicInfo.additionalMedia.push(other)
      this.initDetailsModalState()
      this.toggleGallery(this.images.length + this.videos.length + this.others.length - 1)
      this.$store.dispatch('startEditing')
    },

    addLinkIcon(addLinkKey) {
      if (addLinkKey === 'Audio Tour') return 'icon-bullhorn'
      if (addLinkKey === 'Video Tour') return 'icon-facetime-video'
      return 'icon-link'
    },

    getAltTag(order) {
      const keys = ['address', 'neighbourhood', 'city', 'province']
      const suffix = []
      keys.map(key => {
        if (this.listing[key]) {
          suffix.push(this.listing[key])
        }
      })
      if (this.postalCode !== '') {
        suffix.push(this.postalCode)
      }
      switch(order) {
        case 1: {
          return `Main View of ${suffix.join(', ')}`
        }
        case 2: {
          return `Second View of ${suffix.join(', ')}`
        }
        case 3: {
          return `Third View of ${suffix.join(', ')}`
        }
        case 4: {
          return `Fourth View of ${suffix.join(', ')}`
        }
        case 5: {
          return `Fifth View of ${suffix.join(', ')}`
        }
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

$mapColor: #efebe2

.summery-gallery__containner
  height: 100%
  position: relative

.summery-gallery__images
  position: absolute
  top: 0px
  left: 0px
  width: 100%
  height: 100%
  display: flex
  @media (max-width: 768px)
    display: block

.summery-gallery__imgcount
  position: absolute
  background-color: #0000004d
  top: 0
  width: 100%
  height: 100%
  color: white
  font-size: 40px
  font-weight: 700
  display: flex
  align-items: center
  justify-content: center

.summery-gallery__selection
  position: absolute
  bottom: -1.5rem
  right: 10rem
  text-align: center
  align-items: center
  display: inline-flex
  vertical-align: top
  padding: 10px 20px
  height: 52px
  background-color: rgb(255, 255, 255)
  box-shadow: #00000026 0px 6px 12px 0px
  border-radius: 26px
  cursor: pointer
  z-index: 2
  svg
    margin-right: 5px
  .toggle-button
    margin: 0px
    width: auto
    overflow: visible
    white-space: nowrap
    color: inherit
    background: transparent
    border: none
    user-select: none
    appearance: none
    -webkit-tap-highlight-color: transparent
    display: flex
    -webkit-box-align: center
    align-items: center
    padding: 0px 10px
    font-size: 14px
    line-height: 24px
    border-right: 1px solid #b7c1d2
    outline: none
    cursor: pointer
  .toggle-button:last-of-type
    border-right: none
  @media (max-width: 768px)
    padding: 10px 15px
    bottom: -1rem
    left: 0
    right: 0
    margin-left: auto
    margin-right: auto
    width: fit-content
    height: 2.5rem
    max-width: 95%
    overflow-y: hidden
    overflow-x: auto
    .toggle-button
      padding: 0 3px


.summery-gallery__image-left, .summery-gallery__image-right
  position: relative
  overflow: hidden
  float: left
  border-color: rgb(255, 255, 255)
  border-width: 8px
  cursor: zoom-in
  width: 50%
  min-width: 50%
  height: 100%

.summery-gallery__image-left
  @media (max-width: 768px)
    height: 66.66%
    width: 100%
.summery-gallery__image-right
  @media (max-width: 768px)
    height: 33.33%
    width: 100%
    .right-img__div
      display: flex
      height: 100%

.left-item-img
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  height: 100%
  position: absolute !important
  vertical-align: middle
  max-width: unset

.side-img__div
  position: relative
  overflow: hidden
  float: left
  width: 50%
  height: 100%
  border-color: rgb(255, 255, 255)
  border-width: 8px
  cursor: zoom-in
  img
    max-width: unset
  
.side-img__child
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  height: 100%
  position: absolute !important
.border-top
  border-top: 5px solid white
.border-top-mobile
  @media (max-width: 768px)
    border-top: 5px solid white
.border-left
  border-left: 5px solid white
.border-left-desktop
  @media (min-width: 769px)
    border-left: 5px solid white

.right-img__div
  display: flex
  height: 50%

.position-relative
  position: relative

.show-google-map
  display: block
.hide-google-map
  display: none
.show-google-map-only
  height: 50vh

.hide-mobile
  @media (max-width: 768px)
    display: none !important
.show-mobile
  display: none !important
  @media (max-width: 768px)
    width: 100%
    display: flex !important

.item__noimage-wrapper
  text-align: center
  filter: grayscale(1)
  opacity: 0.3
  display: flex
  justify-content: center
  align-items: center
  height: 100%
  position: absolute
  top: 0
  left: 0
  width: 100%

  svg
    width: 100%
    height: auto

.height-50
  height: 50vh

.slider-controls
  position: absolute
  z-index: 2
  bottom: 0
  right: 0
  width: 100%
  height: 100%

.controls-underlay
  position: absolute
  pointer-events: none
  z-index: 1
  height: 40%
  left: 0
  right: 0
  bottom: 0

  + div
    position: relative
    z-index: 2
    width: 100%
    height: 100%

.controls-inner
  position: relative
  display: flex
  justify-content: flex-end
  width: 100%
  height: 100%
  padding: 30px 50px

  +mobile
    padding: 20px

.controls-right
  align-self: flex-end

  +mobile
    display: none

.is-sold-marker
  background: linear-gradient(52.6deg, var(--default-uiPrimary-bgColor) 0%, var(--default-uiSecondary-bgColor) 100%)
  height: 80px
  width: 80px
  border-radius: 50%
  padding: 8px
  position: absolute
  bottom: -40px
  left: 70px
  z-index: 2
  h1
    background: white
    display: flex
    align-items: center
    justify-content: center
    height: 100%
    width: 100%
    border-radius: 50%
  @media (max-width: 768px)
    top: 10px
    right: 10px
    left: unset
    bottom: unset

.set-default-height
  height: 50vh
  position: unset
  background-color: rgb(248, 248, 248)

.summery-gallery-outer
  position: relative
  user-select: none
  padding-bottom: 35%
  display: block
  overflow: hidden
  background-color: #0000001c
  transition: .5s
  @media (max-width: 768px)
    padding-bottom: 90%

.map-outer
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 2
  background-color: $mapColor
  transition: transform 350ms ease-in-out

.padding-bottom-0
  padding-bottom: 0 !important
.padding-bottom-50vh
  padding-bottom: 50vh
</style>