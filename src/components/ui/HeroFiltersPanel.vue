<template>
  <form class="filters var--app-default">
    <template v-for="(panel, i) in panels">
      <component
        :is="panel.component"
        :key="i"
        :config="panel.config"
        :filtersModel="filtersModel"
        @onChange="componentChange"
      />
    </template>
  </form>
</template>

<script>
import heroFilters from './heroFilters'

export default {
  name: 'HeroFiltersPanel',
  props: ['advanced', 'panelConfig', 'filtersModel'],
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
          component: heroFilters[name].panel
        }
      })
    }
  },
  methods: {
    componentChange(payload) {
      this.$emit('onChange', payload)
    }
  }
}
</script>

<style lang="sass">
@import '../../assets/sass/variables'

+with-palette
  .gus-filter__radio
    input
      + label
        color: var(--default-text)
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
