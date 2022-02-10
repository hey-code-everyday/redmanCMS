export default {
  props: {
    transformScale: {
      type: [ Object, Boolean ],
      default: false
    },

    transformRotation: {
      type: [ Object, Boolean ],
      default: false
    },

    transformTranslation: {
      type: [ Object, Boolean ],
      default: false
    },

    transformPerspective: {
      type: [ Number, Boolean ],
      default: false
    }
  },

  data () {
    const mixin = {

      // Data

      scale: {
        x: 1, y: 1, z: 1
      },

      rotation: {
        x: 0, y: 0, z: 0
      },

      translation: {
        x: 0, y: 0, z: 0
      },

      perspective: false,

      // Methods

      style: () => {
        const { scaleStyle, rotateStyle, translateStyle, perspectiveStyle } = this.mixinTransform

        const parts = [
          translateStyle(),
          rotateStyle(),
          scaleStyle(),
          perspectiveStyle()
        ].filter(item => item !== false)

        return {
          transform: parts.join(' '),
          transformOrigin: '50% 50%'
        }
      },

      scaleStyle: () => {
        const scale = this.transformScale
          ? Object.assign(this.mixinTransform.scale, this.transformScale)
          : this.mixinTransform.scale

        return `scale3d(${scale.x}, ${scale.y}, ${scale.z})`
      },

      rotateStyle: () => {
        const rot = this.transformRotation
          ? Object.assign(this.mixinTransform.rotation, this.transformRotation)
          : this.mixinTransform.rotation

        return `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg)`
      },

      translateStyle: () => {
        const pos = this.transformTranslation
          ? Object.assign(this.mixinTransform.translation, this.transformTranslation)
          : this.mixinTransform.translation

        return `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, ${Math.round(pos.z)}px)`
      },

      perspectiveStyle: () => {
        const dist = this.transformPerspective || this.mixinTransform.perspective

        if (!dist) return false

        return `perspective(${dist}px)`
      }
    }

    return {
      mixinTransform: mixin
    }
  },

  computed: {
    $transform () {
      return this.$data.mixinTransform
    }
  }
}
