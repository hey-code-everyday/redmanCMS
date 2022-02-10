<template>
  <div class="hero hero-dual-agent-aside">
    <div class="custom-strap-container">

      <div class='columns'>

        <!-- Agent Image -->
        <div
          class='column is-3 is-hidden-touch is-agent-left is-agent-left'
          :style="`background-image:url(${strap_state.agentImage1.imageUrl})`"
        >
          <editable-image v-if="$store.state.editing" @change="$strap_onComponentChange" keyName="agentImage1" :value="strap_state.agentImage1" class="agent-image" />
        </div>

        <!-- Other Content -->
        <div class='column pad-big-top pad-big-bottom is-content'>
          <div class="column__inner">
            <div class='site-logo' v-if='strap_editing || strap_state.logoImage.imageUrl'>
              <editable-image @change="$strap_onComponentChange" keyName="logoImage" :value="strap_state.logoImage" />
            </div>
            <br v-if='strap_editing || strap_state.logoImage.imageUrl' />

            <div>
              <header class='strap-header content'>
                <editable-title 
                @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
              </header>
              <p class='strap-content content'>
                <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
              </p>
            </div>

            <div>
              <br />
              <editable-listing-search-bar
                v-if="strap_state.footerComponent === 'search' || strap_state.footerComponent === 'searchAndButtons' "
                @change="$strap_onComponentChange"
                keyName="searchBar"
                :value="strap_state.searchBar"
              />
              <div class="custom-strap-button">
                <editable-button-list
                  v-if="strap_state.footerComponent === 'buttons' || strap_state.footerComponent === 'searchAndButtons' "
                  tag="div"
                  listKey="buttonList"
                  :list="strap_state.buttonList"
                  :onCreate="$strap_onListCreate"
                  :onChange="$strap_onListChange"
                  :onDelete="$strap_onListDelete"
                />
              </div>
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
            </div>
          </div>
        </div>

        <div
          class='column is-3 is-hidden-touch is-agent-right'
          :style="`background-image:url(${strap_state.agentImage2.imageUrl})`"
        >
          <editable-image v-if="$store.state.editing" @change="$strap_onComponentChange" keyName="agentImage2" :value="strap_state.agentImage2" class="agent-image" />
        </div>

      </div>

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
  name: 'HeroDualAgentAside',

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

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      title: defaultTitle({ html: 'Hero ' }),
      agentImage1: defaultImage(),
      agentImage2: defaultImage(),
      logoImage: defaultImage(),
      agentOnLeft: true,
      buttonList: [defaultButton()],
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
                  { text: 'Search bar and Buttons', value: 'searchAndButtons' },
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
@import '../../assets/sass/variables'

.hero-dual-agent-aside

  .custom-strap-container
    padding-left: 1.5em
    padding-right: 1.5em
    width: 100%
    margin-top: 10px

  .column
    &.is-agent-left,
    &.is-agent-right
      background-size: contain
      background-repeat: no-repeat

    &.is-agent-left
      display: flex
      align-items: flex-end
      justify-content: flex-end
      background-position: 100% 100%
      margin: 20px 20px 12px 0

    &.is-agent-right
      display: flex
      align-items: flex-start
      justify-content: flex-start
      background-position: 0 100%
      margin: 20px 0 12px 20px

    &.is-content
      display: flex
      align-items: center
      justify-content: flex-start
      min-width: 50%

      +touch

  .custom-strap-button
    margin-top: 25px
  
  .column__inner
    width: 100%

  .agent-image
    height: 100%
    width: 100%
    display: flex

    /deep/
      img
        opacity: 0
        width: 100% !important
        height: 100% !important

/deep/
  .control__placeholder
    white-space: nowrap!important
    overflow: hidden!important
    text-overflow: ellipsis!important

</style>
