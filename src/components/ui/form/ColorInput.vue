<template>
<div class="field has-addons">

  <!-- Color picker -->
  <div class="app-control control">
    <input
    class="input app-input"
    type="color"
    ref="color"
    :style="alphaStyle"
    :placeholder="field.placeholder"
    :value="hexValue"
    :tabIndex="tabIndex"
    @blur="blur ? colorChanged($event.target.value) : false"
    @keyup="colorChanged($event.target.value)"
    @change="colorChanged($event.target.value)">
  </div>

  <!-- Manual input -->
  <div class="app-control control has-icons-right">
    <input
    class="input app-input"
    type="text"
    ref="text"
    :placeholder="field.placeholder"
    :value="value"
    :tabIndex="tabIndex"
    @blur="blur ? textChanged($event.target.value) : false"
    @keyup="textChanged($event.target.value)"
    @change="textChanged($event.target.value)">
    <span class="icon is-small is-right" @click="convertToRgba" title="Convert to RGBA">
      <i class="icon-gradient"></i>
    </span>
  </div>

</div>
</template>

<script>
import mixinField from '@/mixins/field'
import Color from 'color'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: String,
      required: true
    },

    blur: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  methods: {
    convertToRgba () {
      const { value } = this.$props

      const color = Color(value)
      const { r, g, b } = color.object()

      this.change(`rgba(${r}, ${g}, ${b}, 1)`)
    },

    colorChanged (newValue) {
      const { value } = this.$props

      if (value.includes('rgba')) {
        const color = Color(newValue)
        const oldColor = Color(value)

        const { r, g, b } = color.object()
        const a = oldColor.alpha()

        this.change(`rgba(${r}, ${g}, ${b}, ${a})`)
      } else {
        this.change(newValue)
      }
    },

    textChanged (newValue) {
      const value = this.$props.value

      try {
        const color = Color(newValue)
        this.change(newValue)
      } catch (e) {
        console.warn('Invalid color', e)
        this.change(value)
      }
    }
  },

  computed: {
    hexValue () {
      const { value } = this.$props
      return Color(value).hex()
    },

    alphaStyle () {
      const { value } = this.$props

      let alpha = Color(value).alpha()
      if (alpha < 0.1) alpha = 0.1

      return `opacity: ${alpha}`
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.field
  width: 100%

.control
  .input
    border-radius: 0 !important

    &:focus
      .icon
        color: $wsIcon !important

        &:hover
          color: $wsTextLight !important

  &:first-child
    min-width: 72px

  &:last-child
    width: auto
    flex: 1

  .icon
    pointer-events: auto
    cursor: pointer
    color: $wsIcon !important
    opacity: 1 !important

    &:hover
      color: $wsTextLight !important

</style>
