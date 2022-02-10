<template>
  <input class="input" @focus="onFocus" @keyup="onKeyup" @keydown="onKeydown" @change="onChange" :value="searchString" id="awesome-bar__input" placeholder="Search by city, neighbourhood, or MLS® #" />
</template>

<script>
export default {
  name: 'awesomeBarTextbox',

  props: ['searchString'],

  methods: {
    onChange: function (e) {
      this.$emit('focus')
      this.$emit('change', e.target.value)
    },

    onFocus: function () {
      this.$emit('focus')
    },

    onKeydown (e) {
      switch (e.keyCode) {
        case 38:
        case 40:
          e.preventDefault()
          return false

        default:
          return true
      }
    },

    onKeyup (e) {
      switch (e.keyCode) {
        case 13: // Enter
          e.preventDefault()
          this.$emit('onChoose')
          return false

        case 38: // up arrow
          e.preventDefault()
          this.$emit('prevChoice')
          return false

        case 40: // down arrow
          e.preventDefault()
          this.$emit('nextChoice')
          return false

        // do not submit on Shift et al, left and right arrows
        case 16:
        case 17:
        case 18:
        case 91:
        case 37:
        case 39:
          e.preventDefault()
          return false

        default:
          this.onChange(e)
          return true
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .input
    z-index: 1
    &::placeholder
      opacity: 0.4
</style>
