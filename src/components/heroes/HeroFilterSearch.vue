<template>
  <div class="hero">
    <div class="strap-container container pad-medium">
      <div :class="`strap-content content align-left ${$store.state.editing ? '' : 'mb-0-5'}`">
        <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
      </div>
      <header class='strap-header content align-left'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <footer class='strap-footer content'>
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
        />
        <search-bar-with-filters
          v-if="strap_state.footerComponent === 'filteredSearch'"
          @change="$strap_onComponentChange"
          keyName="FilteredSearchBar"
          :strap="strap"
          :background="strap_state.searchBar.background"
          :placeholder="strap_state.searchBar.placeholder"
        />
      </footer>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import SocialIcons from '@/components/SocialIcons'
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
  name: 'HeroFilterSearch',

  components: {
    SocialIcons,
    EditableTitle,
    EditableQuill,
    EditableImage,
    EditableButtonList,
    EditableListingSearchBar,
    EditableAdvancedSearch,
    SearchBarWithFilters
  },

  mixins: [mixinStrap],

  computed: {
    isAdvancedSearch() {
      return this.strap_state.footerComponent === 'advancedSearch'
        ? true
        : false
    }
  },

  initialState(strap, state) {
    return {
      text: defaultQuill(),
      title: defaultTitle({html: 'Hero Filter Search'}),
      agentImage: defaultImage({width: 100}),
      logoImage: defaultImage(),
      buttonList: [defaultButton()],
      searchBar: defaultSearchBar({background: 'dark'}),
      footerComponent: 'search',
      estimateModalTitle: defaultTitle({html: 'Estimate', size: 3}),
      area: defaultVueSlider({ min: 0, max: 10000, initial: 1400 }),
      baths: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
      beds: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
      buttonText: defaultText({ text: 'Find Listings' }),
      priceRange: defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 }),
    }
  },

  schema() {
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
                  {text: 'Buttons', value: 'buttons'},
                  {text: 'Listing Search Bar', value: 'search'},
                  {text: 'Advanced Listing Search Bar', value: 'advancedSearch'},
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
@import '../../assets/sass/variables'

.align-left
  text-align: left

.hero-wide-search

.hero__social-icons
  position: absolute
  z-index: 1
  pointer-events: none
  top: 0
  left: 1.5rem
  height: 100%
  display: flex

.hero__icons-wrapper
  pointer-events: auto

.advanced-search-social-icons
  +mobile
    align-items: end
    margin-top: 70px
  +tablet
    align-items: center
    margin-top: -75px
  +desktop
    align-items: center
    margin-top: 0px
.default-social-icons
  align-items: center

.strap-container
  +mobile
    width: 100%
  +tablet
    width: 100%
  +desktop
    width: 65rem

.strap-footer
  margin-top: 0
  div
    margin-top: 0
.strap-header
  margin-bottom: 0
  h1
    margin-bottom: 1rem
.mb-0-5
  margin-bottom: .5rem
  div
    margin-top: 3rem
</style>
