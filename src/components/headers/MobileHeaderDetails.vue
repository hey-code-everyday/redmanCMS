<template>
  <div class="mobile-header mobile-header-details">
    <div class="mobile-header__left">
      <a class="icon" @click="$store.dispatch('navigateBack')">
        <i class="icon-chevron-left"></i>
      </a>
    </div>
    <div class="mobile-header__center">
      <strong>{{ title }}</strong>
    </div>
    <div class="mobile-header__right">
      <a class="icon" v-if="mls">
        <i class="icon-heart"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileHeaderDetails',

  computed: {
    title () {
      const { headerMeta } = this.$store.state
      return headerMeta.title || 'Listing'
    },

    mls () {
      const { headerMeta } = this.$store.state
      return headerMeta.mls || false
    }
  }
}
</script>

<style lang="sass" scoped>
.mobile-header-details
</style>
