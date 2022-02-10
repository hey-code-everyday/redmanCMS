<template>
<div class="app-control control">
  <input
  class="input app-input"
  type="text"
  :value="value"
  :tabIndex="tabIndex"
  @focus="selectText($event.target)"
  @click="selectText($event.target)"
  @blur="$event.target.value = value"
  @keyup="$event.target.value = value"
  @change="$event.target.value = value">
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
  methods: {
    selectText (el) {
      el.setSelectionRange(0, el.value.length)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.app-input
  color: rgba($wsText, 0.8)

</style>
