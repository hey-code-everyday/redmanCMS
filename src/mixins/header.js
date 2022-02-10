import { clone } from '@/util'
import mixinInterpolate from './interpolate'

export default {
  props: {
    header: {
      type: Object,
      required: true
    }
  },

  mixins: [mixinInterpolate],

  computed: {
    header_state () {
      return this.$props.header.state
    },

    header_config () {
      return this.$props.header.config
    },

    header_palette () {
      return this.$store.state.website.theme.straps['default']
    },

    header_page () {
      return this.$store.state.page
    },

    header_pageMeta () {
      return this.$store.state.page.metaInfo
    },

    header_editing () {
      return this.$store.state.editing
    },

    header_nav () {
      return this.$props.header.nav
    },

    header_styles () {
      const theme = this.$store.state.website.theme
      const themes = theme.straps

      return {
        backgroundColor: themes.default.bgColor
      }
    }
  },

  methods: {
    $header_onStateChange ({ keyName, value }) {
      const header = clone(this.$props.header)
      header.state[keyName] = value

      this.$store.dispatch('setHeader', header)
    },

    $header_onComponentChange ({ keyName, value }) {
      const header = clone(this.$props.header)
      header.state[keyName][value.keyName] = value.value

      this.$store.dispatch('setHeader', header)
    },

    $header_onListChange (keyName, value) {
      const header = clone(this.$props.header)
      header.state[keyName][value.keyName][value.value.keyName] = value.value.value

      this.$store.dispatch('setHeader', header)
    },

    $header_onListCreate (keyName, newItem) {
      const header = clone(this.$props.header)
      header.state[keyName].push(newItem())

      this.$store.dispatch('setHeader', header)
    },

    $header_onListDelete (keyName, index) {
      const header = clone(this.$props.header)
      header.state[keyName].splice(index, 1)

      this.$store.dispatch('setHeader', header)
    },

    $header_interpolate (value) {
      const palette = this.header_palette

      return this.$interpolate(value, palette)
    }
  }
}
