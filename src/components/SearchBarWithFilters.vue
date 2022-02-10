<template>
  <div class="strap-content content">
    <div class="strap-content__inner">
      <div class="columns">
        <div class="column">
          <div class="field">
            <div class="control">
              <search-type-dropdown @onSearchTypeChange="onSearchTypeChange" />
              <div class="search-input">
                <address-auto-complete v-if="searchType === 'sell'" />
                <editable-search-bar
                  v-else
                  :value="searchBar"
                  keyName="searchBar"
                  @change="onComponentChange"
                  @onItemClicked="onItemClicked"
                  @onSearch="onSearch"
                />
              </div>
              <template v-if="searchType !== 'sell'">
                <search-filter-panel-dropdown
                  @applyFilters="applyFilters"
                  @resetFilters="resetFilters"
                />
                <a
                  :href="buttonHref"
                  class="strap-button button is-primary search-button"
                >
                  START SEARCH
                </a>
              </template>
              <template v-else>
                <button
                  class="strap-button button is-primary estimate-button"
                  @click="showEstimateModal"
                >
                  ESTIMATE
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps)

import api from '@/api'
import SearchTypeDropdown from '@/components/ui/SearchTypeDropdown'
import SearchFilterPanelDropdown from '@/components/ui/SearchFilterPanelDropdown'
import EditableSearchBar from '@/components/editable/EditableSearchBar'
import defaultSearchBar from '@/store/defaults/components/searchBar'
import defaultVueSliderMultiple from '@/store/defaults/components/vueSliderMultiple'
import AddressAutoComplete from '@/components/ui/AddressAutoComplete'

import {encodeSearchUrl} from '@/helpers/listings'

export default {
  name: 'SearchBarWithFilters',

  components: {
    SearchTypeDropdown,
    SearchFilterPanelDropdown,
    EditableSearchBar,
    AddressAutoComplete
  },

  props: {
    strap: {
      type: Object,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    background: {
      type: String,
      default: 'light'
    }
  },

  data() {
    return {
      loading: false,
      searchBar: {},
      searchType: 'buy',
      searchFilters: {},
      searchArea: {}
    }
  },

  beforeMount () {
    try {
      if (this.apiKey === '') {
        this.$store.dispatch('showNotification', { message: 'Set your Google Map API key for address auto completion.', type: 'branded' })
        return
      }

      VueGoogleMaps.loadGmapApi({
        key: this.apiKey,
        libraries: 'places',
        installComponents: true
      })
    } catch (e) {
      this.$store.dispatch('showNotification', { message: 'Your API key is not correct.', type: 'error' })
    }
  },

  created() {
    this.$set(this, 'searchBar', defaultSearchBar())
  },

  computed: {
    beds() {
      return this.searchFilters.bedrooms
        ? this.searchFilters.bedrooms.replace('p', '')
        : null
    },
    baths() {
      return this.searchFilters.bathrooms
        ? this.searchFilters.bathrooms.replace('p', '')
        : null
    },
    lowPrice() {
      return this.searchFilters.budget_range
        ? this.searchFilters.budget_range[0]
        : null
    },
    highPrice() {
      return this.searchFilters.budget_range
        ? this.searchFilters.budget_range[1]
        : null
    },
    buttonHref() {
      if (this.searchType === 'buy') {
        return encodeSearchUrl({
          ...this.searchArea,
          low_price: this.lowPrice,
          high_price: this.highPrice,
          beds: this.beds,
          baths: this.baths,
          maxPrice: this.maxPrice
        })
      } else {
        return encodeSearchUrl(this.searchArea)
      }
    },
    apiKey() {
      const autoCompletionKey = this.$store.state.website.integrations.analytics.autoCompletionKey
      if (!autoCompletionKey) return ''
      return autoCompletionKey.trackingID
    },
    maxPrice () {
      try {
        const storeBudgetRange = this.$store.state.gus.config.panels.find(panel => panel.name === 'budgetRange')
        if (storeBudgetRange) {
          const maxFromStoreConfig = storeBudgetRange.config.maxPrice
          return maxFromStoreConfig
        } else {
          return this.strap.state.priceRange.max
            ? this.strap.state.priceRange.max
            : defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 })['max']
        }
      } catch (e) {
        return this.strap.state.priceRange.max
          ? this.strap.state.priceRange.max
          : defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 })['max']
      }
    }
  },

  watch: {
    apiKey() {
      this.$store.dispatch('showNotification', { message: 'Reload page to test new API key.', type: 'branded' })
    }
  },

  methods: {
    onSearch({query, done}) {
      api
        .getAutocomplete(this.$store.state, query)
        .then(response => {
          const list = {}

          response.body.forEach(result => {
            const category = list[result.type] || {
              title: result.type[0].toUpperCase() + result.type.slice(1),
              items: []
            }

            const item = {
              label: result.locationTitle
            }

            if (result['whosonfirst.id']) {
              item.filters = {
                'whosonfirst.id': result['whosonfirst.id'],
                sort: 'list_date_des'
              }
            } else {
              item.filters = {
                centre_lat: result.centre_lat,
                centre_lon: result.centre_lon,
                sort: 'geo_centre'
              }
            }

            category.items.push(item)

            list[result.type] = category
          })

          const listArr = []
          for (let key in list) {
            listArr.push(list[key])
          }

          done(listArr)
        })
        .catch(e => {
          done(false, e)
        })
    },
    onComponentChange(value) {
      this.$emit('change', value)
    },
    onItemClicked(item) {
      this.searchArea = item.filters
    },
    onSearchTypeChange(newType) {
      this.searchType = newType
    },
    applyFilters(filters) {
      this.searchFilters = { ...filters }
    },
    resetFilters() {
      this.searchFilters = {}
    },
    showEstimateModal() {
      this.$store.commit('SHOW_ESTIMATE_MODAL')
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/_all'
@import '../assets/sass/variables'

.columns
  margin: 0
.column
  +mobile
    background-color: none
    padding: 0
  +tablet
    background-color: none
    padding: 0
  +desktop
    background-color: white
    padding: .5rem

.search-input
  width: 100%
  color: grey
  overflow: unset !important
  +mobile
    margin: 0
  +tablet
    margin: 0
  +desktop
    margin: 0 5px


.search-bar
  position: relative
  width: 100%

.input,
.field,
.control,
.dropdown,
.dropdown-menu,
.dropdown-trigger
  width: 100%

.control
  .input
    height: 52px
    padding-left: 5em
    padding-right: 13em
    border: none

    &:focus
      outline: none
      box-shadow: none

  &.is-loading
    &:after
      width: 2em
      height: 2em

  +mobile
    display: block
  +tablet
    display: block
  +desktop
    display: flex

.search-button
  margin: 0
  +mobile
    width: 100%
  +tablet
    width: 100%
  +desktop
    width: 12rem

.estimate-button
  margin: 0
  +mobile
    margin-top: .4rem
    width: 100%
  +tablet
    margin-top: .4rem
    width: 100%
  +desktop
    margin-top: 0
    width: 12rem
</style>
