<template>
  <div class="gus-filter gus-filter--bedrooms">
    <h3 class="gus-filter__title var--gus-title">Number of {{label}}</h3>
    <div class="gus-filter__field">
      <p class="gus-filter__text-value">{{textValue}}</p>
      <div class="gus-filter__radios">
        <Radio :name="filterName" value="1p" label="Any" :currentValue="value" @change="onChange" />
        <Radio :name="filterName" value="2p" label="2" :currentValue="value" @change="onChange" />
        <Radio :name="filterName" value="3p" label="3" :currentValue="value" @change="onChange" />
        <Radio :name="filterName" value="4p" label="4" :currentValue="value" @change="onChange" />
        <Radio :name="filterName" value="5p" label="5" :currentValue="value" @change="onChange" />
        <Radio :name="filterName" value="6p" label="6+" :currentValue="value" @change="onChange" />
      </div>
    </div>
  </div>
</template>

<script>
import Radio from '../partials/Radio'
import {panelText} from './utils'

export default {
  name: 'bedroomsPanel',
  data: function () {
    return {
      filterName: 'bedrooms',
      label: 'Bedrooms'
    }
  },

  computed: {
    rawValue: function () {
      return this.$store.getters.filterValues([this.filterName])
    },

    value: function () {
      return this.rawValue[this.filterName] || null
    },

    textValue: function () {
      return panelText(this.rawValue[this.filterName])
    }
  },

  components: {
    Radio
  },

  methods: {
    onChange: function (newValue) {
      if (!newValue) {
        this.$store.commit('unsetFilters', this.filterName)
      } else {
        this.$store.commit('setFilters', {[this.filterName]: newValue})
      }
      this.$store.dispatch('submit')
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

/deep/
  .gus-filter__radios
    +mobile
      width: 100%
      display: flex
      .gus-filter__radio
        flex: 1
        margin: 0 2px
        &:first-child
          margin-left: 0
        &:last-child
          margin-right: 0
      .gus-radio__label
        width: 100%
        text-align: center
</style>
