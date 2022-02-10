<template>
  <div class="search-filter-panel__container" v-click-outside="onClickOutside">
    <button
      class="search-filter-panel__button"
      @click="showFilterPanelPopover = !showFilterPanelPopover"
      @mouseover="hoverButton = true"
      @mouseleave="hoverButton = false"
    >
      <span>
        Filters
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :stroke="hoverButton ? 'white' : 'grey'"
          :fill="hoverButton ? 'white' : 'grey'"
          d="M31,24H10v-1c0-0.6-0.4-1-1-1H7c-0.6,0-1,0.4-1,1v1H1c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h5v1c0,0.6,0.4,1,1,1h2   c0.6,0,1-0.4,1-1v-1h21c0.6,0,1-0.4,1-1v-2C32,24.4,31.6,24,31,24z M31,14h-5v-1c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v1H1   c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h21v1c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1v-1h5c0.6,0,1-0.4,1-1v-2C32,14.4,31.6,14,31,14z    M31,4H18V3c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v1H1C0.4,4,0,4.4,0,5v2c0,0.6,0.4,1,1,1h13v1c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1V8   h13c0.6,0,1-0.4,1-1V5C32,4.4,31.6,4,31,4z"
        ></path>
      </svg>
    </button>
    <div class="search-filter-panel__popup" v-if="showFilterPanelPopover">
      <div class="filters-popover__content">
        <hero-filters-panel
          :panelConfig="{include: ['bedrooms', 'budgetRange', 'bathrooms']}"
          :advanced="true"
          :filtersModel="filtersModel"
          @onChange="changeFilters"
        />
        <div class="filter-panel-footer">
          <button class="strap-button button bg-none" @click="resetFilters()">
            RESET FILTERS
          </button>
          <button class="strap-button button bg-grey" @click="applyFilters()">
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeroFiltersPanel from '@/components/ui/HeroFiltersPanel'

export default {
  name: 'SearchFilterPaneldropDown',
  components: {
    HeroFiltersPanel
  },
  data: () => ({
    showFilterPanelPopover: false,
    hoverButton: false,
    filtersModel: {
      bathrooms: null,
      bedrooms: null,
      budget_range: null
      // NO NEED FOR NOW: need when change filter panels
      // property_types: [],
      // interior_size: null,
      // construction_age: null
    }
  }),
  methods: {
    onClickOutside() {
      this.showFilterPanelPopover = false
    },
    changeFilters(payload) {
      const {type, value, checked} = payload
      if (type === 'property_types') {
        if (checked) {
          this.filtersModel['property_types'].push(value)
        } else {
          this.filtersModel['property_types'] = this.filtersModel[
            'property_types'
          ].filter(row => row !== value)
        }
      } else {
        this.filtersModel[type] = value
      }
    },
    resetFilters() {
      this.filtersModel = {
        bathrooms: null,
        bedrooms: null,
        budget_range: null
        // property_types: [],
        // interior_size: null,
        // construction_age: null
      }
      this.$emit('resetFilters')
    },
    applyFilters() {
      this.onClickOutside()
      this.$emit('applyFilters', this.filtersModel)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/_all'
@import '../../assets/sass/variables'

.filters-popover__content .filters
  @media (min-width: 1216px)
    columns: 2
    column-gap: 1rem

+with-palette
  .gus-filter__radio
    input
      + label
        color: var(--default-text)
        border-color: var(--#{$palette}-uiPrimary-bgColor)
      &:checked
        + label
          // fallbacks
          color: var(--default-text)
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

.search-filter-panel__container
  position: relative
  height: 52px
  +mobile
    margin: 7px 0
  +tablet
    margin: 7px 0
  +desktop
    margin: 0 5px

.search-filter-panel__button
  height: 100%
  color: grey
  font-size: 20px
  background-color: white
  border: none
  outline: none
  transition: .3s
  cursor: pointer
  border-radius: 3px
  &:hover
    background-color: #243c57
    color: white
  +mobile
    width: 100%
  +tablet
    width: 100%
  +desktop
    width: 100px

.search-filter-panel__popup
  position: absolute
  right: 0
  margin: 0
  list-style: none
  background: white
  color: grey
  border-radius: 2px
  margin-top: 7px
  font-size: 15px
  box-shadow: 0 0 10px 5px #0000003b
  padding: 10px 25px
  +mobile
    top: 55px
    z-index: 1
    width: 100%
    height: 40vh
    overflow: auto
  +tablet
    top: 55px
    z-index: 1
    width: 100%
    height: 40vh
    overflow: auto
  +desktop
    max-width: 600px
    top: 70px
    z-index: 1
    width: 40vw
    height: auto
    overflow: auto

.bg-grey
  height: 40px
  min-height: 40px
  background-color: #243c57
  &:hover
    opacity: .85
.bg-none
  height: 40px
  min-height: 40px
  background-color: none
  color: #243c57
  &:hover
    color: white
    background-color: #acacac

.filter-panel-footer
  width: 100%
  +mobile
    display: block
  +tablet
    display: flex
    justify-content: space-between
  +desktop
    display: flex
    justify-content: space-between
</style>
