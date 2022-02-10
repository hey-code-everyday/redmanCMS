<template>
  <div class="mobile-header mobile-header-search">
    <div class="mobile-header__left" style="width:100%">
      <a class="icon" @click="$store.dispatch('navigateBack')">
        <i class="icon-chevron-left"></i>
      </a>
      <div class="mobile-header__item">
        <div class="control has-icons-right">
          <!-- <input class="input is-small" type="text" placeholder="Search">
          <button class="delete is-small is-right"></button> -->
          <awesome-bar :mobile="true" />
        </div>
      </div>
      <div class="mobile-header__item mobile-header-search__controls">
        <a class="mobile-header__item" @click="openFilters">Filter</a>
        <span style="opacity:0.5">|</span>
        <a v-if="mapOpen" class="mobile-header__item" @click="closeMap">List</a>
        <a v-else class="mobile-header__item" @click="openMap">Map</a>
      </div>
    </div>
    <div class="mobile-header__right">
      <a class="icon" @click="$store.commit('SHOW_MOBILE_NAV')">
        <i class="icon-menu"></i>
      </a>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get'
import AwesomeBar from '@/modules/listing-search/components/Toolbar/AwesomeBar/index.vue'
import MobileScreenFilters from '@/components/ui/mobile-screens/MobileScreenFilters'

export default {
  name: 'MobileHeaderSearch',

  components: {
    AwesomeBar
  },

  computed: {
    mapOpen () {
      return this.$store.state.gus.anchor === 'map'
    }
  },

  methods: {
    openFilters () {
      this.$store.commit('SHOW_MOBILE_SCREEN', {
        component: MobileScreenFilters
      })
    },

    openMap () {
      this.$store.commit('setAnchor', 'map')
    },

    closeMap () {
      this.$store.commit('setAnchor', null)
    }
  }
}
</script>

<style lang="sass" scoped>
.mobile-header-search
  .mobile-header__item
    flex-basis: auto

.mobile-header-search__controls
  flex: 0
  white-space: nowrap
  padding-right: 20px
  a
    text-decoration: underline
</style>
