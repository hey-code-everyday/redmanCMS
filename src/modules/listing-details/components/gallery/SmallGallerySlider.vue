<template>
  <div class="slider-outer">

    <div class="map-button slider-slide__image" v-if="listing.location">
      <div class="slider-slide__image-inner" @click="toggleMap">
        <img :src="mapThumbnail" />
        <div class="map-marker">
          <span class="icon icon-map-marker"></span>
          <span class="map-marker-text">Map</span>
        </div>
      </div>
    </div>

    <div class="additional-links" v-if="hasAdditionalLinks">
      <template v-for="(item, i) in additionalLinks">
        <a :href="item.url" target="_blank"><span>
        {{item.name}}</span></a>
      </template>
    </div>

    <div class="control-left">
      <button class="button is-primary" @click="nextPrevClicked(currentIndexBig-1)">
        <span class="icon icon-chevron-left"></span>
      </button>
    </div>

    <!-- Carousel -->
    <touch-carousel ref="carousel" class="slider">
      <template v-for="(item, i) in media">

        <small-touch-carousel-slide v-if="typeof item === 'string'" :index="i" :key="i" class="slider-slide__image">
          <div ref="slide" class="slider-slide__image-inner" @click="updateIndex(i)">
            <div v-if="currentSelected != i" class="inactive-overlay"></div>
            <div v-else class="active-overlay"></div>
            <touch-carousel-image :index="i" :src="item" :error-image="errorImage" />
          </div>
        </small-touch-carousel-slide>

        <small-touch-carousel-slide v-else-if="item.type === 'image'" :index="i" :key="i" class="slider-slide__image">
          <div ref="slide" class="slider-slide__image-inner" @click="updateIndex(i)">
            <div v-if="currentSelected != i" class="inactive-overlay"></div>
            <div v-else class="active-overlay"></div>
            <touch-carousel-image :index="i" :src="item.data.imageUrl" :error-image="errorImage" />
          </div>
        </small-touch-carousel-slide>

        <small-touch-carousel-slide v-else-if="item.type === 'video'" :index="i" :key="i" class="slider-slide__other">
          <div ref="slide" class="small-slider-slide__other-inner is-video" @click="updateIndex(i)">
            <div v-if="currentSelected != i" class="inactive-overlay"></div>
            <div v-else class="active-overlay"></div>
            <span class="icon-code"></span>
          </div>
        </small-touch-carousel-slide>

        <small-touch-carousel-slide v-else :index="i" :key="i" class="slider-slide__other">
          <div ref="slide" class="small-slider-slide__other-inner is-other" @click="updateIndex(i)">
            <div v-if="currentSelected != i" class="inactive-overlay"></div>
            <div v-else class="active-overlay"></div>
            <span class="icon-code"></span>
          </div>
        </small-touch-carousel-slide>

      </template>
    </touch-carousel>

    <div class="control-right">
      <button class="button is-primary" @click="nextPrevClicked(currentIndexBig+1)">
        <span class="icon icon-chevron-right"></span>
      </button>
    </div>

  </div>
</template>

<script>
import api from '@/api'
import YoutubeVideo from '@/components/SmallYouTubeVideo'
import TouchCarousel from '@/components/SmallTouchCarousel'
import PostscribeHtml from '@/components/PostscribeHtml'
import TouchCarouselImage from '@/components/SmallTouchCarouselImage'
import SmallTouchCarouselSlide from '@/components/SmallTouchCarouselSlide'
import defaultHtml from '@/store/defaults/components/html'
import defaultImage from '@/store/defaults/components/image'
import defaultYoutubeVideo from '@/store/defaults/components/youtubeVideo'
// import CustomModalImage from '@/components/ui/modals/custom/CustomModalImage'

import constants from 'listing-details@/config/constants'
const googleMaps = constants.config.api.googleMaps

export default {
  name: 'GallerySlider',

  components: {
    YoutubeVideo,
    TouchCarousel,
    PostscribeHtml,
    TouchCarouselImage,
    SmallTouchCarouselSlide
  },

  props: {
    listing: { type: Object, required: true },
    currentIndex: { type: Number, required: true },
    currentIndexBig: { type: Number, required: true },
    currentSelected: { type: Number, required: true }
  },

  data () {
    return {
      publicInfo: this.listing.publicInfo,
      saveHandler: undefined,
      showAddMedia: false,
    }
  },

  computed: {
    media () {
      if (!this.listing) return []
      return this.publicInfo.additionalMedia.concat(this.listing.images)
    },
    hasAdditionalLinks () {
      if (!this.listing.additionalLinks) return false
      let howMany = Object.keys(this.listing.additionalLinks).length
      if (howMany) return true
      return false
    },
    additionalLinks () {
      const addLinks = this.listing.additionalLinks
      const links = Object.keys(this.listing.additionalLinks).map(function (name) {
         const url = addLinks[name]
         return {name, url}
      })
      return links
    },
    mobile () {
      return window.innerWidth < 768
    },

    errorImage () {
      return this.$store.state.website.theme.dark
        ? require('../../../../assets/images/404-dark.png')
        : require('../../../../assets/images/404-light.png')
    },

    mapThumbnail () {
      // if (!this.listing.location) return ''
      //
      // const { lat, lon } = this.listing.location
      // const center = `center=${lat},${lon}`
      //
      // const url = 'https://maps.googleapis.com/maps/api/staticmap'
      // return `${url}?${center}&zoom=13&size=150x150&maptype=roadmap&key=${googleMaps.key}`

      return require('../../../../assets/images/map-green.png')
    }
  },

  methods: {
    updateIndex (index) {
      this.$emit('changeIndex', index)
    },

    nextPrevClicked (index) {
      this.$emit('nextPrevClicked', index)
    },

    checkIndex () {
      this.$nextTick(() => {
        const { carousel } = this.$refs
        if (carousel.currentIndex > this.media.length - 1) {
          carousel.currentIndex = this.media.length - 1
        }
      })
    },

    onSave (e) {
      api.putPublicInfo(this.$store.state, this.listing.id, this.publicInfo).then(res => {
        if (res.status !== 200) {
          const err = new Error(`Error saving public information. (${res.status})`)
          console.warn(err)
        }
      }).catch(err => {
        console.warn(err)
      })
    },

    toggleMap () {
      this.$emit('toggleMap')
    }
  },

  created () {
    if (process.browser) {
      this.saveHandler = this.onSave.bind(this)
      this.$store.on('savePage', this.saveHandler)
    }
  },

  destroyed () {
    if (process.browser) {
      this.$store.off('savePage', this.saveHandler)
    }
  },

  watch: {
    currentIndex (nextIndex, currentIndex) {
      this.$refs.carousel.currentIndex = nextIndex
    },

    currentSelected (index) {
      if (index > this.media.length - 1) index = 0
      if (index < 0) index = this.media.length - 1

      if (
        (this.currentIndex === 0 && index === this.media.length - 1) ||
        (this.currentIndex === this.media.length - 1 && index === 0)
      ) {
        this.$emit('changeIndex', index)
        return
      }

      const slide = this.$refs.slide[index]
      const brect = slide.getBoundingClientRect()
      const width = window.innerWidth

      if (brect.left < 0 || brect.right > width) {
        this.$emit('changeIndex', index)
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

$mediaColor: #303841
$mediaTextColor: #ffffff

.inactive-overlay
  background-color: rgba(255,255,255,0.4)
  position: absolute
  width: 100%
  height: 100%

.active-overlay
  content: ''
  display: block
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0
  box-sizing: border-box
  box-shadow: 0 0 0 2px var(--default-bgColor) inset
  border: solid 2px var(--default-uiPrimary-bgColor)

.slider-outer
  position: relative
  z-index: 1
  height: 100%
  width: 100%
  outline: none !important
  display: flex

.control-left,
.control-right
  width: 50px
  min-width: 50px
  padding: 4px
  padding-bottom: 0
  position: relative
  z-index: 1
  .button
    width: 100%
    height: 100%
    padding: 0

.control-right
  margin-left: auto

.slider
  flex: 1
  width: 100%
  height: 100%
  padding-top: 4px
  overflow: hidden

/deep/
  .touch-carousel__slide
    padding: 0px 5px 0 0px !important
    pointer-events: auto

.slider-slide__image-inner
  height: 100%
  max-height: 100%
  position: relative

/deep/
  .small-slider-slide__other-inner
    margin: auto
    width: 10vw
    height: 100%
    display: flex
    position: relative
    > span
      display: block
      color: var(--default-uiPrimary-text)
      background: var(--default-uiPrimary-bgColor)
      margin: auto
      padding: 0.5rem
      border-radius: 100px
    > div
      margin: auto
    &.is-video
      background: $mediaColor
    &.is-other
      background: rgba($mediaColor, 0.05)
      > div,
      .postscribe-html__inner
        width: 100%
        height: 100%

.slider-slide__image,
.slider-slide__other
  .ws-ui
    position: absolute
    z-index: 4
    display: flex
    top: 0
    left: 0
    width: 100%
    height: 100%
    border: dotted 1px $wsRed
    background: rgba($wsRed, 0.05)
    .button
      margin: auto
      width: auto
      cursor: pointer

.field
  pointer-events: auto
  display: inline-flex
  margin-bottom: 0
  vertical-align: bottom

  &.has-addons
    .control
      .button
        position: relative

        &:after
          position: absolute
          content: ''
          top: 0
          right: 0
          bottom: 0
          border-left: solid 1px
          opacity: 0.15

      &:last-child
        .button
          &:after
            display: none

.var--gus-button-media,
.var--gus-button-media:hover,
.var--gus-button-media.is-active
  color: $mediaTextColor !important
  background-color: $mediaColor

/deep/
  .cell-image
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    overflow: hidden
    display: block !important
    img
      height: 100% !important
      width: auto !important

.youtube-video
  border-radius: 0 !important
  position: absolute !important
  top: 50% !important
  transform: translateY(-50%) !important

.map-button
  padding: 4px 0 0 4px
  width: 120px
  img
    width: auto

.map-marker
  position: absolute
  z-index: 2
  top: 45%
  left: 40%
  font-size: 14px
  padding: 5px
  background: var(--default-uiPrimary-bgColor)
  color: var(--default-uiPrimary-text)
  margin: -18px 0 0 -18px
  border-radius: 3px
  pointer-events: none
  box-shadow: 5px 5px 5px grey
  &::before
    position: absolute
    content: ''
    display: block
    width: 0
    height: 0
    bottom: -16px
    left: 50%
    margin-left: -8px
    z-index: 1
    border: solid 8px transparent
    border-top-color: var(--default-uiPrimary-bgColor)

.map-marker-text
  margin-right: 8px


.additional-links 
  display: inline-block 
  vertical-align: middle 
  margin-top: 4px
  background: var(--default-uiPrimary-bgColor)
  
  a
    display: table 
    width: 100% 
    float: left
    color: var(--default-uiPrimary-text)
    width: 100px
    height: 100%
    line-height: 100%
    position: relative
    text-align: center
    border-right: 4px solid #FFF

    &:hover 
       background: var(--default-uiSecondary-bgColor)
    span
     display: table-cell;
     vertical-align: middle;
     text-align: center;
     
</style>
