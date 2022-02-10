<template>

  <div class="item__tags">
    <div v-for="tag in tags" class="var--gus-tag item__tag">
      <input type="checkbox" :checked="tag.checked" :id="tag.id" @click="e => { onClick(tag.values, e) }" class="var--gus-tag__input" />
      <label :for="tag.id" class="var--gus-tag__label">{{tag.label}}</label>
    </div>
  </div>

</template>

<script>
import kebabCase from 'lodash/kebabCase'
import {importPossibleTags, filtersMatch} from '../../../helpers/tags'

const slug = text => kebabCase(text.replace(/&/g,'-and-'))

export default {
  name: 'tags',

  props: ['mls', 'listingData'],

  methods: {
    onClick: function (values, e) {
      if (e.target.checked) {
        this.$store.commit('setFilters', values)
      } else {
        this.$store.commit('unsetFilters', Object.keys(values))
      }
      this.$store.dispatch('submit')
    }
  },

  computed: {
    tags: function () {
      const currentFilters = this.$store.state.gus.filters
      const possibleTags = importPossibleTags(this.$store.state.gus.config)

      return possibleTags.map(possibleTag => {
        const tag = possibleTag(this.listingData)
        if (!tag) return false

        const checked = filtersMatch(tag.values, currentFilters)

        return {
          label: tag.label,
          values: tag.values,
          checked,
          id: slug(`${this.mls}-${tag.label}`)
        }
      }).filter(x => x)
    }
  }
}
</script>

<style scoped lang="sass">

.item__tags
  margin-top: 1rem

.item__tag
  font-size: 0.75rem

.property-modal .item__tags
  display: none

.var--gus-tag__label
  box-shadow: 0px 2px 5px grey

  &:hover
    border: 1px solid

</style>
