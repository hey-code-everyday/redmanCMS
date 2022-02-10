<template>
  <div class="item__image-wrapper" ref="container">
    <div class="item__image-bg gus-layer-base" ref="background"></div>

    <div v-if="noImage" class="item__noimage-wrapper">
      <NoResults />
    </div>
    <img v-show="!noImage" ref="image" :src="this.src" :srcset="this.srcSet" :sizes="this.sizes" :alt="alt" @load="onLoad" @error="onError" class="item__image gus-layer-img" />

  </div>
</template>

<script>
import {listingSizes, getSrcset, fitBoxes} from '../../../helpers/images'
import NoResults from '../NoResults.vue'

export default {
  name: 'itemImage',

  components: {
    NoResults
  },

  props: ['images', 'alt', '_id'],

  data: function () {
    const image = this.images ? this.images[0] : null
    return {
      sizes: listingSizes,
      src: image,
      srcSet: image ? getSrcset(image, [
        {name: 'medium', width: 500},
        {name: 'retina-small', width: 300},
        {name: 'small', width: 150}
      ]) : null,
      fallback: false,
      noImage: !image
    }
  },

  methods: {
    onLoad: function (e) {
      const elemDiv = this.$refs['container']
      const elemBg = this.$refs['background']
      const elemImg = this.$refs['image']

      if (!elemDiv) return

      const doFitting = () => {
        const outerW = parseFloat(window.getComputedStyle(elemDiv).width, 10)
        const innerW = parseFloat(window.getComputedStyle(elemImg).width, 10)
        const innerH = parseFloat(window.getComputedStyle(elemImg).height, 10)
        const fit = fitBoxes({outerW, outerH: outerW / 1.5, innerW, innerH})
        elemImg.style.width = fit.innerW + 'px'
        elemBg.style.backgroundImage = `url(${elemImg.currentSrc})`
        if (fit.offsetT) {
          elemImg.style.marginLeft = '0'
          elemImg.style.marginTop = Math.round(fit.offsetT) + 'px'
        } else if (fit.offsetL) {
          elemImg.style.marginLeft = Math.round(fit.offsetL) + 'px'
          elemImg.style.marginTop = '0'
        }
      }
      doFitting()

      window.addEventListener('resize', doFitting)
    },
    onError: function (e) {
      if (this.fallback) {
        this.noImage = true
        return
      }
      this.fallback = true

      // remove the srcset and sizes tags so the browser tries the fullsize image
      if (!this.$refs['image']) return

      const elemImg = this.$refs['image']
      elemImg.removeAttribute('srcset')
      elemImg.removeAttribute('sizes')
      elemImg.setAttribute('src', this.src + '?fallback=fallback')
    }
  }
}
</script>

<style scoped lang="sass">

.item__image-wrapper
  height: 0
  padding-bottom: 66.7%
  overflow: hidden
  background: rgba(0,0,0,0.1)
  position: relative
  background-size: cover
  background-position: center
  border-radius: 3px 3px 0 0

.item__image-bg
  padding-bottom: 66.7%
  position: absolute
  top: -1rem
  left: -1rem
  right: -1rem
  bottom: -1rem
  opacity: 0.5
  background-size: cover
  filter: blur(15px)

.item__image
  width: 100%
  filter: none
  position: relative

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

</style>
