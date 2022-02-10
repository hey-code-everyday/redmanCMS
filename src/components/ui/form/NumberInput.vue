<template>
<div class="app-control control">
  <input
  class="input app-input"
  type="number"
  :step="field.step"
  :min="field.minValue"
  :max="field.maxValue"
  :placeholder="field.placeholder"
  :value="value"
  :tabIndex="tabIndex"
  @blur="changed($event.target, $event.target.value)"
  @keyup="changed($event.target, $event.target.value)"
  @change="changed($event.target, $event.target.value)">
</div>
</template>

<script>
import mixinField from '@/mixins/field'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      debounce: null
    }
  },

  methods: {
    changed (el, value) {
      const { minValue, maxValue } = this.$props.field
      value = Number(value)

      if (value < minValue) value = minValue
      else if (value > maxValue) value = maxValue

      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        el.value = value
        this.change(value)
      }, 200)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
