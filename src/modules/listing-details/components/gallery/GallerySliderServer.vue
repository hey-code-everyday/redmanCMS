<template>
  <div class="slider-outer var--gus-button-media">
    <div class="slider" ref="slider" v-once>
      <img class="slider-cell" v-for="image in listing.images" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" :data-flickity-lazyload="image" />
    </div>
    <div class="slider-controls">
      <div class="controls-underlay var--gus-media-grad"></div>
      <div>
        <div class="controls-inner">

          <div class="controls-right" v-if="listing.images.length > 1">
            <div class="field slide-count var--gus-text-media">
              <span>{{ currentSlideIndex + 1 }}</span>
              <i>/</i>
              <span>{{ last + 1 }}</span>
            </div>
            <div class="field has-addons">
              <p class="control">
                <a
                @click="prevSlide"
                :class="[ 'button', 'var--gus-button-media' ]">
                  <span class="icon is-small">
                    <i class="icon-chevron-left"></i>
                  </span>
                </a>
              </p>
              <p class="control">
                <a
                @click="nextSlide"
                :class="[ 'button', 'var--gus-button-media' ]">
                  <span class="icon is-small">
                    <i class="icon-chevron-right"></i>
                  </span>
                </a>
              </p>
            </div>
          </div>

          <div class="controls-mobile" v-if="listing.images.length > 1">
            <a
            @click="nextSlide"
            :class="[ 'button', 'var--gus-button-media', 'is-next']">
              <span class="icon is-small">
                <i class="icon-chevron-right"></i>
              </span>
            </a>
            <div class="field slide-count var--gus-text-media">
              <span>{{ currentSlideIndex + 1 }}</span>
              <i>/</i>
              <span>{{ last + 1 }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import listingMixin from 'listing-details@/mixins/listing'

export default {
  name: 'gallerySliderServer',

  mixins: [listingMixin],

  props: {
    sliderConfig: {
      type: Object,
      required: false,
      default () {
        return {
          setGallerySize: false,
          pageDots: false,
          prevNextButtons: false,
          imagesLoaded: true,
          cellAlign: 'center',
          wrapAround: true,
          lazyLoad: 3
        }
      }
    }
  },

  data () {
    return {
      slider: null,
      shouldUpdate: true,
      currentSlideIndex: 0
    }
  },

  computed: {
    last () {
      return this.listing.images.length - 1
    },

    first () {
      return 0
    }
  },

  methods: {
    nextSlide () {
    },

    prevSlide () {
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.slider-outer
  position: relative
  z-index: 1
  height: 100%
  width: 100%
  outline: none !important

.slider
  position: absolute
  height: 100%
  width: 100%
  outline: none !important

.slider-cell
  width: auto
  height: 100%
  margin-right: 0
  transition: opacity 250ms
  opacity: 0

  &.flickity-lazyloaded,
  &.flickity-lazyerror
    opacity: 1

  &.is-selected
    &.flickity-lazyloaded,
    &.flickity-lazyerror
      opacity: 1

.slider-controls
  position: absolute
  pointer-events: none
  z-index: 2
  top: 0
  left: 0
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

.controls-left
  margin-right: auto
  align-self: flex-end

.controls-right
  align-self: flex-end

  +mobile
    display: none

.controls-mobile
  z-index: 1
  display: none
  position: absolute
  top: 0
  right: 0
  bottom: 0

  +mobile
    pointer-events: auto
    display: flex

    .button.is-next
      position: absolute
      top: 0
      right: 0
      height: 100%
      border-radius: 0 !important
      opacity: 0.6

  .slide-count
    position: absolute
    z-index: 2
    bottom: 20px
    right: 20px

.button
  height: 48px
  width: 48px
  margin-right: 1px
  border: none

  i
    font-size: 24px

  &.is-active,
  &.is-disabled
    opacity: 0.6

    &:after
      display: none

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

.slide-count
  padding-right: 20px
  font-weight: 600
  text-shadow: 0 0 1px rgba(#000,0.4), 0 0 7px rgba(#000,0.4)

  i,
  span
    display: inline-flex
    height: 48px
    line-height: 48px

  i
    padding: 0 4px
</style>
