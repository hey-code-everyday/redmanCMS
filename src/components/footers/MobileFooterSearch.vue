<template>
  <div class="mobile-header mobile-footer-search">
    <div class="mobile-header__field">
      <a class="mobile-header__item button is-outlined" style="max-width:49.5%" @click="openPopularSearches">
        Popular Searches
      </a>
      <div class="mobile-header__item">
        <div class="field has-addons">
          <div class="control is-expanded">
            <a class="button is-primary" @click="saveSearch">
              Save Search
            </a>
          </div>
          <div class="control">
            <a class="button is-primary" @click="openSavedSearches">
              <span class="icon">
                <i class="icon-chevron-down" style="font-size:16px"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginActionStorage from '@/helpers/loginActionStorage'

export default {
  name: 'MobileFooterSearch',

  computed: {
    color () {
      const { brandBgColor } = this.$store.getters.palette('header')
      return brandBgColor
    }
  },

  methods: {
    openPopularSearches () {
      this.$store.dispatch('mobileOpenPopularSearches')
    },

    openSavedSearches () {
      loginActionStorage.deferUntilLogin(this.$store, 'mobileOpenPreviousSearches')
    },

    saveSearch () {
      loginActionStorage.deferUntilLogin(this.$store, 'mobileSaveSearch')
    }
  }
}
</script>

<style lang="sass" scoped>
.mobile-footer-search
  text-align: center
</style>
