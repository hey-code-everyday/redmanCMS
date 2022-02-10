<template>
  <div class="sidebar__outer">
    <div class="sidebar" refs="sidebar">

      <PageTitle />
      <NumResults />
      <div class="hide-1023-width">
        <SaveSearch />
      </div>
      <CurrentFilters />
      <PopularSearches />

    </div>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue'
import SaveSearch from '../SaveSearch'
import NumResults from './NumResults.vue'
import CurrentFilters from './CurrentFilters.vue'
import PopularSearches from './PopularSearches'
export default {
  name: 'sidebar',
  components: {
    PageTitle,
    NumResults,
    SaveSearch,
    CurrentFilters,
    PopularSearches
  }
}
</script>

<style lang="sass" scoped>
.sidebar__outer
  z-index: 1 !important
  position: sticky
  top: 50px
.hide-1023-width
  display: block
  @media (max-width: 1023px)
    display: none
</style>
