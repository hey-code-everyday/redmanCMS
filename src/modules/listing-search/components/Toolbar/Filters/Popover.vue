<template>
  <div class="filters-popover__content">
    <Panels :panelConfig="panelConfig" />

    <FiltersFooter v-if="hasAdvanced && showAdvanced" :isAdvanced="false" @toggleAdvanced="gotoAdvanced" />
  </div>
</template>

<script>
import Panels from './Panels'
import Footer from './Footer'

export default {
  name: 'filtersPanel',
  props: ['panelConfig', 'showAdvanced'],

  components: {
    Panels,
    FiltersFooter: Footer
  },

  computed: {
    hasAdvanced: function (e) {
      return this.$store.getters.isAdvancedSearchAvailable
    }
  },

  methods: {
    gotoAdvanced: function (e) {
      this.$store.commit('toggleAdvancedSearch')
      this.$store.commit('openPanel', 'advanced-search')
    }
  }
}
</script>

<style lang="sass" scoped>

.filters-popover__content .filters
  @media (min-width: 1216px)
    columns: 2
    column-gap: 1rem

</style>
