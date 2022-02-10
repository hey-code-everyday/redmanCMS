<template>
  <div class="strap-basic-search">
    <div class="strap-container container pad-small">
      <div class='strap-content content'>
        <div class="strap-content__inner">
          <editable-listing-search-bar
          @change="$strap_onComponentChange"
          keyName="searchBar"
          :value="strap_state.searchBar"
        />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import EditableListingSearchBar from '@/components/editable/EditableListingSearchBar'

import defaultSearchBar from '@/store/defaults/components/searchBar'

export default {
  name: 'StrapBasicSearch',

  components: {
    EditableListingSearchBar,
  },

  mixins: [mixinStrap],


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

.strap-basic-search
  text-align: left !important

</style>
