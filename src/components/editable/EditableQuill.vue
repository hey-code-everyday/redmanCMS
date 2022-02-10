<template>
  <editable-component
    :tag="tagName"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :style="{ display: value.display }"
    :class="`editable-quill ${value.className}`"
    :isQuillEditor="true"
    v-if="$store.state.editing || (value.html !== '' && value.html !== '%3Cp%3E%3Cbr%3E%3C/p%3E')"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  ><quill-editor
      style="z-index: 6"
      :key="keyName"
      :content="$store.state.editing ? encodedValue.html : $editableComponent_interpolate(encodedValue.html)"
      @change="onChange"
    /></editable-component>
</template>

<script>
import { clone } from '@/util'
import QuillEditor from '@/components/QuillEditor'
import EditableComponent from '@/components/EditableComponent'
import mixinEditableComponent from '@/mixins/editable-component'

export default {
  name: 'EditableQuill',

  mixins: [mixinEditableComponent],

  components: {
    QuillEditor,
    EditableComponent
  },

  computed: {
    encodedValue () {
      const value = clone(this.value)

      try {
        value.html = decodeURI(value.html)
      } catch (e) {
        value.html = 'Invalid HTML'
        console.warn(e)
      }

      return value
    },

    tagName () {
      switch (this.value.display) {
        case 'flex':
        case 'block':
          return 'div'
      }

      return 'span'
    },

    schema () {
      return {
        title: 'Text',
        canDelete: false,
        fields: [
          {
            key: 'display',
            type: 'dropdown',
            label: 'Display',
            default: 'block',
            options: [
              { value: 'block', text: 'Block' },
              { value: 'inline-block', text: 'Inline Block' }
            ]
          },
          {
            key: 'className',
            type: 'text',
            label: 'CSS Classes',
            default: ''
          }
        ]
      }
    }
  },

  methods: {
    onChange (value) {
      const { keyName } = this.$props
      this.$emit('change', {
        keyName,
        value: {
          keyName: 'html',
          value: encodeURI(value)
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.editable-quill
  position: relative
  z-index: 1

  &.is-editing
    z-index: 5
</style>
