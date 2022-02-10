<template>
  <div class="mobile-screen">
    <header class="mobile-header-outer mobile-screen__header app-header__mobile">
      <div class="mobile-header">
        <div class="mobile-header__left">
          <a class="icon" @click="$store.commit('HIDE_MOBILE_SCREEN')">
            <i class="icon-chevron-left"></i>
          </a>
        </div>
        <div class="mobile-header__center mobile-header__title">
          <strong>Refine Search Results</strong>
        </div>
        <div class="mobile-header__right">
        </div>
      </div>
    </header>
    <div class="mobile-screen__content">
      <div class="mobile-screen__content-inner">
        <filters />
      </div>
    </div>
    <footer class="mobile-header-outer mobile-screen__footer is-footer app-header__mobile">
      <div class="mobile-header">
        <div class="mobile-header__field">
          <!-- <a class="mobile-header__item button is-outlined">
            Reset
          </a> -->
          <a class="mobile-header__item button is-primary" @click="$store.commit('HIDE_MOBILE_SCREEN')">
            Filter Search Results
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Filters from '../../../modules/listing-search/components/Toolbar/Filters/Mobile'

export default {
  components: {
    Filters
  }
}
</script>

<style lang="sass" scoped>
.mobile-screen

/deep/
  .gus-filter__title
    margin: 10px
    font-size: 14px
  .gus-filter__field
    @media (max-width: 768px)
      padding: 10px
      margin: 10px 0
      background: #fff
      box-sizing: border-box
      box-shadow: 0 0 0 1px #dfdfdf
</style>
