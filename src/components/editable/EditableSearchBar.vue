<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-listing-search-bar"
    @change="$editableComponent_change"
  >
  <search-bar
    class="strap-text__search-bar"
    :background="background"
    :onSearch="onSearch"
    @onItemClicked="onItemClicked"
    @onSearchCleared="$emit('onSearchCleared')"
    :placeholder="$editableComponent_interpolate(value.placeholder)"
  />
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'
import SearchBar from '@/components/SearchBar'

export default {
  name: 'EditableSearchBar',

  mixins: [mixinEditableComponent],

  props: {
    background: {
      type: String,
      default: 'outlined'
    }
  },

  components: {
    SearchBar,
    EditableComponent
  },

  computed: {
    schema () {
      return {
        title: 'Search Bar',
        canDelete: false,
        fields: [
          {
            key: `placeholder`,
            type: 'text',
            label: 'Placeholder',
            default: ''
          }
        ]
      }
    }
  },

  methods: {
    onSearch (query, done) {
      this.$emit('onSearch', { query, done })
    },

    onItemClicked (item) {
      this.$emit('onItemClicked', item)
    }
  }
}
</script>

<style lang="sass" scoped>
.listing-search-bar
  display: inline-flex
</style>
