<template>
  <div class="gus-filter gus-filter--advanced gus-filter--range">
    <h3 class="gus-filter__title var--gus-title">{{ config.label }}</h3>
    <div class="gus-filter__field">
      <p v-if="value" class="gus-filter__text-value">{{value}} {{config.rangeUnit}}</p>
      <Range
        :min="min"
        :max="max"
        :interval="interval"
        :value="value"
        :minLabel="minLabel"
        :maxLabel="maxLabel"
        @change="onChange"
        @drag="onDrag" />
      </div>
  </div>
</template>

<script>
import Range from '../../partials/Range'
import {encodeValue} from '../utils'

export default {
  name: 'rawPanelRaw',

  props: ['config'],

  components: {
    Range
  },

  computed: {
    value: function () {
      return this.$store.getters.userSetRawValue(this.config.rawFieldName) ||
        (this.config.rawFieldOperator === 'lte' ? this.max : this.min)
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
      const value = encodeValue(newValue, this.config)
      this.$store.commit('setRaw', [this.config.rawFieldName, value])
    },

    onChange: function (newValue) {
      this.$emit('change', encodeValue(newValue, this.config))
    }
  }
}
</script>
