<template>
  <div class="gus-filter gus-filter--budget">
    <h3 class="gus-filter__title var--gus-title">Minimum Square Footage</h3>

    <div class="gus-filter__field">
      <p class="gus-filter__text-value">{{textValue}}</p>
      <Range
        :min="0"
        :max="maxSqft"
        :interval="interval"
        :value="value"
        minLabel="Any size"
        :maxLabel="maxSqftLabel"
        @change="onChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '../partials/Range'
import {formatSqft} from '../../helpers/formatting'
import {numericValue} from './utils'

export default {
  name: 'minSqftPanel',

  props: ['config'],

  data: function () {
    return {
      maxSqft: this.config.maxSqft,
      maxSqftLabel: formatSqft(this.config.maxSqft),
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      const rawValue = this.$store.getters.filterValues('interior_size', null)
      return numericValue(rawValue)
    },

    textValue: function () {
      const formatted = formatSqft(this.value)
      return formatted ? `At least ${formatted}` : 'Any size'
    }
  },

  components: {
    Range
  },

  methods: {
    onDrag: function (newValue) {
      if (newValue > 0) {
        this.$store.commit('setFilters', {interior_size: `${newValue}p`})
      } else {
        this.$store.commit('unsetFilters', 'interior_size')
      }
    },

    onChange: function (newValue) {
      this.onDrag(newValue)
      this.$store.dispatch('submit')
    }
  }
}
</script>
