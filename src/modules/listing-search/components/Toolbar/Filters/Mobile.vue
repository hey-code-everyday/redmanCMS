<template>
  <div class="filters-mobile">
    <Panels :advanced="isAdvanced" />
    <Sort />
    <FiltersFooter v-if="hasAdvanced" :isAdvanced="isAdvanced" @toggleAdvanced="toggleAdvanced" />
  </div>
</template>

<script>
import Panels from './Panels'
import Footer from './Footer'
import Sort from '.././Sort'

export default {
  name: 'filtersPanelMobile',

  components: {
    Panels,
    FiltersFooter: Footer,
    Sort
  },

  computed: {
    hasAdvanced: function (e) {
      return this.$store.getters.isAdvancedSearchAvailable
    },

    isAdvanced: function (e) {
      return this.$store.state.gus.isAdvancedSearch
    }
  },

  methods: {
    toggleAdvanced: function (e) {
      this.$store.commit('toggleAdvancedSearch')
    }
  }
}
</script>

<style lang="sass">

.filters-mobile
  padding: 10px 0

</style>
