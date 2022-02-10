<template>
  <div class="gus-filter gus-filter--bedrooms">
    <h3 class="gus-filter__title var--gus-title">Property Types</h3>

    <div class="gus-filter__field">
      <template v-for="type in types">
        <Checkbox name="property-types" :value="type" :checked="isChecked(type)" :label="definitions[type]" @check="check" @uncheck="uncheck" />
      </template>
    </div>
  </div>
</template>

<script>
import Checkbox from '../partials/Checkbox'
import {definitions} from './utils'

export default {
  name: 'propertyTypesPanel',

  props: ['config'],

  data: function () {
    return {
      definitions,
      types: this.config.types
    }
  },

  computed: {
    rawValue: function () {
      return this.$store.getters.filterValues(['property_types'])
    },

    values: function () {
      const propertyTypes = this.rawValue.property_types
      return propertyTypes ? propertyTypes.split('|') : []
    }
  },

  components: {
    Checkbox
  },

  methods: {
    check: function (value) {
      const newValues = this.values.concat(value)
      this.$store.commit('setFilters', {property_types: newValues.join('|')})
      this.$store.dispatch('submit')
    },

    uncheck: function (value) {
      const newValues = this.values.filter(existingValue => existingValue !== value)
      if (newValues.length) {
        this.$store.commit('setFilters', {property_types: newValues.join('|')})
      } else {
        this.$store.commit('unsetFilters', 'property_types')
      }
      this.$store.dispatch('submit')
    },

    isChecked: function (value) {
      return this.values.indexOf(value) !== -1
    }
  }
}
</script>
