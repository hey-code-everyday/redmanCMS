<template>
  <div ref="carousel" class="touch-carousel">
    <div ref="carouselInner" class="touch-carousel__inner" :style="innerStyle()">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import motion from '@/mixins/motion.js'

export default {
  mixins: [ motion ],

  provide () {
    return {
      $carousel: this
    }
  },

  props: {
    initialIndex: {
      type: Number,
      default: 0
    },

    wrapAround: {
      type: Boolean,
      default: true
    },

    centerSlides: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      scrolling: false,
      mixinLoop: {
        update: () => {
          const { $motion, $transform } = this
          const x = $transform.translation.x
          const velx = $motion.velocity.x

          // Select next target

          if (!this.scrolling) return

          if (Math.abs(velx) < 3) {
            this.scrolling = false

            const nextTarget = $motion.findClosest({ x: x + velx })

            if (nextTarget) {
              const index = $motion.targets.findIndex(target => (target.el && target.el === nextTarget) || (target === nextTarget))
              $motion.currentTarget = nextTarget
              this.currentIndex = index
            }

            this.wentOver = false
          }
        }
      },
      mixinMotion: {
        decay: { x: 0.9 },
        restrict: { y: true },
        targetForce: 0.09,
        seekTargets: false
      },
      resizeDebounce: null,
      resizeHandler: undefined,
      currentIndex: this.initialIndex,
      mouseupHandler: undefined,
      mousemoveHandler: undefined
    }
  },

  methods: {
    isMobile () {
      return window.innerWidth < 1224
    },
    innerStyle () {
      return {
        ...this.$transform.style(),   
      }
    },

    reloadSlides () {
      const slideVnodes = this.$slots.default
      const { carousel } = this.$refs
      const containerWidth = carousel.getBoundingClientRect().width


      // Make snap targets

      let totalWidth = 0

      const targets = slideVnodes.map((vnode, i) => {
        const { width } = vnode.elm.getBoundingClientRect()

        var animationStart = this.isMobile() ? 0 : 1

        const x = i <= animationStart
         ? 0
         : Math.round(-totalWidth) + ((containerWidth - width) / 2)

        const radius = Math.round(width / 2)

        totalWidth += width

        vnode.elm.classList.add('touch-carousel__slide')

        return { x, radius }
      })

      this.$motion.targets = targets
    },

    onResize () {
      clearTimeout(this.resizeDebounce)

      this.resizeDebounce = setTimeout(() => {
        /*
          If this looks awful, its because it is. Chrome has a bug where images with 100% height
          and auto width inside of a child of a flex parent do not resize correctly when the parent
          element changes size. The only way to get the image to properly resize in Chrome is to trigger
          a repaint of the image. I do this by setting the height of each image to 'auto' and then back to '100%'
          and calling getBoundingClientReact immediately after. getBoundingClientRect forces the browser to repaint
          the element
        */

        this.$slots.default.forEach((vnode) => {
          const image = vnode.elm.querySelector('.touch-carousel-image')
          if (image) {
            image.style.height = 'auto'
            image.getBoundingClientRect() // hack to force repaint
          }
        })

        setTimeout(() => {
          this.$slots.default.forEach((vnode) => {
            const image = vnode.elm.querySelector('.touch-carousel-image')
            if (image) {
              image.style.height = '100%'
              image.getBoundingClientRect() // hack to force repaint
            }
          })

          setTimeout(() => {
            this.reloadSlides()
          }, 10)
        }, 10)
      }, 200)
    }
  },

  created () {
    this.resizeHandler = this.onResize.bind(this)
    window.addEventListener('resize', this.resizeHandler)
  },

  destroyed () {
    window.removeEventListener('resize', this.resizeHandler)
  },

  mounted () {
    this.reloadSlides()
  },

  update () {
    this.reloadSlides()
  },

  watch: {
    currentIndex (nextIndex, currentIndex) {
      const { targets } = this.$motion

      // Clamp or wrap index

      if (nextIndex >= targets.length || currentIndex > targets.length) {
        if (this.wrapAround) nextIndex = 0
        else nextIndex = targets.length - 1
      }

      if (nextIndex < 0 || currentIndex < 0) {
        if (this.wrapAround) nextIndex = targets.length - 1
        else nextIndex = 0
      }

      // Set target

      this.$motion.currentTarget = targets[nextIndex]

      if (currentIndex === nextIndex) return
      this.currentIndex = nextIndex

      this.$emit('currentIndex',(this.currentIndex))
    }
  }
}
</script>

<style lang="sass" scoped>
.touch-carousel
  position: relative
  box-sizing: border-box
  user-select: none

.touch-carousel__inner
  height: 100%
  display: flex
  position: relative

.touch-carousel__hit-target
  top: 50%
  left: 0
  width: 20px
  height: 20px
  z-index: 1
  position: absolute
  background: #ccc
  margin-top: -10px
  margin-left: -10px
  border-radius: 100px
  pointer-events: none

.--first-slide
  position: absolute !important
  top: 0 !important
  left: 0 !important
  transform: translateX(-100%) !important
</style>
