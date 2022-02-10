<template>
  <div :class="`filters-panel-container${map ? '--map' : ''} ${uniqueIdentifier}`" :ref="$options.name">
    <span @click="toggleFilter"
      :class="`filters-toggle${map ? '--map button is-primary var--gus-bg-primary' : ''}`"
      id="filters-toggle"
    >
      {{ filterTitle ? filterTitle : 'Filter Search Results' }}
      <i class="icon-chevron-down"></i>
    </span>

    <div
      v-if="identifier === uniqueIdentifier"
      v-click-outside="onClickOutside"
      class="filters-panel box var--gus-reset-colors var--gus-box gus-layer-panel"
      id="filters-panel"
     >
      <div class="filters-panel__close-wrapper layer-fg">
        <a href="#filters-panel" class="delete is-large filters-panel__close" @click="onClickOutside"></a>
      </div>
      <Popover :panelConfig="panelConfig" :showAdvanced="showAdvanced"/>
    </div>
  </div>
</template>

<script>
import Panel from '../../partials/Panel'
import Popover from './Popover'

export default {
  name: 'filtersPanelContainer',
  extends: Panel,
  components: {
    Popover
  },
  props: ['map', 'filterTitle', 'panelConfig', 'showAdvanced', 'uniqueIdentifier', 'identifier'],
  data () {
    return {
      name: 'filters'
    }
  },
  methods: {
    onClickOutside () {
      this.$emit('setIdentifier', null)
    },
    toggleFilter () {
      this.$emit('setIdentifier', this.uniqueIdentifier)
    }
  }
}
</script>

<style lang="sass">
@import '../../../../../assets/sass/variables'

.filters-panel-container
  position: relative
  height: 46px

.filters-toggle
  padding: 0
  display: inline-block
  font-weight: 700
  font-size: inherit
  line-height: 46px
  background: none
  border: none
  cursor: pointer
  font-weight: 400
  &:hover
    color: inherit !important
  i
    margin-left: 0.8rem
    font-size: 0.8em
    vertical-align: middle

.filters-toggle--map
  @extend .filters-toggle
  margin-left: 0.75rem
  margin-bottom: 0.75rem
  padding: 0 1em
  height: 46px
  @media (max-width: 768px)
    margin-left: 0
  i
    margin-left: 0.5em
    font-size: 0.8em
  span,
  i
    color: white
  &:hover
    color: white !important

.filters-panel
  position: absolute
  top: 100%
  left: 0
  margin: 0 auto
  padding-top: 0
  transition: 0.2s ease-in-out opacity
  width: 320px
  @media (min-width: 1216px)
    left: auto
    width: 560px
    left: 0

.filters-panel[aria-hidden]
  opacity: 0
  pointer-events: none

.filters-panel__close-wrapper
  position: absolute
  right: 0
  top: 0

.filters-panel__close
  background: rgba(200, 200, 200, 1)
  margin-top: -16px
  margin-right: -16px

.filters-panel__footer
  column-span: all
  text-align: center
  padding: 1.5rem

</style>
