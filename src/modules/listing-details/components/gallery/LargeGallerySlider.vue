<template>
  <div class="slider-outer">
    <!-- Carousel -->

    <touch-carousel
      @currentIndex="changeIndex($event)"
      ref="carousel"
      class="slider"
    >
      <template v-for="(item, i) in media">
        <touch-carousel-slide
          v-if="typeof item === 'string'"
          :index="i"
          :key="i"
          class="slider-slide__image"
        >
          <div
            :class="[
              'slider-slide__image-inner',
              currentIndex === i ? 'is-selected' : ''
            ]"
            @click="$emit('image-clicked')"
          >
            <div class="title sold-listing__banner" v-if="isSold">
              SOLD
            </div>
            <large-touch-carousel-image
              :index="i"
              :src="item"
              :error-image="errorImage"
            />
          </div>
        </touch-carousel-slide>

        <touch-carousel-slide
          v-else-if="item.type === 'image'"
          :index="i"
          :key="i"
          class="slider-slide__image"
        >
          <div class="ws-ui" v-if="$store.state.editing">
            <button class="button is-primary" @click="openEditImage(item)">
              <span>Click to Edit</span>
            </button>
          </div>
          <div
            :class="[
              'slider-slide__image-inner',
              currentIndex === i ? 'is-selected' : ''
            ]"
          >
            <div class="title sold-listing__banner" v-if="isSold">
              SOLD
            </div>
            <large-touch-carousel-image
              :index="i"
              :src="item.data.imageUrl"
              :style="item.data.imageUrl"
              :error-image="errorImage"
            />
          </div>
        </touch-carousel-slide>

        <touch-carousel-slide
          v-else-if="item.type === 'video'"
          :index="i"
          :key="i"
          class="slider-slide__other"
        >
          <div class="ws-ui" v-if="$store.state.editing">
            <button class="button is-primary" @click="openEditVideo(item)">
              <span>Click to Edit</span>
            </button>
          </div>
          <div
            :class="[
              'slider-slide__other-inner',
              'is-video',
              currentIndex === i ? 'is-selected' : ''
            ]"
          >
            <div class="title sold-listing__banner" v-if="isSold">
              SOLD
            </div>
            <youtube-video
              :url="item.data.url"
              :highres="true"
              class="youtube-video"
            />
          </div>
        </touch-carousel-slide>

        <touch-carousel-slide
          v-else
          :index="i"
          :key="i"
          class="slider-slide__other"
        >
          <div class="ws-ui" v-if="$store.state.editing">
            <button class="button is-primary" @click="openEditHtml(item)">
              <span>Click to Edit</span>
            </button>
          </div>
          <div
            :class="[
              'slider-slide__other-inner',
              'is-other',
              currentIndex === i ? 'is-selected' : ''
            ]"
          >
            <div class="title sold-listing__banner" v-if="isSold">
              SOLD
            </div>
            <postscribe-html :html="item.data.html" />
          </div>
        </touch-carousel-slide>
      </template>
    </touch-carousel>

    <!-- Controls -->

    <div class="slider-controls">
      <div class="controls-underlay var--gus-media-grad"></div>
      <div>
        <div class="controls-inner">
          <div class="controls-right" v-if="$refs.carousel">
            <!-- Media edit UI -->

            <div
              class="field ws-ui"
              v-if="$store.state.editing"
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
                      >Add Image</a
                    >
                    <a
                      class="dropdown-item"
                      @click="addVideo(), (showAddMedia = false)"
                      >Add Video</a
                    >
                    <a
                      class="dropdown-item"
                      @click="addOther(), (showAddMedia = false)"
                      >Add Other</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import YoutubeVideo from '@/components/YouTubeVideo'
import TouchCarousel from '@/components/LargeTouchCarousel'
import PostscribeHtml from '@/components/PostscribeHtml'
import LargeTouchCarouselImage from '@/components/LargeTouchCarouselImage'
import TouchCarouselSlide from '@/components/LargeTouchCarouselSlide'
import defaultHtml from '@/store/defaults/components/html'
import defaultImage from '@/store/defaults/components/image'
import defaultYoutubeVideo from '@/store/defaults/components/youtubeVideo'

export default {
  name: 'GallerySlider',

  components: {
    YoutubeVideo,
    TouchCarousel,
    PostscribeHtml,
    LargeTouchCarouselImage,
    TouchCarouselSlide
  },

  props: {
    listing: {type: Object, required: true},
    currentIndex: {type: Number, required: true},
    isSold: {type: Boolean, required: true}
  },

  data() {
    return {
      publicInfo: this.listing.publicInfo,
      saveHandler: undefined,
      showAddMedia: false
    }
  },

  computed: {
    media() {
      if (!this.listing) return []
      return this.publicInfo.additionalMedia.concat(this.listing.images)
    },

    mobile() {
      return window.innerWidth < 768
    },

    errorImage() {
      return this.$store.state.website.theme.dark
        ? require('../../../../assets/images/404-dark.png')
        : require('../../../../assets/images/404-light.png')
    }
  },

  methods: {
    changeIndex(newIndex) {
      this.$emit('changeIndex', newIndex)
    },

    updateIndex() {
      var index = this.$refs.carousel.currentIndex
      var listingImageLength = this.media.length

      //checks for proper index
      if (index < 0) {
        this.$emit('changeIndex', listingImageLength - 1)
      } else if (index > listingImageLength + 1) {
        this.$emit('changeIndex', 0)
      } else {
        this.$emit('changeIndex', this.$refs.carousel.currentIndex)
      }
    },

    checkIndex() {
      this.$nextTick(() => {
        const {carousel} = this.$refs

        if (carousel.currentIndex > this.media.length - 1) {
          carousel.currentIndex = this.media.length - 1
        }
      })
    },

    addImage() {
      const image = {type: 'image', data: defaultImage()}
      this.publicInfo.additionalMedia.push(image)
      this.$store.dispatch('startEditing')

      const {carousel} = this.$refs

      this.$nextTick(() => {
        carousel.currentIndex = this.publicInfo.additionalMedia.length - 1
        carousel.reloadSlides()
      })
    },

    addVideo() {
      const video = {type: 'video', data: defaultYoutubeVideo()}
      this.publicInfo.additionalMedia.push(video)
      this.$store.dispatch('startEditing')

      const {carousel} = this.$refs

      this.$nextTick(() => {
        carousel.currentIndex = this.publicInfo.additionalMedia.length - 1
        carousel.reloadSlides()
      })
    },

    addOther() {
      const other = {type: 'other', data: defaultHtml()}
      this.publicInfo.additionalMedia.push(other)
      this.$store.dispatch('startEditing')

      const {carousel} = this.$refs

      this.$nextTick(() => {
        carousel.currentIndex = this.publicInfo.additionalMedia.length - 1
        carousel.reloadSlides()
      })
    },

    openEditImage(item) {
      if (!this.$store.state.editing) return

      const id = 1
      const value = item.data
      const keyName = this.publicInfo.additionalMedia.indexOf(item)

      const schema = {
        title: 'Image',
        canDelete: true,
        fields: [
          {
            key: 'imageUrl',
            type: 'image',
            label: 'Image URL',
            default: ''
          }
        ]
      }

      const onChange = newValue => {
        this.$store.dispatch('startEditing')
        value[newValue.keyName] = newValue.value
      }

      const onDelete = () => {
        this.$store.dispatch('startEditing')
        this.publicInfo.additionalMedia.splice(keyName, 1)

        this.checkIndex()
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value,
        schema,
        keyName,
        onChange,
        onDelete
      })
    },

    openEditVideo(item) {
      if (!this.$store.state.editing) return

      const id = 1
      const value = item.data
      const keyName = this.publicInfo.additionalMedia.indexOf(item)

      const schema = {
        title: 'YouTube Video',
        canDelete: true,
        fields: [
          {
            key: 'url',
            type: 'text',
            label: 'Video URL',
            default: ''
          }
        ]
      }

      const onChange = newValue => {
        this.$store.dispatch('startEditing')
        value[newValue.keyName] = newValue.value
      }

      const onDelete = () => {
        this.$store.dispatch('startEditing')
        this.publicInfo.additionalMedia.splice(keyName, 1)

        this.checkIndex()
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value,
        schema,
        keyName,
        onChange,
        onDelete
      })
    },

    openEditHtml(item) {
      if (!this.$store.state.editing) return

      const id = 1
      const value = item.data
      const editValue = {...item.data, html: decodeURI(item.data.html)}
      const keyName = this.publicInfo.additionalMedia.indexOf(item)

      const schema = {
        title: 'Other',
        canDelete: true,
        fields: [
          {
            key: 'html',
            type: 'multiText',
            label: 'HTML',
            default: ''
          }
        ]
      }

      const onChange = newValue => {
        this.$store.dispatch('startEditing')
        value[newValue.keyName] = encodeURI(newValue.value)
      }

      const onDelete = () => {
        this.$store.dispatch('startEditing')
        this.publicInfo.additionalMedia.splice(keyName, 1)

        this.checkIndex()
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value: editValue,
        schema,
        keyName,
        onChange,
        onDelete
      })
    },

    onSave(e) {
      api
        .putPublicInfo(this.$store.state, this.listing.id, this.publicInfo)
        .then(res => {
          if (res.status !== 200) {
            const err = new Error(
              `Error saving public information. (${res.status})`
            )
            console.warn(err)
          }
        })
        .catch(err => {
          console.warn(err)
        })
    }
  },

  created() {
    if (process.browser) {
      this.saveHandler = this.onSave.bind(this)
      this.$store.on('savePage', this.saveHandler)
    }
  },

  destroyed() {
    if (process.browser) {
      this.$store.off('savePage', this.saveHandler)
    }
  },

  watch: {
    currentIndex(nextIndex, currentIndex) {
      this.$refs.carousel.currentIndex = nextIndex
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

$mediaColor: #303841
$mediaTextColor: #ffffff

.slider-outer
  position: relative
  z-index: 1
  height: 100%
  width: 100%
  outline: none !important

.slider
  width: 100%
  height: 100%
  padding-top: 4px
  overflow: hidden

/deep/
  .touch-carousel__slide
    padding: 0 !important
    width: 100%
    height: 100%
    pointer-events: auto

.slider-slide__image-inner,
.slider-slide__other-inner
  height: 100%
  position: relative

.slider-slide__image-inner,
.slider-slide__other-inner
  opacity: 0.6
  &.is-selected
    opacity: 1

/deep/
  .slider-slide__other-inner
    margin: auto
    display: flex
    position: relative
    > div
      margin: auto
    &.is-video
      background: $mediaColor
      height: 100%
      width: 100vw

    &.is-other
      background: rgba($mediaColor, 0.05)
      > div,
      .postscribe-html__inner
        width: 100vw
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

    .button
      margin: auto
      width: auto
      cursor: pointer

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
      top: 4px
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
  color: #fff

  i,
  span
    display: inline-flex
    height: 48px
    line-height: 48px

  i
    padding: 0 4px

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

.sold-listing__banner
  user-select: none
  position: absolute
  z-index: 2
  box-shadow: 0px 0px 5px 3px #ffffff4d
  text-shadow: 0px 0px 5px white
  border: none
  background: #d10a53
  +mobile
    padding: 0.1rem 0.1rem 0.1rem 0.5rem
    top: 1rem
    left: 0
    width: 60px
    font-size: 15px
    border-radius: 0 5px 5px 0
  +tablet
    padding: 0.2rem 0.2rem 0.2rem 0.5rem
    top: 1.5rem
    left: 0
    width: 90px
    font-size: 20px
    border-radius: 0 8px 8px 0
  +desktop
    padding: 0.3rem 0.3rem 0.3rem 1rem
    top: 3rem
    left: 0
    width: 140px
    font-size: 30px
    border-radius: 0 10px 10px 0
  +widescreen
    padding: 0.3rem 0.3rem 0.3rem 1rem
    top: 3rem
    left: 0
    width: 140px
    font-size: 30px
    border-radius: 0 10px 10px 0
</style>
