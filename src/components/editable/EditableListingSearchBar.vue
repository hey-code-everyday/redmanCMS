<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-listing-search-bar"
    @change="$editableComponent_change"
  >
  <listing-search-bar
    :placeholder="$editableComponent_interpolate(value.placeholder)"
    :background="value.background"
  />
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'
import ListingSearchBar from '@/components/ListingSearchBar'

export default {
  name: 'EditableListingSearchBar',

  mixins: [mixinEditableComponent],

  props: {
    small: {
      type: [String, Boolean],
      required: false,
      default: false
    }
  },

  components: {
    ListingSearchBar,
    EditableComponent
  },

  computed: {
    schema () {
      return {
        title: 'Listing Search Bar',
        canDelete: false,
        fields: [
          {
            key: `placeholder`,
            type: 'text',
            label: 'Placeholder',
            default: ''
          },
          {
            key: 'background',
            type: 'dropdown',
            label: 'Background Style',
            default: 'light',
            options: [
              { text: 'Light', value: 'light' },
              { text: 'Dark', value: 'dark' }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.listing-search-bar
  display: inline-flex
</style>
