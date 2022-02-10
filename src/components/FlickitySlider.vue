<template>
  <component :is="browser ? 'flickity' : 'div'" ref="flickity" :options="options">
    <slot />
  </component>
</template>

<script>
let Flickity = {}
if (process.browser) {
  Flickity = require('vue-flickity').default
}

export default {
  name: 'FlickitySlider',

  props: {
    options: {
      type: Object,
      required: false,
      default () { return {} }
    }
  },

  components: {
    Flickity
  },

  computed: {
    browser () {
      return process.browser
    }
  }
}
</script>
