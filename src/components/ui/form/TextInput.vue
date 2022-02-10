<template>
<div class="app-control control">
  <input
  class="input app-input"
  type="text"
  :placeholder="field.placeholder"
  :value="value"
  :tabIndex="tabIndex"
  ref="input"
  @blur="onChange($event.target.value)"
  @keyup="onChange($event.target.value)"
  @change="onChange($event.target.value)">
</div>
</template>

<script>
import mixinField from '@/mixins/field'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      debounce: null
    }
  },

  methods: {
    onChange (value) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.change((this.$refs.input && this.$refs.input.value) || value)
      }, 200)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
