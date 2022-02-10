<template>
  <div class="gus-filter gus-filter--bedrooms">
    <h3 class="gus-filter__title var--gus-title">Property Types</h3>

    <div class="gus-filter__field">
      <template v-for="type in types">
        <checkbox name="property-types" :value="type" :checked="isChecked(type)" :label="definitions[type]" @check="check" @uncheck="uncheck" />
      </template>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/modules/listing-search/filters/partials/Checkbox'

export default {
  name: 'propertyTypesPanel',

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
      definitions: {
        house: 'House',
        condo: 'Condo',
        townhouse: 'Townhouse',
        land: 'Land',
        commercial: 'Commercial',
        rural: 'Rural',
        mobile: 'Mobile',
        investment: 'Investment'
      },
      types: this.config.types
    }
  },

  computed: {
    values: function () {
      const propertyTypes = this.filtersModel['property_types'] ? this.filtersModel['property_types'] : null
      return propertyTypes ? propertyTypes : []
    }
  },

  components: {
    Checkbox
  },

  methods: {
    check: function (value) {
      this.$emit('onChange', {
        type: 'property_types',
        value: value,
        checked: true
      })
    },

    uncheck: function (value) {
      this.$emit('onChange', {
        type: 'property_types',
        value: value,
        checked: false
      })
    },

    isChecked: function (value) {
      return this.values.indexOf(value) !== -1
    }
  }
}
</script>
