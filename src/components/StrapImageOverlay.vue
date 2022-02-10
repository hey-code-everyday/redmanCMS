<template>
  <div :style="style.bgImage.kenburns ? 'width: 100%; height: 100%; overflow: hidden;position:absolute' : ''">
    <div
      :class="[
        'strap-overlay',
        'has-image',
        (style.bgImage.greyscale ? 'is-greyscale' : false),
        (style.bgImage.repeat ? 'is-repeat' : false),
        (style.bgImage.parallax ? 'is-parallax' : false),
        (style.bgImage.kenburns ? 'is-kenburns' : false),
      ]"
      v-lazy:background-image="`${this.imageUrl}`"
    >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    strap: {
      type: Object,
      require: true
    }
  },
  computed: {
    imageUrl () {
      return this.style.bgImage.imageUrls[0]
    },

    palette () {
      return this.$store.getters.palette(this.style.theme)
    },

    style () {
      return this.strap.config.style
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.has-kenburns
  position: absolute
  width: 100%
  height: 100%
  overflow: hidden
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
    +desktop
      background-attachment: fixed
    +mobile
      background-attachment: local


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
