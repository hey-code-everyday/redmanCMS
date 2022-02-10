<template>
  <div class="gus-filter gus-filter--budget">
    <h3 class="gus-filter__title var--gus-title">Budget Range</h3>

    <div class="gus-filter__field">
      <p class="gus-filter__text-value">{{textValue}}</p>
      <Range
        :min="0"
        :max="maxPrice"
        :interval="interval"
        :value="value"
        minLabel="Any price"
        :maxLabel="maxPriceLabel"
        @change="onChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '../partials/Range'
import {panelText} from './utils'
import {formatPriceRounded as formatPrice} from '../../helpers/formatting'

export default {
  name: 'budgetRangePanel',

  props: ['config'],

  data: function () {
    return {
      maxPrice: this.config.maxPrice,
      maxPriceLabel: `${formatPrice(this.config.maxPrice)}+`,
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      const filterValues = this.$store.getters.filterValues(
        ['low_price', 'high_price'],
        [0, this.maxPrice]
      )
      return [filterValues.low_price, filterValues.high_price]
    },

    textValue: function () {
      const values = this.$store.getters.filterValues(
        ['low_price', 'high_price'],
        [null, null]
      )
      return panelText(values.low_price, values.high_price)
    }
  },

  components: {
    Range
  },

  methods: {
    onDrag: function (newValues) {
      if (newValues[0] > 0) {
        this.$store.commit('setFilters', {low_price: newValues[0]})
      } else {
        this.$store.commit('unsetFilters', 'low_price')
      }

      if (newValues[1] < this.maxPrice) {
        this.$store.commit('setFilters', {high_price: newValues[1]})
      } else {
        this.$store.commit('unsetFilters', 'high_price')
      }
    },

    onChange: function (newValues) {
      this.onDrag(newValues)
      this.$store.dispatch('submit')
    }
  }
}
</script>
