<template>
<div class="app-control control">

  <div class="field">
    <div class="app-control control">
      <input
      class="input app-input"
      type="text"
      :placeholder="field.placeholder"
      :value="value.imageUrls[0]"
      @blur="urlChanged($event.target.value, i)"
      @keyup="urlChanged($event.target.value, i)"
      @change="urlChanged($event.target.value, i)">
    </div>
  </div>

  <div class="field">
    <label class="app-checkbox checkbox">
      <input
      type="checkbox"
      :id="id('repeat')"
      @change="boolChanged($event.target, 'repeat')">
      <label :for="id('repeat')"></label>
      Repeat images as a pattern
    </label>
  </div>

  <div class="field">
    <label class="app-checkbox checkbox">
      <input
      type="checkbox"
      :id="id('greyscale')"
      @change="boolChanged($event.target, 'greyscale')">
      <label :for="id('greyscale')"></label>
      Make images grayscale
    </label>
  </div>

</div>
</template>

<script>
import mixinField from '@/mixins/field'

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      rnd: Math.random() + Date.now()
    }
  },

  methods: {
    id (key) {
      const rnd = this.$data.rnd
      return `chk_${key}_${rnd}`
    },

    urlChanged (newUrl, index) {
      const value = clone(this.$props.value)
      value.imageUrls[index] = newUrl
      this.change(value)
    },

    boolChanged (target, key) {
      const value = clone(this.$props.value)
      value[key] = target.checked
      this.change(value)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
