export default {
  props: {
    state: {
      type: Object,
      required: true
    },

    settings: {
      type: Object,
      required: true
    }
  },

  methods: {
    $customModal_close () {
      this.$store.commit('HIDE_CUSTOM_MODAL')
    }
  }
}
