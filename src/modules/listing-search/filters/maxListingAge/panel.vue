<template>
  <div class="gus-filter gus-filter--budget">
    <h3 class="gus-filter__title var--gus-title">Maximum Listing Age</h3>

    <div class="gus-filter__field">
      <p class="gus-filter__text-value">{{textValue}}</p>
      <Range
        :min="1"
        :max="maxListingAge"
        :interval="interval"
        :value="value"
        minLabel="New Listing"
        :maxLabel="maxListingAgeLabel"
        @change="onChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '../partials/Range'
import {numericValue, rawValue} from './utils'

export default {
  name: 'maxListingAgePanel',

  props: ['config'],

  data: function () {
    return {
      maxListingAge: this.config.maxListingAge,
      maxListingAgeLabel: `${this.config.maxListingAge} days +`,
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      const raw = this.$store.getters.filterValues('listing_age', null)
      const numeric = raw ? numericValue(raw) : this.maxListingAge
      return numeric
    },

    textValue: function () {
      if (this.value === 1) {
        return 'Listed today'
      } else if (this.value < this.maxAge) {
        return `Listed less than ${this.value} days ago`
      } else {
        return 'Listed anytime'
      }
    }
  },

  components: {
    Range
  },

  methods: {
    onDrag: function (newValue) {
      if (newValue < this.maxListingAge) {
        const raw = rawValue(newValue)
        this.$store.commit('setFilters', {listing_age: raw})
      } else {
        this.$store.commit('unsetFilters', 'listing_age')
      }
    },

    onChange: function (newValue) {
      this.onDrag(newValue)
      this.$store.dispatch('submit')
    }
  }
}
</script>
