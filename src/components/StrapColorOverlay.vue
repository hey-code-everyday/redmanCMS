<template>
  <div :class="[ 'strap-overlay', 'is-color' ]" :style="styles">
  </div>
</template>

<script>
import { clone } from '@/util'

export default {
  props: {
    strap: {
      type: Object,
      require: true
    }
  },

  computed: {
    palette () {
      return this.$store.getters.palette(this.style.theme)
    },

    style () {
      return this.strap.config.style
    },

    styles () {
      const { palette, style } = this

      let opacity = palette.overlayAlpha
      let backgroundColor = 'transparent'
      let backgroundImage = 'none'

      // Solid
      if (style.overlayStyle === 'solid') {
        backgroundColor = palette.bgColor
      // Custom solid
      } else if (style.overlayStyle === 'solid-custom') {
        opacity = style.overlayAlpha / 100
        backgroundColor = style.overlayColor
      // Gradient
      } else if (style.overlayStyle === 'gradient') {
        backgroundImage = this.makeGradient({
          angle: palette.overlayAngle,
          colors: [
            { color: palette.uiPrimary.bgColor, pos: 0 },
            { color: palette.uiSecondary.bgColor, pos: 1 }
          ]
        })
      // Custom gradient
      } else if (style.overlayStyle === 'gradient-custom') {
        opacity = style.overlayAlpha / 100
        const gradient = clone(style.overlayGradient)

        gradient.colors.sort((a, b) => {
          if (a.pos > b.pos) return 1
          else if (a.pos < b.pos) return -1
          else return 0
        })

        backgroundImage = this.makeGradient(gradient)
      }

      return {
        opacity,
        backgroundColor,
        backgroundImage
      }
    }
  },

  methods: {
    makeGradient (gradient) {
      const colorStops = gradient.colors.map(stop => `${stop.color} ${Math.round(stop.pos * 100)}%`)
      return `linear-gradient(${gradient.angle}deg, ${colorStops.join(', ')})`
    }
  }
}
</script>

<style lang="sass" scoped>
.is-color
</style>
