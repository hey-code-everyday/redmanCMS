export default {
  props: {
    field: {
      type: Object,
      required: true
    },
    tabIndex: {
      type: [Number, Boolean],
      required: false,
      default: false
    }
  },

  methods: {
    change (value, event) {
      const { key } = this.$props.field
      this.$emit('change', value, key)
    }
  }
}
