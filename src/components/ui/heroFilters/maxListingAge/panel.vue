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
        @change="onRangeChange"
        @drag="onDrag"
      />
    </div>
  </div>
</template>

<script>
import Range from '@/modules/listing-search/filters/partials/Range'

export default {
  name: 'maxListingAgePanel',

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
      maxListingAge: this.config.maxListingAge,
      maxListingAgeLabel: `${this.config.maxListingAge} days +`,
      interval: this.config.interval
    }
  },

  computed: {
    value: function () {
      return this.filtersModel['listing_age'] ? this.filtersModel['listing_age'] : 1
    },

    textValue: function () {
      if (this.value === 1) {
        return 'Listed today'
      } else if (this.value < this.maxListingAge) {
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
      this.$emit('onChange', {
        type: 'listing_age',
        value: newValue
      })
    },
    onRangeChange: function (newValue) {
      this.$emit('onChange', {
        type: 'listing_age',
        value: newValue
      })
    }
  }
}
</script>
