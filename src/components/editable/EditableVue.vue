<template>
  <editable-component
    :tag="tagName"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :class="`editable-vue ${value.className}`"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <dynamic-component
      :payload="{ component: payload, strap: payload.strap, state: value.state }"
      :components="components"
      :tag="tagName"
      :template="value.template"
      :style="{ display: value.display }"
      class="editable-vue__inner"
    />
  </editable-component>
</template>

<script>
import DynamicComponent from '@/components/DynamicComponent'
import EditableComponent from '@/components/EditableComponent'
import mixinEditableComponent from '@/mixins/editable-component'

// import EditableText from '@/components/editable/EditableText'
// import EditableTile from '@/components/editable/EditableTile'
// import EditableIcon from '@/components/editable/EditableIcon'
// import EditableHtml from '@/components/editable/EditableHtml'
// import EditableTitle from '@/components/editable/EditableTitle'
// import EditableImage from '@/components/editable/EditableImage'
// import EditableButton from '@/components/editable/EditableButton'
// import EditableRedform from '@/components/editable/EditableRedform'

export default {
  name: 'EditableVue',

  mixins: [mixinEditableComponent],

  props: {
    payload: {
      type: Object,
      required: true
    }
  },

  components: {
    DynamicComponent,
    EditableComponent
  },

  computed: {
    components () {
      return {
        // EditableText,
        // EditableTile,
        // EditableIcon,
        // EditableHtml,
        // EditableTitle,
        // EditableImage,
        // EditableButton,
        // EditableRedform
      }
    },

    template () {
      if (this.value.template) return this.value.template
      else return 'Click to edit'
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
        title: 'Vue Component',
        canDelete: false,
        fields: [
          {
            key: 'display',
            type: 'dropdown',
            label: 'Display',
            default: 'block',
            options: [
              { value: 'block', text: 'Block' },
              { value: 'inline', text: 'Inline' },
              { value: 'inline-block', text: 'Inline Block' },
              { value: 'flex', text: 'Flex' },
              { value: 'inline-flex', text: 'Inline Flex' }
            ]
          },
          {
            key: 'className',
            type: 'text',
            label: 'CSS Classes',
            default: ''
          },
          {
            key: 'template',
            type: 'multiText',
            label: 'Template',
            code: true,
            default: ''
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.editable-vue
  position: relative

.editable-vue__inner
  position: relative
  z-index: 3

</style>
