<template>
  <form class="filters var--app-default">
    <template v-for="(panel, i) in panels">
      <component :is="panel.component" :key="i" :config="panel.config"></component>
    </template>
  </form>
</template>

<script>
import filters from '../../../filters'

export default {
  name: 'filtersPanels',
  props: ['advanced', 'panelConfig'],
  computed: {
    panels () {
      return this.$store.state.gus.config.panels.filter(panel => {
        return panel.config &&
               (this.advanced || !panel.config.advanced) &&
               (this.panelConfig && this.panelConfig.include ? this.panelConfig.include.includes(panel.name) : true) &&
               (this.panelConfig && this.panelConfig.exclude ? !this.panelConfig.exclude.includes(panel.name) : true)
      }).map(panel => {
        const name = panel.config && panel.config.raw ? 'userSetRaw' : panel.name
        return {
          name: panel.name,
          config: panel.config,
          component: filters[name].panel
        }
      })
    }
  }
}
</script>

<style lang="sass">
@import '../../../../../assets/sass/variables'

+with-palette
  .gus-filter__radio
    input
      + label
        color: var(--#{$palette}-text)
        border-color: var(--#{$palette}-uiPrimary-bgColor)
      &:checked
        + label
          // fallbacks
          color: white
          background-color: #666

          color: var(--#{$palette}-uiPrimary-text)
          background-color: var(--#{$palette}-uiPrimary-bgColor)
  .gus-checkbox
    input
      + label::before
        border-color: var(--#{$palette}-uiPrimary-bgColor)
      &:checked
        + label::before
          // fallbacks:
          background-color: #666
          background-color: var(--#{$palette}-uiPrimary-bgColor)

</style>
