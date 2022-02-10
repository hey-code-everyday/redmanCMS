<template>
  <img
    v-if="ready"
    ref="image"
    class="touch-carousel-image --before-enter"
    draggable="false"
    :src="imageSrc"
    @load="imageLoad"
    @error="imageError"
    :style="{ width: scaledWidth + 'px' }"
  />
</template>

<script>
export default {
  inject: [ '$carousel' ],

  props: {
    src: {
      type: String
    },

    index: {
      type: [ Number, undefined ],
      default: undefined
    },

    errorImage: {
      type: [ String, undefined ],
      default: undefined
    }
  },

  computed: {
    currentIndex () {
      return this.$carousel.currentIndex
    },

    placeholderSrc () {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    }
  },

  data () {
    return {
      ready: false,
      scaledWidth: 0,
      imageSrc: this.placeholderSrc,
      hasFailed: false
    }
  },

  methods: {
    imageLoad () {
      this.$carousel.reloadSlides()

      this.$nextTick(() => {
        this.$el.classList.remove('--before-enter')
      })
    },

    imageError (err) {
      console.warn(err)

      if (!this.hasFailed && this.errorImage) {
        this.hasFailed = true
        this.imageSrc = this.errorImage
      }
    },

    loadImage () {
      const { index, currentIndex } = this

      if (index === undefined || (index <= currentIndex + 4 && index >= currentIndex - 4)) {
        this.imageSrc = this.src
      }

      const img = new Image()

      img.onload = () => {
        const width = img.width
        const height = img.height
        const scale = this.$carousel.height / height

        this.scaledWidth = width * scale

        this.ready = true
      }

      img.src = this.src
    }
  },

  mounted () {
    this.loadImage()
  },

  watch: {
    currentIndex (newValue, oldValue) {
      if (newValue === oldValue) return
      this.loadImage()
    },

    src (newValue, oldValue) {
      if (newValue === oldValue) return
      this.loadImage()
    }
  }
}
</script>

<style lang="sass" scoped>
.touch-carousel-image
  width: auto
  height: 100%
  margin: auto
  max-width: none
  max-height: none
  min-height: 100%
  align-self: center
  transition: opacity 220ms ease-in-out
  &.--before-enter
    opacity: 0
</style>
