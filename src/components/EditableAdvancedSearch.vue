<template>
  <div class='strap-content content'>
    <div class="strap-content__inner">

      <div class="columns" style="margin-top:0">

        <div class="column is-two-thirds">
          <div class="field">
            <div class="control">
              <editable-search-bar
                :value="searchBar"
                keyName="searchBar"
                @change="onComponentChange"
                @onSearch="onSearch"
                @onItemClicked="onItemClicked"
                @onSearchCleared="onSearchCleared"
              />
            </div>
          </div>
        </div>

        <div class="column is-hidden-mobile">
          <div class="field">
            <div class="control">
              <a :href="buttonHref" class="strap-button button is-primary">
                <editable-text @change="onComponentChange" keyName="buttonText" :value="buttonText" />
              </a>
            </div>
          </div>
        </div>

      </div>

      <div class="columns" style="margin-bottom:0">

        <div class="column">
          <div class="columns is-mobile">
            <div class="column">
              <editable-number-dropdown
                @change="onComponentChange"
                @onValueChanged="onBedsChanged"
                keyName="beds"
                unit="Beds"
                :theme="strap.config.style.theme"
                :value="beds"
              />
            </div>
            <div class="column">
              <editable-number-dropdown
                @change="onComponentChange"
                @onValueChanged="onBathsChanged"
                keyName="baths"
                unit="Baths"
                :theme="strap.config.style.theme"
                :value="baths"
              />
            </div>
          </div>
        </div>

        <div class="column">
          <editable-slider-multiple
            @change="onComponentChange"
            @onValueChanged="onPriceChanged"
            keyName="priceRange"
            :label="getPriceLabel"
            :value="priceRange"
            :theme="strap.config.style.theme"
          />
        </div>

        <div class="column">
          <editable-slider
            @change="onComponentChange"
            @onValueChanged="onAreaChanged"
            keyName="area"
            label="At least %1% sqft."
            :value="area"
            :theme="strap.config.style.theme"
          />
        </div>

      </div>

      <div class="field is-hidden-tablet" style="margin-top:.75rem">
        <div class="control">
          <a :href="buttonHref" class="strap-button button is-primary">
            <editable-text @change="onComponentChange" keyName="buttonText" :value="buttonText" />
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from '@/api'
import { encodeSearchUrl } from '@/helpers/listings'
import EditableText from '@/components/editable/EditableText'
import EditableSlider from '@/components/editable/EditableSlider'
import EditableSearchBar from '@/components/editable/EditableSearchBar'
import EditableNumberDropdown from '@/components/editable/EditableNumberDropdown'
import EditableSliderMultiple from '@/components/editable/EditableSliderMultiple'

import defaultSearchBar from '@/store/defaults/components/searchBar'
import defaultText from '@/store/defaults/components/text'
import defaultVueSlider from '@/store/defaults/components/vueSlider'
import defaultNumberDropdown from '@/store/defaults/components/numberDropdown'
import defaultVueSliderMultiple from '@/store/defaults/components/vueSliderMultiple'

export default {
  name: 'EditableAdvancedSearch',

  components: {
    EditableText,
    EditableSlider,
    EditableSearchBar,
    EditableNumberDropdown,
    EditableSliderMultiple
  },

  props: {
    strap: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      searchFilters: {},
    }
  },

  computed: {
    filters () {
      return Object.assign({
        beds: this.beds.initial,
        baths: this.baths.initial,
        area: this.area.initial,
        low_price: this.priceRange.initialStart,
        high_price: this.priceRange.initialEnd,
        interior_size: this.area.initial
      }, this.searchFilters)
    },

    buttonHref () {
      const filters = this.filters
      return encodeSearchUrl({ ...filters, maxPrice: this.priceRange.max })
    },

    getPriceLabel () {
      const lowPrice = this.priceRange.initialStart
      const highPrice = this.priceRange.initialEnd

      if (highPrice >= 1000000) {
        return `Above $%1%`
      } else {
         return `Between $%1% and $%2%`
      }
    },

    state () {
      return this.strap.state
    },

    area () {
      return this.strap.state.area
        ? this.strap.state.area
        : defaultVueSlider({ min: 0, max: 10000, initial: 1400 })
    },

    baths () {
      return this.strap.state.baths
        ? this.strap.state.baths
        : defaultNumberDropdown({ min: 1, max: 10, initial: 2 })
    },

    beds () {
      return this.strap.state.beds
        ? this.strap.state.beds
        : defaultNumberDropdown({ min: 1, max: 10, initial: 2 })
    },

    buttonText () {
      return this.strap.state.buttonText
        ? this.strap.state.buttonText
        : defaultText({ text: 'Find Listings' })
    },

    searchBar () {
      return this.strap.state.searchBar
        ? this.strap.state.searchBar
        : defaultSearchBar()
    },

    priceRange () {
      return this.strap.state.priceRange
        ? this.strap.state.priceRange
        : defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 })
    }
  },

  methods: {
    onSearch ({ query, done }) {
      api.getAutocomplete(this.$store.state, query).then(response => {
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
              'centre_lat': result.centre_lat,
              'centre_lon': result.centre_lon,
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
      }).catch(e => {
        done(false, e)
      })
    },

    onItemClicked (item) {
      this.$set(this, 'searchFilters', item.filters)
    },

    onSearchCleared (item) {
      this.$set(this, 'searchFilters', {})
    },

    onBedsChanged (value) {
      this.beds.initial = value
    },

    onBathsChanged (value) {
      this.baths.initial = value
    },

    onPriceChanged (value) {
      this.priceRange.initialStart = value[0]
      this.priceRange.initialEnd = value[1]
    },

    onAreaChanged (value) {
      this.area.initial = value
    },

    onComponentChange (value) {
      let currentFilterState = {}
      switch (value.keyName) {
        case 'area' : {
          currentFilterState = this.area
        }
        break;
        case 'baths' : {
          currentFilterState = this.baths
        }
        break;
        case 'beds' : {
          currentFilterState = this.beds
        }
        break;
        case 'buttonText' : {
          currentFilterState = this.buttonText
        }
        break;
        case 'searchBar' : {
          currentFilterState = this.searchBar
        }
        break;
        case 'priceRange' : {
          currentFilterState = this.priceRange
        }
        break;
      }
      this.$emit("change", { ...value, currentFilterState })
    }
  }

}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.strap-advanced-search
  text-align: left !important

.field,
.button
  width: 100%
  text-align: left

.label
  font-size: 14px
  text-transform: uppercase
  letter-spacing: 1px
  font-weight: normal
  display: none

.level-item
  +desktop
    flex-grow: 0 !important
    margin-right: 0 !important
    width: calc(50% - .75rem)

.slider__outer
  margin: 0 -8px

.slider__label
  padding: 2px 8px 0 8px
  margin: 0
  text-align: center
  font-size: 15px

.control__placeholder
  white-space: nowrap!important
  overflow: hidden!important
  text-overflow: ellipsis!important
</style>
