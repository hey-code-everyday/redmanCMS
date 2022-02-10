<template>
  <div
    class="app-header"
    :class="header.config.fixed && 'is-fixed'"
  >
    <!-- Mobile -->
    <div class="mobile-header-outer app-header__mobile var--app-header">
      <component
        :is="mobileHeader"
        :header="header"
      />
    </div>

    <!-- Desktop -->
    <div :class="[ 'app-header__desktop', (header.name !== 'header-glass') ? 'var--app-header' : 'has-no-border' ]">
      <component
        :is="header.name"
        :header="header"
        @ready="$emit('ready')"
      />
    </div>
  </div>
</template>

<script>
import headers from '../components/headers'

export default {
  name: 'AppHeader',

  components: headers,

  props: {
    header: {
      type: Object,
      required: true
    }
  },

  computed: {
    mobileHeader () {
      return this.$route.meta && this.$route.meta.mobileHeader
    }
  }
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.app-header
  left: 0
  right: 0
  z-index: 1
  position: relative
  max-width: 100vw
  user-select: none
  @media (max-width: 768px)
    position: fixed
  &.is-fixed
    position: fixed

.app-header__mobile
  @media (min-width: 769px)
    display: none

.app-header__desktop
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: relative
  box-shadow: 0 1px 0 rgba(#000, 0.2)
  display: none
  @media (min-width: 769px)
    display: block
  &.has-no-border
    box-shadow: none
</style>
