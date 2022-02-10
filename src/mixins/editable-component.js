import mixinInterpolate from './interpolate'

export default {
  props: {
    keyName: {
      type: [String, Number],
      required: true
    },

    value: {
      required: true
    }
  },

  mixins: [mixinInterpolate],

  computed: {
    editableComponent_editing () {
      return this.$store.getters.canEdit && this.$store.state.editing
    }
  },

  methods: {
    $editableComponent_change (value) {
      this.$emit('change', value)
    },

    $editableComponent_delete (value) {
      this.$emit('delete', value)
    },

    $editableComponent_interpolate (value) {
      // See if this lives in a strap, pass the strap
      // (hacky)
      let parent = this.$parent
      let strap = false
      let count = 4
      while (strap === false && count > 0) {
        if (parent.strap) {
          strap = parent.strap
          break
        }

        if (!parent.$parent) {
          break
        }

        parent = parent.$parent
        count--
      }

      const palette = strap
        ? this.$store.getters.palette(strap.config.style.theme)
        : this.$store.getters.palette('default')

      return this.$interpolate(value, palette, strap, { parent })
    }
  }
}
