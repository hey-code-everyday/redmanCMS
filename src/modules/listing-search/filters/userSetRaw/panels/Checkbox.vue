<template>
  <div class="gus-filter gus-filter--advanced gus-filter--checkbox">
    <h3 class="gus-filter__title var--gus-title">{{ config.label }}</h3>

    <div v-if="loadState === 1" class="gus-loading"></div>

    <div v-if="loadState === 2" class="gus-filter__field gus-filter__field--checkbox">
      <template v-for="option in options">
        <Checkbox
          :name="option"
          :label="option"
          :value="option"
          :checked="value.indexOf(option) !== -1"
          @check="onCheck"
          @uncheck="onUncheck"
        />
      </template>
    </div>
  </div>
</template>

<script>
import {encodeValue} from '../utils'
import Checkbox from '../../partials/Checkbox'

export default {
  name: 'rawPanelCheckbox',

  props: ['config'],

  components: {
    Checkbox
  },

  data () {
    return {
      loadState: 0,
      options: []
    }
  },

  computed: {
    value: function () {
      const filterValue = this.$store.getters.userSetRawValue(this.config.rawFieldName)
      return filterValue ? filterValue.split(',') : []
    }
  },

  methods: {
    fetchTerms: function () {
      this.loadState = 1
      this.$store.dispatch('rawFieldTerms', this.config.rawFieldName).then(res => {
        this.loadState = 2
        this.options = res.map(item => item.key).filter(x => x).sort()
      })
    },

    onCheck: function (value) {
      const newValue = this.value.concat(value)
      this.$emit('change', encodeValue(newValue, this.config))
    },

    onUncheck: function (value) {
      const newValue = this.value.filter(item => item !== value)
      this.$emit('change', encodeValue(newValue, this.config))
    }
  },

  created () {
    this.fetchTerms()
  }
}
</script>

<style scoped lang="sass">

.gus-filter__field--checkbox
  @media (min-width: 768px)
    column-count: 2
  label
    display: block
    margin-bottom: 0.25em

</style>
