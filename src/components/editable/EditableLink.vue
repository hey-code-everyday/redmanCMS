<template>
  <editable-component
    tag="a"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :href="$editableComponent_interpolate(value.href)"
    :target="value.linkOut ? '_blank' : false"
    :class="`editable-link ${value.type} ${value.icon && !value.text ? 'is-icon' : '' }`"
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
            label: 'icon',
            default: ''
          },
          {
            key: 'type',
            type: 'dropdown',
            label: 'Style',
            default: 'link',
            options: [
              { value: 'link', text: 'Link' },
              { value: 'tag', text: 'Tag' }
            ]
          },
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
.editable-link
  display: inline-flex
  justify-content: center
  align-items: center
  text-decoration: none
  vertical-align: bottom

  &:hover
    text-decoration: none

  .icon
    margin-right: 0.2em

  em
    font-style: normal
    text-decoration: underline

  &.is-icon
    .icon
      font-size: 24px
      margin-right: 0 !important

  &.tag
    border-radius: 50px
    padding: 0 1em
    border: solid 1px
    background: transparent
    font-size: 16px
    line-height: 1.1

    .icon
      width: auto
      height: auto
      margin-right: 0.4em

    &.is-icon
      .icon
        font-size: inherit
        margin-right: 0 !important

    em
      text-decoration: none

    &:hover
      em
        text-decoration: underline
</style>
