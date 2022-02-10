<template>
  <div id="map-listing-search-side-header">
    <div class="title-sort_container">
      <PageTitle />
      <div class="sort-container">
        <Sort />
      </div>
    </div>
    <div class="result-filter_container">
      <p class="num-results">
        Showing <strong>{{totalSearchResults}}</strong> results
      </p>
      <div
        v-if="filters.length > 0"
        class="current-filter_container"
        v-click-outside="hideFilterPopover"
      >
        <p
          class="filter-text"
          @click="showFilterPopover"
        >
          {{ filterText }}
        </p>
        <div
          v-if="filterPopover"
          class="current-filter_popover box"
        >
          <div class="filters-panel__close-wrapper layer-fg">
            <a href="#filters-panel" class="delete is-large filters-panel__close" @click="hideFilterPopover"></a>
          </div>
          <CurrentFilters />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/modules/listing-search/components/Sidebar/PageTitle'
import CurrentFilters from '@/modules/listing-search/components/Sidebar/CurrentFilters'
import Sort from '@/modules/listing-search/components/Toolbar/Sort'
import filterUtils from '../../filters'

export default {
  name: 'MapListingSearchResultHeader',
  components: {
    PageTitle,
    CurrentFilters,
    Sort
  },
  data: () => ({
    filterPopover: false
  }),
  computed: {
    totalSearchResults () {
      return this.$store.state.gus.totalSearchResults
    },
    filters () {
      const filters = this.$store.state.gus.filters
      const config = this.$store.state.gus.config
      // run through all imported panels and if title is not false (is set)
      // display the title as well as a way to clear
      return Object.keys(filterUtils)
        .map(key => {
          const utils = filterUtils[key]
          const title = utils.sidebarText(filters, config)
          const clear = () => this.clearFilters(utils.filters)
          return title ? {title, clear} : false
        })
        .filter(x => x)
    },
    filterText () {
      const titles = this.filters.map(row => row.title).join(', ')
      return titles.length > 30 ? `${titles.slice(0, 30)} ...` : titles
    }
  },
  methods: {
    showFilterPopover () {
      this.filterPopover = true
    },
    hideFilterPopover () {
      this.filterPopover = false
    }
  }
}
</script>
<style scoped lang="sass">
.title-sort_container
  display: flex
  align-items: center
  justify-content: space-between
  @media (max-width: 1023px)
    display: block
  h1
    @media (max-width: 1023px)
      width: 100%

.result-filter_container
  display: flex
  align-items: center
  justify-content: flex-start
  @media (max-width: 1023px)
    display: block
  p
    margin-right: 4rem
    @media (max-width: 1023px)
      width: 100%
      margin: 1rem 0px
    @media (max-width: 768px)
      width: 100%
      margin: 1rem 10px

.filter-text
  text-overflow: ellipsis !important
  font-weight: 700
  cursor: pointer

.current-filter_container
  position: relative
  width: 60%
  @media (max-width: 1023px)
    width: max-content

.current-filter_popover
  position: absolute
  top: 2rem
  left: 0
  z-index: 12

.sort-container
  max-width: 220px
</style>