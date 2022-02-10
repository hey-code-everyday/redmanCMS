<template>
  <div class="hero hero-agent-aside-large">
    <div class="strap-container container">

      <div class='columns'>
      <div class="column is-1 is-hidden-touch "></div>
        <!-- Agent Image -->
        <div
          v-if="strap_state.agentOnLeft"
          class='column is-hidden-touch is-agent-left is-3'
          :style="`background-image:url(${strap_state.agentImage.imageUrl})`"
        >
          <editable-image v-if="$store.state.editing" @change="$strap_onComponentChange" keyName="agentImage" :value="strap_state.agentImage" class="agent-image" />
        </div>

        <!-- Other Content -->
        <div class='column pad-big-bottom is-content'>
          <div class="column__inner">
            <header class='strap-header content'>
              <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
            </header>

            <div>
              <br />
              <editable-listing-search-bar
                v-if="strap_state.footerComponent === 'search' || strap_state.footerComponent === 'searchAndButtons' "
                @change="$strap_onComponentChange"
                keyName="searchBar"
                :value="strap_state.searchBar"
                class="is-small-bar"
              />
            </div>
            <div class="pad-medium-top" v-if="strap_state.footerComponent === 'buttons' || strap_state.footerComponent === 'searchAndButtons' ">
              <editable-button-list
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

        <!-- Agent Image (flipped) -->
        <div
          v-if="!strap_state.agentOnLeft"
          class='column is-hidden-touch is-agent-right is-3'
          :style="`background-image:url(${strap_state.agentImage.imageUrl})`"
        >
          <editable-image v-if="$store.state.editing" @change="$strap_onComponentChange" keyName="agentImage" :value="strap_state.agentImage" class="agent-image" />
        </div>
        <div class="column is-hidden-touch is-1"></div>
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
  name: 'HeroAgentAsideLarge',

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
      agentImage: defaultImage(),
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
        title: 'Agent Appearance',
        tabs: [
          {
            title: 'Display',
            fields: [
              {
                key: 'state.agentOnLeft',
                type: 'checkbox',
                label: 'Agent Position',
                text: 'Place the agent image on the left',
                default: false,
                onValue: true,
                offValue: false
              }
            ]
          }
        ]
      },
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
                  { text: 'Buttons and Listing Search Bar', value: 'searchAndButtons' },
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

.hero-agent-aside-large
  .container
    min-width: 100%
    padding: 15px 0 12px 0
    +touch
      font-size: 3vw

    +desktop
      font-size: .75vw

  .columns
    width: 100%
    height: 100%

  .column
    +touch
      padding-top: 50px!important
      padding-bottom: 50px!important

    &.is-agent-left,
    &.is-agent-right
      background-size: contain
      background-repeat: no-repeat
      display: flex
      align-items: flex-end
      justify-content: flex-end
      margin-bottom: 0

      &.is-agent-left
        background-position: right bottom

      &.is-agent-right
        background-position: left bottom

    &.is-content
      display:flex
      align-items:center
      justify-content: flex-start
      min-width: 50%
      padding-top: 150px

  &.title
    padding-top: 100px

  .column__inner
    width: 100%

  .is-small-bar
    +desktop
      margin-left: 150px
      margin-right: 150px

  .agent-image
    height: 100%
    width: 100%
    display: flex
    padding-left: 100px

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
