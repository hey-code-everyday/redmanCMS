<template>
  <div class="mobile-header mobile-header-home">
    <div class="mobile-header__left">
      <a v-if="smallLogoUrl" class="mobile-header__item mobile-header__masthead" href="/">
        <img :src="smallLogoUrl" />
      </a>
      <a class="mobile-header__item mobile-header__title" href="/">
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
  name: 'MobileHeaderHome',

  computed: {
    smallLogoUrl () {
      return this.$store.state.website.config.display.smallLogoUrl
    }
  }
}
</script>

<style lang="sass" scoped>
.mobile-header-home
</style>
