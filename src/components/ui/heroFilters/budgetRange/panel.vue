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
        @change="onRangeChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '@/modules/listing-search/filters/partials/Range'
import {formatPriceRounded as formatPrice} from '@/modules/listing-search/helpers/formatting'

export default {
  name: 'budgetRangePanel',

  props: {
    config: {
      type: Object,
      required: true
    },
    filtersModel: {
      type: Object,
      requred: true
    }
  },

  data: function () {
    return {
      maxPrice: this.config.maxPrice,
      maxPriceLabel: `${formatPrice(this.config.maxPrice)}+`,
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      return this.filtersModel['budget_range'] ? this.filtersModel['budget_range'] : [0, this.maxPrice]
    },
    textValue: function () {
      const values = this.filtersModel['budget_range'] ? this.filtersModel['budget_range'] : [null, null]
      return this.panelText(values[0], values[1])
    }
  },

  components: {
    Range
  },

  methods: {
    formatRange (lowPrice: number, highPrice: number) {
      const low = formatPrice(lowPrice)
      const high = formatPrice(highPrice)
      if (lowPrice === 0 && highPrice === this.config.maxPrice) {
        return null
      } else if (lowPrice > 0 && highPrice < this.config.maxPrice) {
        return `${low} - ${high}`
      } else if (lowPrice === 0) {
        return `Below ${high}`
      } else if (highPrice === this.config.maxPrice) {
        return `Above ${low}`
      }
      return null
    },
    panelText (lowPrice: number, highPrice: number) {
      return this.formatRange(lowPrice, highPrice) || 'Any amount'
    },
    onDrag: function (newValues) {
      this.$emit('onChange', {
        type: 'budget_range',
        value: newValues
      })
    },
    onRangeChange: function (newValues) {
      this.$emit('onChange', {
        type: 'budget_range',
        value: newValues
      })
    }
  }
}
</script>
