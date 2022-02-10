<template>
  <editable-component
    :tag="value.href ? 'a' : 'span'"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :href="$editableComponent_interpolate(value.href)"
    :target="value.linkOut ? '_blank' : false"
    :class="`editable-image is-${value.filter} ${error ? 'has-error' : false}`"
    :click-to-edit="clickToEdit"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <img
      :style="{ height: (value.height ? `${value.height}px` : 'auto'), width: (value.width ? `${value.width}px` : 'auto') }"
      :src="$editableComponent_interpolate(value.imageUrl)"
      :alt="value.altText"
      @load="onLoad"
      @error="onError"
      v-show="!error"
      :data-flickity-lazyload="flicktyLazyload"
    />
    <template v-if="error">
      &times;
    </template>
    <template v-if="$store.state.editing && !value.imageUrl">
      <span class="icon" style="font-size:16px"><i class="icon-picture"></i></span>
    </template>
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableImage',

  mixins: [mixinEditableComponent],

  components: {
    EditableComponent
  },

  props: {
    flicktyLazyload: {
      type: String,
      default: ''
    },

    clickToEdit: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      error: false
    }
  },

  computed: {
    schema () {
      return {
        title: 'Image',
        canDelete: false,
        fields: [
          {
            key: 'imageUrl',
            type: 'image',
            label: 'Image URL',
            default: ''
          },
          {
            key: 'href',
            type: 'text',
            label: 'Link URL',
            default: ''
          },
          {
            key: 'altText',
            type: 'text',
            label: 'Alt Text',
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
          },
          {
            key: 'width',
            type: 'number',
            label: 'Width',
            default: 0,
            hint: 'Set width to \'0\' to automatically size the image.',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 10
          },
          {
            key: 'height',
            type: 'number',
            label: 'Height',
            default: 0,
            hint: 'Set height to \'0\' to automatically size the image.',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 10
          },
          {
            key: 'filter',
            type: 'dropdown',
            label: 'Style',
            default: 'primary',
            options: [
              { value: 'none', text: 'None' },
              { value: 'grayscale', text: 'Greyscale' },
              { value: 'white', text: 'Solid White' },
              { value: 'black', text: 'Solid Black' }
            ]
          }
        ]
      }
    }
  },

  methods: {
    onLoad (e) {
      this.error = false
    },

    onError (e) {
      this.error = e
      console.warn(e)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-image
  display: inline-block
  font-size: 0
  vertical-align: bottom

  img
    max-width: none
    max-height: none
    width: auto
    height: auto

  &.has-error
    min-width: 16px
    min-height: 16px
    text-align: center

  &.is-grayscale
    img
      filter: grayscale(1)

  &.is-white
    img
      filter: brightness(0) invert(1)

  &.is-black
    img
      filter: brightness(0)

.strap-image
  img
    +mobile
      max-width: 100% !important
</style>
