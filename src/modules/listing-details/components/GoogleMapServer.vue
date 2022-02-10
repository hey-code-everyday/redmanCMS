<template>
  <div class="static-map">
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    center: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    colorPrimary: {
      type: String,
      required: false,
      default: '#d62b2b'
    },
    colorText: {
      type: String,
      required: false,
      default: '#fff'
    }
  }
}
</script>

<style lang="sass" scoped>
.static-map
  position: relative
  width: 100%
  height: 100%
  background-size: cover
  background-position: 50% 50%
  background-repeat: no-repeat
</style>
