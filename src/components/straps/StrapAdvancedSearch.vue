<template>
  <div class="strap-advanced-search">
    <div class="strap-container container pad-small">
      <editable-advanced-search
        @change="$strap_onComponentChange"
        keyName="AdvSearchBar"
        :strap="strap"
      />
    </div>
  </div>
</template>

<script>
import EditableAdvancedSearch from '@/components/EditableAdvancedSearch'
import mixinStrap from '@/mixins/strap'

import defaultSearchBar from '@/store/defaults/components/searchBar'
import defaultText from '@/store/defaults/components/text'
import defaultVueSlider from '@/store/defaults/components/vueSlider'
import defaultNumberDropdown from '@/store/defaults/components/numberDropdown'
import defaultVueSliderMultiple from '@/store/defaults/components/vueSliderMultiple'

export default {
  name: 'StrapAdvancedSearch',

  components: {
    EditableAdvancedSearch,
    mixinStrap
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      area: defaultVueSlider({ min: 0, max: 10000, initial: 1400 }),
      baths: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
      beds: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
      buttonText: defaultText({ text: 'Find Listings' }),
      searchBar: defaultSearchBar(),
      priceRange: defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 }),
    }
  }
}
</script>

</style>
