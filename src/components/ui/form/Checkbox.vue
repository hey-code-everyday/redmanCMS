<template>
<div class="app-control control">
  <label class="app-checkbox checkbox">
    <input
    type="checkbox"
    :id="id"
    :checked="value == field.onValue"
    @change="checked($event.target)">
    <label :for="id"></label>
    {{ field.text }}
  </label>
</div>
</template>

<script>
import mixinField from '@/mixins/field'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: [String, Boolean, Object],
      required: true
    }
  },

  data () {
    const { key } = this.$props.field
    const rnd = Math.random() + Date.now()

    return {
      id: `chk_${key}_${rnd}`
    }
  },

  methods: {
    checked (el) {
      const { onValue, offValue } = this.$props.field

      if (el.checked) this.change(onValue)
      else this.change(offValue)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
