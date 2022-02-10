<template>
  <div class="field add-strap-field has-addons">
    <p class="control app-control">
      <span class="select app-select">
        <strap-dropdown @change="e => { selected = e }" />
      </span>
    </p>
    <p class="control app-control">
      <a :class="[ 'button', 'is-primary', (!selected ? 'is-disabled' : false)]" @click="$emit('change', selected)">
        <span>Add a strap</span>
      </a>
    </p>
  </div>
</template>

<script>
import StrapDropdown from './StrapDropdown'

export default {
  data () {
    return {
      selected: null
    }
  },

  components: {
    StrapDropdown
  }
}
</script>

<style lang="sass" scoped>
.add-strap-field

  .button
    &.is-disabled
      opacity: 0.6
      pointer-events: none
</style>
