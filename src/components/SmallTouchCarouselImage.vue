<template>
  <img
    ref="image"
    class="touch-carousel-image --before-enter"
    draggable="false"
    :src="imageSrc"
    @load="imageLoad"
    @error="imageError"
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
      
      this.imageSrc = this.src
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
@import '~bulma/sass/utilities/_all'

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
