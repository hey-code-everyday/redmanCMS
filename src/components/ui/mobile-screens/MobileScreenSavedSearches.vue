<template>
  <div class="mobile-screen">
    <header class="mobile-header-outer mobile-screen__header" :style="mobileStyles">
      <div class="mobile-header">
        <div class="mobile-header__left">
          <a class="icon" @click="$store.commit('HIDE_MOBILE_SCREEN')">
            <i class="icon-chevron-left"></i>
          </a>
        </div>
        <div class="mobile-header__center mobile-header__title">
          <strong>Saved Searches &amp; Favourites</strong>
        </div>
        <div class="mobile-header__right">
        </div>
      </div>
    </header>
    <div class="mobile-screen__content">
      <div class="mobile-screen__content-inner">
        <previous-searches :open="true" @requestClose="$store.commit('HIDE_MOBILE_SCREEN')" />
      </div>
    </div>
  </div>
</template>

<script>
import PreviousSearches from '@/modules/listing-search/components/SaveSearch/PreviousSearches'

export default {
  components: {
    PreviousSearches
  },

  computed: {
    mobileStyles () {
      const { family, weight } = this.$store.getters.theme.fonts.body
      const { brandText, brandBgColor, brandBgColor2 } = this.$store.getters.palette('header')

      const styles = {
        color: brandText,
        fontFamily: family,
        fontWeight: weight,
        backgroundColor: brandBgColor,
        backgroundImage: `linear-gradient(90deg, ${brandBgColor}, ${brandBgColor2})`
      }

      return styles
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
