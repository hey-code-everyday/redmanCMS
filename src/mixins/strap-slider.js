import { clone } from '@/util'

export default {
  computed: {
    strapSlider_numSlides () {
      const { numSlidesKey } = this.slider
      return this.strap_state[numSlidesKey]
    }
  },

  watch: {
    strapSlider_numSlides (newLength) {
      const { slidesKey, defaultSlide } = this.slider

      const curLength = this.strap_state[slidesKey].length
      const slider = clone(this.strap_state[slidesKey])

      if (newLength > curLength) {
        for (let i = 0; i < newLength - curLength; i++) {
          slider.push(defaultSlide())
        }
      }

      if (newLength < curLength) {
        const len = curLength - newLength
        slider.splice(curLength - len, len)
      }

      this.$strap_onStateChange({ keyName: slidesKey, value: slider })
    }
  },

  methods: {
    $strapSlider_onSlideChange (keyName, index, value) {
      const strap = clone(this.$props.strap)
      strap.state[keyName][index][value.keyName][value.value.keyName] = value.value.value

      this.$store.dispatch('setStrap', strap)
    }
  }
}
