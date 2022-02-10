// import { clone } from '@/util'
import mixinInterpolate from './interpolate'

function clone (obj) {
  return obj
}

export default {
  props: {
    strap: {
      type: Object,
      required: true
    }
  },

  mixins: [mixinInterpolate],

  computed: {
    strap_id () {
      return this.$props.strap.id
    },

    strap_state () {
      return this.$props.strap.state
    },

    strap_config () {
      return this.$props.strap.config
    },

    strap_style () {
      return this.$props.strap.config.style
    },

    strap_palette () {
      const themeName = this.strap_style.theme
      return this.$store.state.website.theme.straps[themeName]
    },

    strap_page () {
      return this.$store.state.page
    },

    strap_pageMeta () {
      return this.$store.state.page.metaInfo
    },

    strap_editing () {
      return this.$store.state.editing
    }
  },

  mounted () {
    if (this.migrations) this.$emit('migrate', this.migrations)
    this.$emit('ready')
  },

  methods: {
    $strap_onStateChange ({ keyName, value }) {
      const strap = clone(this.$props.strap)
      strap.state[keyName] = value

      this.$store.dispatch('setStrap', strap)
    },

    $strap_onComponentChange ({ keyName, value, currentFilterState }) {
      const strap = clone(this.$props.strap)
      if (!strap.state[keyName] && currentFilterState) {
        strap.state[keyName] = { ...currentFilterState }
      }
      strap.state[keyName][value.keyName] = value.value
      this.$store.dispatch('setStrap', strap)
    },

    $strap_onListChange (keyName, value) {
      const strap = clone(this.$props.strap)
      strap.state[keyName][value.keyName][value.value.keyName] = value.value.value

      this.$store.dispatch('setStrap', strap)
    },

    $strap_onListCreate (keyName, newItem) {
      const strap = clone(this.$props.strap)
      strap.state[keyName].push(newItem())

      this.$store.dispatch('setStrap', strap)
    },

    $strap_onListDelete (keyName, index) {
      const strap = clone(this.$props.strap)
      strap.state[keyName].splice(index, 1)

      this.$store.dispatch('setStrap', strap)
    },

    $strap_interpolate (value) {
      const strap = this.strap
      const palette = this.strap_palette

      return this.$interpolate(value, palette, strap)
    }
  }
}
