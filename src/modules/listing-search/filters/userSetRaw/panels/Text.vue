<template>
  <div class="gus-filter gus-filter--advanced gus-filter--text">
    <h3 class="gus-filter__title var--gus-title">{{ config.label }}</h3>
    <div class="gus-filter__field">
      <input class="input" type="text" @change="onChange" :value="value" />
    </div>
  </div>
</template>

<script>
import {encodeValue} from '../utils'

export default {
  name: 'rawPanelText',

  props: ['config'],

  computed: {
    value: function () {
      return this.$store.getters.userSetRawValue(this.config.rawFieldName)
    }
  },

  methods: {
    onChange: function (e) {
      this.$emit('change', encodeValue(e.target.value, this.config))
    }
  }
}
</script>
