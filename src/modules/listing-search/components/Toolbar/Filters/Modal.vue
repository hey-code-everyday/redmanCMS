<template>
  <div class="modal is-active filters-modal" :ref="$options.name">
    <div class="modal-background" @click="close"></div>

    <div class="modal-content filters-modal__content box var--gus-box">
      <Panels :advanced="true" />

      <footer class="columns filters-modal__footer var--app-default">
        <div class="column is-half text-center filters-modal__close-wrapper">
          <button class="button is-large filters-modal__close var--gus-bg-primary" @click="close">Close</button>
        </div>
        <div class="column filters-modal__actions">
          <a class="filters-modal__action" @click="useBasic">Use Basic Search</a>
          <a class="filters-modal__action" @click="clearAll">Clear All Filters</a>
        </div>
      </footer>

    </div>
  </div>
</template>

<script>
import Panel from '../../partials/Panel'
import Panels from './Panels'
import Footer from './Footer'

export default {
  name: 'filtersPanel',
  extends: Panel,

  components: {
    Panels,
    FiltersFooter: Footer
  },

  methods: {
    useBasic: function (e) {
      this.$store.commit('openPanel', 'filters')
      this.$store.commit('toggleAdvancedSearch')
    },

    close: function (e) {
      e.preventDefault()
      this.$store.commit('closePanel')
    },

    clearAll: function (e) {
      this.$store.commit('unsetFilters')
      this.$store.dispatch('submit')
    }
  }
}
</script>

<style lang="sass">
@import '../../../../../assets/sass/variables'

.filters-modal
  pointer-events: auto

.filters-modal__content
  max-height: 80vh
  .filters
    columns: 2

  @media (min-width: 920px)
    width: 840px
    .filters
      columns: 3

  @media (min-width: 1200px)
    width: 1120px
    .filters
      columns: 4

.filters-modal__footer
  margin: 1.5rem 0

.filters-modal__close
  display: block
  width: 100%

.filters-modal__actions
  display: flex
  flex-direction: row
  justify-content: space-around
  align-items: center

+with-palette
  .filters-modal__close
    color: var(--#{$palette}-uiPrimary-text)
    background-color: var(--#{$palette}-uiPrimary-bgColor)

</style>
