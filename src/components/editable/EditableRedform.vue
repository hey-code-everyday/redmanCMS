<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-redform"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <template v-if="value.formID !== ''">
      <redform :formID="$editableComponent_interpolate(value.formID)" :spaceID="$store.state.config.spaceID" />
    </template>
    <template v-else>
      <div style="text-align:center;padding:20px">
        <em class="is-soft">Click to edit</em>
      </div>
    </template>
  </editable-component>
</template>

<script>
import Redform from '@/components/Redform'
import EditableComponent from '@/components/EditableComponent'
import mixinEditableComponent from '@/mixins/editable-component'
import { getAvailableForms } from '@/helpers/redforms'

export default {
  name: 'EditableRedform',

  mixins: [mixinEditableComponent],

  components: {
    Redform,
    EditableComponent
  },

  computed: {
    schema () {
      return {
        title: 'Form',
        canDelete: false,
        fields: [
          {
            key: 'formID',
            type: 'dropdown',
            label: 'Form Name',
            options () {
              return getAvailableForms.call(this, this.$store.state, true)
            },
            default: '',
            hint: 'The stock form or custom form from the builder.'
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.editable-redform
  min-height: 1em
  min-width: 1em
</style>
