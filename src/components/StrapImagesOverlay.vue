<template>
  <div class="strap-images-overlay strap-overlay">
    <button v-if="showButtons" class="left" @click="prevButton">&lang;</button>
    <div class="strap-overlay strap-overlay__inner" :style="innerStyles">
      <div
        v-for="(url, i) in imageUrls"
        :key="i"
        :class="[
          'strap-overlay',
          'strap-overlay-slide',
          'has-image',
          'is-transition-' + transitionEffect,
          (style.bgImage.greyscale ? 'is-greyscale' : false),
          (style.bgImage.repeat ? 'is-repeat' : false),
          (style.bgImage.parallax ? 'is-parallax' : false),
          (style.bgImage.kenburns ? 'is-kenburns' : false)
        ]"
        :style="slideStyles(url, i)"
      >
      </div>
    </div>
    <div v-if="showButtons" class="dotControls">
      <ul>
        <li
          v-for="(url, i) in imageUrls"
          :key="i"
          @click="select(i)"
        >
          <span v-if="selected(i)">&#x25CF;</span>
          <span v-else>&#9675;</span>
        </li>
      </ul>
    </div>
    <button v-if="showButtons" class="right" @click="nextButton">&rang;</button>
  </div>
</template>

<script>
export default {
  props: {
    strap: {
      type: Object,
      required: true
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      interval: null,
      currentIndex: this.initialIndex
    }
  },

  computed: {
    imageUrls () {
      return this.style.bgImage.imageUrls
    },

    palette () {
      return this.$store.getters.palette(this.style.theme)
    },

    style () {
      return this.strap.config.style
    },

    showButtons () {
      console.log(this.transitionEffect)
      if (this.transitionEffect === 'slide-controls') return true
    },

    innerStyles () {
      const { transitionEffect, currentIndex } = this
      const styles = {}

      if (this.style.bgImage.kenburns) {
        styles['width'] = '100%'
        styles['height'] = '100%'
        styles['overflow'] = 'hidden'
        styles['position'] = 'absolute'
      }

      if (transitionEffect === 'slide' || transitionEffect === 'slide-controls' ) {
        styles['transform'] = `translateX(-${currentIndex * 100}%)`
        styles['display'] = 'flex'
      }

      return styles
    },

    transitionEffect () {
      return this.strap.config.style.bgImage.transitionStyle
    },

    transitionInterval () {
      return this.strap.config.style.bgImage.transitionInterval * 1000
    }
  },

  methods: {
    startAutoplay () {
      this.interval = setInterval(this.next.bind(this), this.transitionInterval)
    },

    stopAutoplay () {
      if (this.interval) clearInterval(this.interval)
    },

    next () {
      console.log('next')
      const size = this.style.bgImage.imageUrls.length
      if (this.$data.currentIndex + 1 >= size) this.$data.currentIndex = 0
      else this.$data.currentIndex++
    },

    nextButton () {
      if (this.interval) clearInterval(this.interval)
      console.log('next')
      const size = this.style.bgImage.imageUrls.length
      if (this.$data.currentIndex + 1 >= size) this.$data.currentIndex = 0
      else this.$data.currentIndex++
    },

    prevButton () {
      if (this.interval) clearInterval(this.interval)
      const size = this.style.bgImage.imageUrls.length
      if (this.$data.currentIndex - 1 < 0) this.$data.currentIndex = this.style.bgImage.imageUrls.length - 1
      else this.$data.currentIndex--
    },

    select (i) {
      if (this.interval) clearInterval(this.interval)
      this.$data.currentIndex = i
    },

    selected (i) {
      return i === this.currentIndex
    },

    slideStyles (url, i) {
      const { transitionEffect, currentIndex } = this
      const styles = {
        backgroundImage: `url(${url})`
      }

      if (transitionEffect === 'fade') {
        if (i <= currentIndex) styles['opacity'] = 1
        else styles['opacity'] = 0

        styles['position'] = 'absolute'
        styles['left'] = 0
        styles['top'] = 0
      }

      return styles
    }
  },

  mounted () {
    if (this.imageUrls.length) this.startAutoplay()
  },

  destroyed () {
    this.stopAutoplay()
  },

  watch: {
    strap (value) {
      this.stopAutoplay()
      if (this.imageUrls.length) this.startAutoplay()
    },

    autoplay () {
      this.stopAutoplay()
      if (this.imageUrls.length) this.startAutoplay()
    },

    transitionInterval () {
      this.stopAutoplay()
      if (this.imageUrls.length) this.startAutoplay()
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.strap-images-overlay

.strap-images-overlay button
  position: absolute
  font-size: 59px
  font-weight: bold
  top: 30vh
  z-index: 100
  pointer-events: auto !important
  background-color: transparent
  border: none

.strap-images-overlay button.left
  left: 0

.strap-images-overlay button.right
  right: 0
  margin-left: 4px

.strap-images-overlay .dotControls
  position: absolute
  font-weight: bold
  bottom: 0px
  right: 10px
  z-index: 100
  pointer-events: auto !important

.strap-images-overlay .dotControls li
  cursor: pointer;

.strap-overlay-slide
  position: relative
  top: auto
  left: auto
  width: 100%
  height: 100%
  flex: 0 0 100%
  transition: opacity 1s ease-in-out

.strap-overlay__inner
  transition: transform 1s ease-in-out

.has-image
  background-position: 50% 50%
  background-repeat: no-repeat
  background-size: cover

  &.is-greyscale
    filter: contrast(2) grayscale(1) invert(0.3)

  &.is-repeat
    background-repeat: repeat
    background-size: auto

  &.is-parallax
    background-attachment: fixed

  +desktop
    @keyframes kenburns

      50%
        transform: scale3d(1.3, 1.3, 1.3) translate3d(-2.7rem, 0, 1rem)
        animation-timing-function: ease-in-out

      100%
        transform: scale3d(1.6, 1.6, 1.6) translate3d(5ch, 0.4in, 5em)
        animation-timing-function: ease-in-out

    &.is-kenburns
      animation: kenburns 60s infinite

</style>
