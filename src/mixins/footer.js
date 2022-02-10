import { clone } from '@/util'
import mixinInterpolate from './interpolate'

export default {
  props: {
    footer: {
      type: Object,
      required: true
    }
  },

  mixins: [mixinInterpolate],

  computed: {
    footer_state () {
      return this.$props.footer.state
    },

    footer_config () {
      return this.$props.footer.config
    },

    footer_palette () {
      const themeName = this.footer_config.style.theme
      return this.$store.state.website.theme.straps[themeName]
    },

    footer_page () {
      return this.$store.state.page
    },

    footer_pageMeta () {
      return this.$store.state.page.metaInfo
    },

    footer_editing () {
      return this.$store.state.editing
    },

    footer_nav () {
      return this.$props.footer.nav
    }
  },

  methods: {
    $footer_onStateChange ({ keyName, value }) {
      const footer = clone(this.$props.footer)
      footer.state[keyName] = value

      this.$store.dispatch('setFooter', footer)
    },

    $footer_onComponentChange ({ keyName, value }) {
      const footer = clone(this.$props.footer)
      footer.state[keyName][value.keyName] = value.value

      this.$store.dispatch('setFooter', footer)
    },

    $footer_onListChange (keyName, value) {
      const footer = clone(this.$props.footer)
      footer.state[keyName][value.keyName][value.value.keyName] = value.value.value

      this.$store.dispatch('setFooter', footer)
    },

    $footer_onListCreate (keyName, newItem) {
      const footer = clone(this.$props.footer)
      footer.state[keyName].push(newItem())

      this.$store.dispatch('setFooter', footer)
    },

    $footer_onListDelete (keyName, index) {
      const footer = clone(this.$props.footer)
      footer.state[keyName].splice(index, 1)

      this.$store.dispatch('setFooter', footer)
    },

    $footer_interpolate (value) {
      const palette = this.footer_palette

      return this.$interpolate(value, palette)
    }
  }
}
