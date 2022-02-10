<template>
  <editable-component
    :tag="`h${value.size}`"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :class="className"
    :isQuillEditor="true"
    v-if="$store.state.editing || (value.html !== '' && value.html !== '%3Cp%3E%3Cbr%3E%3C/p%3E')"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <quill-editor
      style="z-index: 6"
      :content="$store.state.editing ? encodedValue.html : $editableComponent_interpolate(encodedValue.html)"
      :allowed="allowed"
      @change="onChange"
    />
  </editable-component>
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

    allowed () {
      return {
        header: false,
        format: false,
        align: false
      }
    },

    tagName () {
      switch (this.value.display) {
        case 'flex':
        case 'block':
          return 'div'
      }

      return 'span'
    },

    className () {
      const heroType = this.$store.state.page.hero.name
      const a = heroType === 'hero-filter-search' && !this.$store.state.editing ? 'p-b-0' : ''
      return `editable-title title is-${this.value.size} ${a}`
    },

    schema () {
      return {
        title: 'Title',
        canDelete: false,
        fields: [
          {
            key: 'size',
            type: 'dropdown',
            label: 'Size',
            default: '1',
            options: [
              { value: '1', text: 'Normal (H1)' },
              { value: '2', text: 'Medium (H2)' },
              { value: '3', text: 'Small (H3)' }
            ]
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
.editable-title
  position: relative
</style>
