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
import Radio from '@/modules/listing-search/filters/partials/Radio'

export default {
  name: 'bedroomsPanel',
  props: {
    filtersModel: {
      type: Object,
      requred: true,
      default: () => ({})
    }
  },
  data: function () {
    return {
      filterName: 'bedrooms',
      label: 'Bedrooms'
    }
  },

  computed: {
    value: function () {
      return this.filtersModel[this.filterName] || null
    },
    textValue: function () {
      return this.panelText(this.filtersModel[this.filterName])
    }
  },

  components: {
    Radio
  },

  methods: {
    onChange: function (newValue) {
      this.$emit('onChange', {
        type: this.filterName,
        value: newValue
      })
    },
    panelText (bedrooms) {
      const raw = this.toText(bedrooms)
      return raw ? `At least ${raw}` : 'Any amount'
    },
    toText (bedrooms) {
      if (!bedrooms) return false
      const match = bedrooms && bedrooms.match(/(\d+)p/)
      if (!bedrooms || bedrooms === '1p') {
        return false
      } else if (match) {
        return match[1]
      } else {
        throw new Error('Invalid value for bedrooms')
      }
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
