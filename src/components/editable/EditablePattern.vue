<template>
  <editable-component
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :class="`editable-pattern is-${value.filter} ${error ? 'has-error' : false}`"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
      <div :style="{ height: (value.height ? `${value.height}px` : 'auto'), 'backgroundImage': 'url(' + $editableComponent_interpolate(value.imageUrl) + ')', 'backgroundRepeat': `repeat-x`, 'backgroundSize': (value.squish ? `contain` : `auto`) }" @load="onLoad" @error="onError" v-show="!error">
      </div>
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
  name: 'EditablePattern',

  mixins: [mixinEditableComponent],

  components: {
    EditableComponent
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
            type: 'text',
            label: 'Image URL',
            default: ''
          },
          {
            key: 'height',
            type: 'number',
            label: 'Height',
            default: 15,
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'squish',
            type: 'checkbox',
            label: 'Fit Image',
            default: true,
            onValue: true,
            offValue: false,
            text: 'Fit the image into the space available'
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
.editable-pattern
  position: absolute
  font-size: 0
  width: 100%

  &.has-error
    min-height: 15px
    text-align: center

  &.is-editing
    min-height: 15px
    width: 100%

  &.is-grayscale
    filter: grayscale(1)

  &.is-white
    filter: brightness(0) invert(1)

  &.is-black
    filter: brightness(0)
</style>
