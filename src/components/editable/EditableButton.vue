<template>
  <editable-component
    :tag="value.href ? 'a' : 'span'"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :href="$editableComponent_interpolate(value.href)"
    :target="value.linkOut ? '_blank' : false"
    :class="[
      'button',
      'strap-button',
      'editable-button',
      `is-${value.type}`,
      (small ? 'is-small' : false),
      (value.icon && !value.text ? 'is-icon' : false)
    ]"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <template v-if="value.text || value.icon">
      <span class="icon" v-if="value.icon">
        <i :class="value.icon"></i>
      </span>
      <template v-if="value.text">
        <em>{{ $editableComponent_interpolate(value.text) }}</em>
      </template>
    </template>
    <template v-else-if="$store.state.editing">
      <em class="is-soft">Click to edit</em>
    </template>
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableButton',

  mixins: [mixinEditableComponent],

  props: {
    small: {
      type: [String, Boolean],
      required: false,
      default: false
    }
  },

  components: {
    EditableComponent
  },

  computed: {
    schema () {
      return {
        title: 'Button',
        canDelete: false,
        fields: [
          {
            key: 'text',
            type: 'text',
            label: 'Text',
            default: ''
          },
          {
            key: 'icon',
            type: 'text',
            label: 'Icon',
            default: ''
          },
          {
            key: 'type',
            type: 'dropdown',
            label: 'Style',
            default: 'primary',
            options: [
              { value: 'primary', text: 'Primary' },
              { value: 'secondary', text: 'Secondary' },
              { value: 'outlined', text: 'Outlined' },
              { value: 'outlined-light', text: 'Outlined (light)' }
            ]
          },
          // {
          //   key: 'action',
          //   type: 'text',
          //   label: 'Text',
          //   default: ''
          // },
          {
            key: 'href',
            type: 'text',
            label: 'Link URL',
            default: ''
          },
          {
            key: 'linkOut',
            type: 'checkbox',
            label: 'Link Out',
            text: 'Open link in a new tab.',
            default: false,
            onValue: true,
            offValue: false
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.editable-button
  display: inline-flex
</style>
