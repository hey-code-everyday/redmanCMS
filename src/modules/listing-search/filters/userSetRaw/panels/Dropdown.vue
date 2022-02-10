<template>
  <div class="gus-filter gus-filter--advanved gus-filter--dropdown">
    <h3 class="gus-filter__title var--gus-title">{{ config.label }}</h3>

    <div v-if="loadState === 1" class="gus-loading"></div>

    <div v-if="loadState === 2" class="gus-filter__field">
      <div class="select">
        <select @change="onChange" :value="value">
          <option value=""></option>
          <option v-for="option in options" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from './Checkbox'
import {encodeValue} from '../utils'

export default {
  extends: Checkbox,

  name: 'rawPanelDropdown',

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

<style lang="sass" scoped>

.select
  display: block
  select
    width: 100%

</style>
