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
        @change="onRangeChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '@/modules/listing-search/filters/partials/Range'
import {formatSqft} from '@/modules/listing-search/helpers/formatting'

export default {
  name: 'minSqftPanel',

  props: {
    config: {
      type: Object,
      required: true,
      default: () => ({})
    },
    filtersModel: {
      type: Object,
      requred: true,
      default: () => ({})
    }  
  },

  data: function () {
    return {
      maxSqft: this.config.maxSqft,
      maxSqftLabel: formatSqft(this.config.maxSqft),
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      return this.filtersModel['interior_size'] ? this.filtersModel['interior_size'] : 0
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
      this.$emit('onChange', {
        type: 'interior_size',
        value: newValue
      })
    },

    onRangeChange: function (newValue) {
      this.$emit('onChange', {
        type: 'interior_size',
        value: newValue
      })
    }
  }
}
</script>
