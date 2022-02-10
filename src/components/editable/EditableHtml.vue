<template>
  <editable-component
    :tag="tagName"
    :value="encodedValue"
    :keyName="keyName"
    :schema="schema"
    :class="`editable-html ${value.className}`"
    :click-to-edit="clickToEdit"
    v-if="$store.state.editing || value.html"
    @change="change"
    @delete="$editableComponent_delete"
  >
    <template v-if="!value.disablePostscribe && browser">
      <component
        :is="tagName"
        :style="{ display: value.display }"
        class="editable-html__inner"
        ref="container"
      />
    </template>
    <template v-else>
       <component
        :is="tagName"
        :style="{ display: value.display }"
        class="editable-html__inner"
        v-html="decodedHtml"
      />
    </template>
  </editable-component>
</template>

<script>
import { clone } from '@/util'
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'
const postscribe = process.browser ? require('postscribe') : false

export default {
  name: 'EditableHtml',

  mixins: [mixinEditableComponent],

  components: {
    EditableComponent
  },

  props: {
    clickToEdit: {
      type: Boolean,
      default: false
    },
    disablePostscribe: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    browser () {
      return process.browser
    },

    decodedHtml () {
      let html
      try {
        html = decodeURI(this.html)
      } catch (e) {
        console.warn(e)
      }

      return this.$editableComponent_interpolate(html)
    },

    html () {
      if (this.value.html) return this.value.html
      else return '<em>Click to edit</em>'
    },

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
        title: 'HTML',
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
            key: 'html',
            type: 'multiText',
            label: 'HTML',
            code: true,
            default: ''
          },
          {
            key: 'disablePostscribe',
            type: 'checkbox',
            label: 'Enable Scripts',
            text: 'Run embedded scripts',
            default: false,
            onValue: false,
            offValue: true,
          }
        ]
      }
    }
  },

  methods: {
    postscribe () {
      if (process.browser && this.$refs.container) {
        this.$refs.container.innerHTML = ''

        let html = 'Invalid HTML'
        try {
          html = decodeURI(this.html)
        } catch (e) {
          console.warn(e)
        }

        postscribe(this.$refs.container, this.$editableComponent_interpolate(html), this.ready)
      }
    },

    ready () {
    },

    change (payload) {
      if (payload.value.keyName === 'html')
        payload.value.value = encodeURI(payload.value.value)
        
      this.$editableComponent_change(payload)
    }
  },

  created () {
    if (this.value.disablePostscribe === undefined || this.value.disablePostscribe === 'false') {
      this.value.disablePostscribe = false
    } else if (this.value.disablePostscribe === 'true') {
      this.value.disablePostscribe = true
    }
  },

  mounted () {
    if (!this.value.disablePostscribe) this.postscribe()
  },

  updated () {
    if (!this.value.disablePostscribe) this.postscribe()
  },

  watch: {
    html () {
      if (!this.value.disablePostscribe) this.postscribe()
    }
  }
}
</script>

<style lang="sass" scoped>
.editable-html
  position: relative

.editable-html__inner
  position: relative

</style>
