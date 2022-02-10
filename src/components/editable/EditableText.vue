<template>
  <editable-component
    tag="span"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-text"
    v-if="$store.state.editing || value.text !== ''"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <template v-if="value.text !== ''">
      {{ $editableComponent_interpolate(value.text) }}
    </template>
    <template v-else>
      <em class="is-soft">Click to edit</em>
    </template>
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableText',

  mixins: [mixinEditableComponent],

  components: {
    EditableComponent
  },

  computed: {
    schema () {
      return {
        title: 'Text',
        canDelete: false,
        fields: [
          {
            key: 'text',
            type: 'text',
            label: 'Text',
            default: ''
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.editable-text
  display: inline-block
  min-height: 1em
  min-width: 1em
</style>
