<template>
  <div class="gus-filter gus-filter--advanced gus-filter--range">
    <h3 class="gus-filter__title var--gus-title">{{ config.label }}</h3>
    <div class="gus-filter__field">
      <p class="gus-filter__text-value">{{lowValue}} {{config.rangeUnit}} &mdash; {{highValue}} {{config.rangeUnit}}</p>
      <Range
        :min="min"
        :max="max"
        :interval="interval"
        :value="[lowValue, highValue]"
        :minLabel="minLabel"
        :maxLabel="maxLabel"
        @change="onChange"
        @drag="onDrag" />
      </div>
  </div>
</template>

<script>
import Range from '../../partials/Range'

export default {
  name: 'rawPanelRaw',

  props: ['config'],

  components: {
    Range
  },

  computed: {
    splitValue: function () {
      const range = this.$store.getters.userSetRawValue(this.config.rawFieldName)
      return range ? range.split('-') : [this.min, this.max]
    },

    lowValue: function () {
      return this.splitValue[0] || this.min
    },

    highValue: function () {
      return this.splitValue[1] || this.max
    }
  },

  data () {
    const {config} = this

    return {
      min: config.rangeMin,
      max: config.rangeMax,
      interval: config.rangeIncrement,
      minLabel: `${config.rangeMin} ${config.rangeUnit}`,
      maxLabel: `${config.rangeMax} ${config.rangeUnit}`
    }
  },

  methods: {
    onDrag: function (newValue) {
      const value = `[${newValue[0]}-${newValue[1]}]`
      this.$store.commit('setRaw', [this.config.rawFieldName, value])
    },

    onChange: function (newValue) {
      this.$emit('change', `[${newValue[0]}-${newValue[1]}]`)
    }
  }
}
</script>
