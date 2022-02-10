<template>
  <div class="strap-basic-search-with-buttons">
    <div class="strap-content__inner search-custom-container">
      <div class="columns is-mobile search-column" >
        <div class="column search-bar-column">
          <div class="search-bar-container">
            <editable-listing-search-bar
            @change="$strap_onComponentChange"
            keyName="searchBar"
            :value="strap_state.searchBar"
            />
          </div>
        </div>
        <div class="column is-7-desktop is-1-touch navigation-column">
          <nav class="navbar is-transparent" role="navigation" aria-label="dropdown navigation">
            <div class="navbar-brand">
              <div class="navbar-item is-pinned is-hidden-desktop">
                <div class="navbar-burger" @click="$store.commit('SHOW_MOBILE_NAV')">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
            <div class="navbar-menu">
              <div class="navbar-end">
                <nav-bar :nav="$store.state.header.nav" class="navbar-item" :boxed="true" :branded="true" />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import mixinHeader from '@/mixins/header'
import EditableListingSearchBar from '@/components/editable/EditableListingSearchBar'
import NavBar from '@/components/NavBar'

import defaultSearchBar from '@/store/defaults/components/searchBar'

export default {
  name: 'StrapBasicSearchWithButtons',

  components: {
    EditableListingSearchBar,
    NavBar
  },

  mixins: [mixinStrap, mixinHeader],

  props: {
    header: []
  },

  initialState (strap, state) {
    return {
      searchBar: defaultSearchBar(),
    }
  },

  schema () {
    return []
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-basic-search-with-buttons
  text-align: left !important

  .columns 
    margin-bottom: 0px !important

  .search-bar-column
    

  .search-custom-container
    margin: 1rem 0.75rem 0 0.75rem

  .search-bar-container
    margin-left: 1rem

</style>
