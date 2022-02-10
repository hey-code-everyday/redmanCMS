<template>
  <div class="mobile-header mobile-header-interior">
    <div class="mobile-header__left">
      <a class="icon" @click="$store.dispatch('navigateBack')">
        <i class="icon-chevron-left"></i>
      </a>
    </div>
    <div class="mobile-header__center">
      <a v-if="smallLogoUrl" class="mobile-header__item mobile-header__masthead" href="/">
        <img :src="smallLogoUrl" />
      </a>
      <a v-else class="mobile-header__item mobile-header__title" href="/">
        <strong>{{ $store.state.website.config.display.siteName }}</strong>
      </a>
    </div>
    <div class="mobile-header__right">
      <a class="icon" @click="$store.commit('SHOW_MOBILE_NAV')">
        <i class="icon-menu"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileHeaderInterior',

  computed: {
    smallLogoUrl () {
      return this.$store.state.website.config.display.smallLogoUrl
    }
  }
}
</script>

<style lang="sass" scoped>
.mobile-header-interior
</style>
