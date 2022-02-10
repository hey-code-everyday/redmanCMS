<template>
  <div class="hero hero-separated-search">
    <div class="pad-small">
      <div class='hero-head strap-container container pad-small' v-if='strap_editing || (strap_state.agentImage.imageUrl || strap_state.logoImage.imageUrl)'>
        <div class='level hero-level'>
          <div class='level-item'>
            <div class='site-logo' v-if='strap_editing || strap_state.logoImage.imageUrl'>
              <editable-image @change="$strap_onComponentChange" keyName="logoImage" :value="strap_state.logoImage" />
            </div>
          </div>
          <div class='level-item' style='height:80px' v-if='strap_state.agentImage.imageUrl && strap_state.logoImage.imageUrl'>
            <div class='hero-level-sep'><span :style='{ backgroundColor: strap_palette.text }'></span></div>
          </div>
          <div class='level-item' v-if='strap_editing || strap_state.agentImage.imageUrl'>
            <div class='agent-spotlight'>
              <editable-image @change="$strap_onComponentChange" keyName="agentImage" :value="strap_state.agentImage" />
            </div>
          </div>
        </div>
      </div>
      <div class='hero-body strap-container container pad-small'>
        <div>
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
          </header>
          <p class='strap-content content'>
            <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
          </p>
        </div>
        <div class='space-wide space-medium'></div>
      </div>
    </div>
    <div class='hero-foot pad-small' :style='getBackgroundColor'>
      <editable-listing-search-bar
        v-if="strap_state.footerComponent === 'search'"
        @change="$strap_onComponentChange"
        keyName="searchBar"
        :value="strap_state.searchBar"
      />
      <editable-button-list
        v-if="strap_state.footerComponent === 'buttons'"
        tag="div"
        listKey="buttonList"
        :list="strap_state.buttonList"
        :onCreate="$strap_onListCreate"
        :onChange="$strap_onListChange"
        :onDelete="$strap_onListDelete"
      />
      <editable-advanced-search
        v-if="strap_state.footerComponent === 'advancedSearch'"
        @change="$strap_onComponentChange"
        keyName="AdvSearchBar"
        :strap="strap"
        class='strap-container container pad-small advanced-search-container'
      />
      <search-bar-with-filters
        v-if="strap_state.footerComponent === 'filteredSearch'"
        @change="$strap_onComponentChange"
        keyName="FilteredSearchBar"
        :strap="strap"
        :background="strap_state.searchBar.background"
        :placeholder="strap_state.searchBar.placeholder"
      />
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableImage from '@/components/editable/EditableImage'
import EditableButtonList from '@/components/editable/EditableButtonList'
import EditableListingSearchBar from '@/components/editable/EditableListingSearchBar'
import EditableAdvancedSearch from '@/components/EditableAdvancedSearch'
import SearchBarWithFilters from '@/components/SearchBarWithFilters'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultImage from '@/store/defaults/components/image'
import defaultButton from '@/store/defaults/components/button'
import defaultSearchBar from '@/store/defaults/components/searchBar'
import defaultText from '@/store/defaults/components/text'
import defaultVueSlider from '@/store/defaults/components/vueSlider'
import defaultNumberDropdown from '@/store/defaults/components/numberDropdown'
import defaultVueSliderMultiple from '@/store/defaults/components/vueSliderMultiple'

export default {
  name: 'HeroSeparatedSearch',

  components: {
    EditableImage,
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableListingSearchBar,
    EditableAdvancedSearch,
    SearchBarWithFilters
  },

  mixins: [mixinStrap],

  computed: {
    getBackgroundColor() {
      if (this.strap_state.footerComponent === 'advancedSearch') {
        return {
          backgroundColor: this.strap_palette.accentColor
        }
      } else {
        return {
          backgroundColor: this.strap_palette.uiPrimary.bgColor
        }
      }
    }
  },

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      title: defaultTitle({ html: 'Hero Separated Search' }),
      agentImage: defaultImage(),
      logoImage: defaultImage(),
      buttonList: [defaultButton({ type: 'outlined-light' })],
      searchBar: defaultSearchBar({ background: 'dark' }),
      footerComponent: 'search',
      estimateModalTitle: defaultTitle({html: 'Estimate', size: 3}),
      area: defaultVueSlider({ min: 0, max: 10000, initial: 1400 }),
      baths: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
      beds: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
      buttonText: defaultText({ text: 'Find Listings' }),
      priceRange: defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 }),
    }
  },

  schema () {
    return [
      {
        title: 'Footer',
        tabs: [
          {
            title: 'Call to Action',
            fields: [
              {
                key: 'state.footerComponent',
                type: 'dropdown',
                label: 'Type',
                default: 'buttons',
                options: [
                  { text: 'Buttons', value: 'buttons' },
                  { text: 'Listing Search Bar', value: 'search' },
                  { text: 'Advanced Listing Search Bar', value: 'advancedSearch' },
                  { text: 'Filtered Search Bar', value: 'filteredSearch' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
</script>

<style scoped lang="sass">
.hero-separated-search

.strap-container.pad-small.advanced-search-container
  padding-top: 0px

</style>
