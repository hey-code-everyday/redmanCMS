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
  name: 'minSqftPanel',

  props: ['config'],

  data: function () {
    return {
      maxAge: this.config.maxAge,
      maxAgeLabel: `${this.config.maxAge} years +`,
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      const raw = this.$store.getters.filterValues('construction_age', null)
      const numeric = raw ? numericValue(raw) : this.maxAge
      return numeric
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
      if (newValue < this.maxAge) {
        const raw = rawValue(newValue)
        this.$store.commit('setFilters', {construction_age: raw})
      } else {
        this.$store.commit('unsetFilters', 'construction_age')
      }
    },

    onChange: function (newValue) {
      this.onDrag(newValue)
      this.$store.dispatch('submit')
    }
  }
}

</script>
