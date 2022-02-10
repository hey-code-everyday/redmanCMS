<template>
  <div class="gus-filter gus-filter--budget">
    <h3 class="gus-filter__title var--gus-title">Maximum Construction Age</h3>

    <div class="gus-filter__field">
      <p class="gus-filter__text-value">{{textValue}}</p>
      <Range
        :min="1"
        :max="maxAge"
        :interval="interval"
        :value="value"
        minLabel="New"
        :maxLabel="maxAgeLabel"
        @change="onRangeChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '@/modules/listing-search/filters/partials/Range'

export default {
  name: 'minAgePanel',

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
      maxAge: this.config.maxAge,
      maxAgeLabel: `${this.config.maxAge} years +`,
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      return this.filtersModel['construction_age'] ? this.filtersModel['construction_age'] : this.config.maxAge
    },

    textValue: function () {
      if (this.value === 1) {
        return 'Less than a year'
      } else if (this.value < this.maxAge) {
        return `Less than ${this.value}`
      } else {
        return 'Any age'
      }
    }
  },

  components: {
    Range
  },

  methods: {
    onDrag: function (newValue) {
      this.$emit('onChange', {
        type: 'construction_age',
        value: newValue
      })
    },
    onRangeChange: function (newValue) {
      this.$emit('onChange', {
        type: 'construction_age',
        value: newValue
      })
    }
  }
}

</script>
