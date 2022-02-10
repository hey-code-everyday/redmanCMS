<template>
  <div class="strap-latest-listings">
    <div class="strap-latest-listings__pagination" :class="isEREB ? 'is-ereb is-hidden-mobile' : ''" v-if="filteredListings.length">
      <div :class="[ 'strap-latest-listings__pagination-left', (first ? 'is-disabled' : false) ]">
        <div class="strap-button button is-primary" @click="previous">
          <span class="icon"><i class="icon-chevron-left"></i></span>
        </div>
      </div>
      <div :class="[ 'strap-latest-listings__pagination-right', (last ? 'is-disabled' : false) ]">
        <div class="strap-button button is-primary" @click="next">
          <span class="icon"><i class="icon-chevron-right"></i></span>
        </div>
      </div>
    </div>
    <div class="strap-container container pad-medium">
      <div class="columns">
        <div class="column is-4 is-description is-aligned-left">
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
          </header>
          <div class='strap-content content is-hidden-mobile'>
            <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
            <br />
            <editable-button-list
              tag="div"
              listKey="buttonList"
              :small="true"
              :list="strap_state.buttonList"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </div>
        </div>

        <div class="column">
          <div class="is-listings">
            <ListingSlide :currentIndex="currentIndex" :error="error" :loading="loading" :listings="listings" :strapPalette="strap_palette" />
          </div>
        </div>
        <div v-show="isEREB && filteredListings.length" class="column is-hidden-desktop is-hidden-tablet" style="padding: 0">
          <div class="strap-latest-listings__pagination" :class="isEREB ? 'is-ereb' : ''" v-if="filteredListings.length">
            <div :class="[ 'strap-latest-listings__pagination-left', (first ? 'is-disabled' : false) ]">
              <div class="strap-button button is-primary" @click="previous">
                <span class="icon"><i class="icon-chevron-left"></i></span>
              </div>
            </div>
            <div :class="[ 'strap-latest-listings__pagination-right', (last ? 'is-disabled' : false) ]">
              <div class="strap-button button is-primary" @click="next">
                <span class="icon"><i class="icon-chevron-right"></i></span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-hidden-tablet">
          <div class='strap-content content'>
            <editable-button-list
              tag="div"
              listKey="buttonList"
              :list="strap_state.buttonList"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clamp } from '@/util'
// import api from '@/api'
import mixinStrap from '@/mixins/strap'
import ListingSlide from '@/components/ListingSlide.vue'

import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

import {
  // makeFilters,
  // decodeSearch,
  // mapListings,
  prefetchListings,
  preconfiguredOptions
} from '@/helpers/listings'

export default {
  name: 'StrapLatestListings',

  components: {
    ListingSlide,
    EditableButtonList,
    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  //if auto-rotating
  created: function () {
    if (this.strap.state.autoRotateListings) {
      setInterval(() => {
        if (this.currentIndex >= this.strap.state.numListings - 1 ) {
          this.currentIndex = 0
        } else {
          this.currentIndex = clamp(this.currentIndex + 1, 0, this.listings.length - 1)
        }
      }, this.strap.state.autoRotateSpeed * 1000);
    }
  },

  prefetch (resolve, reject, store, state) {
    prefetchListings(resolve, reject, store, state, { size: state.state.numListings })
  },

  afterPrefetch (err, result) {
    if (err) {
      this.loading = false
      this.$set(this, 'error', err)

      console.warn(err)
      return
    }

    const listings = result.listings
    const search = result.search

    this.loading = false
    this.$set(this, 'listings', listings)
    this.$set(this, 'preconfiguredSearch', search || {})
  },

  data () {
    return {
      error: false,
      loading: true,
      listings: [],
      currentIndex: 0,
      preconfiguredSearch: {}
    }
  },

  computed: {
    filteredListings () {
      if (this.listings) return this.listings.slice(this.currentIndex)

      return []
    },

    first () {
      return this.currentIndex === 0
    },

    last () {
      return this.currentIndex === this.listings.length - 1
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  methods: {
    fetchData () {
      if (!this.$store.getters.authenticated) return

      new Promise((resolve, reject) => {
        const filters = { size: this.strap_state.numListings }
        prefetchListings(resolve, reject, this.$store, this.strap_state, filters)
      }).then(result => {
        const listings = result.listings
        const search = result.search

        this.loading = false
        this.$set(this, 'error', false)
        this.$set(this, 'listings', listings)
        this.$set(this, 'preconfiguredSearch', search || {})
      }).catch(err => {
        console.warn(err)

        this.loading = false
        this.$set(this, 'error', err)
      })
    },

    next () {
      this.currentIndex = clamp(this.currentIndex + 1, 0, this.listings.length - 1)
    },

    previous () {
      this.currentIndex = clamp(this.currentIndex - 1, 0, this.listings.length - 1)
    }
  },

  mounted () {
    if (this.listings.length === 0) this.fetchData()
  },

  watch: {
    strap_state () {
      this.fetchData()
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Latest Listings', size: 2 }),
      text: defaultQuill(),
      buttonList: [defaultButton()],
      useRealtorListings: false,
      centerSearch: false,
      numListings: 50,
      predefinedSearch: '',
      useAdvancedSetup: false,
      advancedSetup: '',
      autoRotateListings: false,
      autoRotateSpeed: 5
    }
  },

  migrations (strap, state) {
    return [
      {
        useRealtorListings: false,
        centerSearch: false,
        numListings: 50
      }, // Issue #40
      {
        predefinedSearch: ''
      }, // Issue #73
      {
        useAdvancedSetup: false,
        advancedSetup: ''
      }, // Issue #127
      {
        autoRotateListings: false,
        autoRotateSpeed: 5
      } // Issue #725
    ]
  },

  schema () {
    return [
      {
        title: 'Listings',
        tabs: [
          {
            title: 'Display Options',
            initial: true,
            fields: [
              {
                key: 'state.numListings',
                type: 'number',
                label: 'Number of Listings',
                default: 50,
                hint: 'Number of listings to display. Between 2 and 50.',
                minValue: 2,
                maxValue: 50,
                step: 1
              },
              {
                key: 'state.autoRotateListings',
                type: 'checkbox',
                label: 'Auto Rotate Listings',
                text: 'Auto Rotate through listings. May decrease performance',
                default: false,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.autoRotateSpeed',
                type: 'number',
                label: 'Auto Rotate Speed',
                default: 5,
                hint: 'Speed (in seconds) of rotation',
                minValue: 1,
                maxValue: 10,
                step: 1
              },
            ]
          },
          {
            title: 'Listings Setup',
            fields: [
              {
                key: 'state.predefinedSearch',
                type: 'dropdown',
                label: 'Preconfigured Search',
                default: 'slide',
                hint: 'Display results from a preconfigured search',
                options () {
                  return preconfiguredOptions.call(this)
                }
              },
              {
                key: 'state.centerSearch',
                type: 'checkbox',
                label: 'Local Listings',
                text: 'Only show results from within my area',
                default: true,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.useRealtorListings',
                type: 'checkbox',
                label: 'Realtor Listings',
                text: 'Only display listings posted by the Realtor',
                default: false,
                onValue: true,
                offValue: false
              }
            ]
          }
        ]
      },
      {
        title: 'Advanced Setup',
        tabs: [
          {
            title: 'Listings Setup',
            initial: true,
            fields: [
              {
                key: 'state.useAdvancedSetup',
                type: 'checkbox',
                label: 'Use Advanced Setup',
                text: 'Override the listings setup with my custom filters',
                default: false,
                onValue: true,
                offValue: false,
                hidden: true
              },
              {
                key: 'state.advancedSetup',
                type: 'multiText',
                label: 'Advanced Setup',
                default: '',
                hint: 'JSON object that represents the search filters.',
                hidden: true
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

$listingTransition: all 500ms
$listingTransform: translateX(calc(-100% - 2rem))

.strap-latest-listings
  position: relative
  min-height: 515px
  overflow-x: hidden
  max-width: 100%

.columns
  position: relative
  z-index: 0

.is-listings
  +tablet
    padding-left: 4.25rem

.strap-latest-listings__pagination
  position: absolute
  z-index: 5
  display: flex
  pointer-events: none
  top: 50%
  right: 20px
  transform: translateY(-50%)
  justify-content: space-between

  +desktop
    &.is-ereb
      top: 90%
  +tablet
    &.is-ereb
      top: 90%

.strap-latest-listings__pagination-left
  margin-right: 1rem
  pointer-events: auto

.strap-latest-listings__pagination-right
  pointer-events: auto

.strap-button
  min-width: 52px
  transition: opacity 250ms ease-in-out

.is-disabled
  .strap-button
    pointer-events: none
    opacity: 0

  &.strap-latest-listings__pagination-right
    .strap-button
      opacity: 0.6

+mobile
  .strap-latest-listings__pagination
    left: 10px
    right: 10px
    top: 36%

    &.is-ereb
      position: relative
      margin: 25px 10px 0px -8px

      .strap-button
        min-width: 100px

    .strap-latest-listings__pagination-left
      justify-self: flex-start

    .strap-latest-listings__pagination-right
      justify-self: flex-end

</style>
