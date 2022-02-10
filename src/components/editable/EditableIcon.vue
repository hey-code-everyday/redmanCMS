<template>
  <editable-component
    tag="span"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :style="{ width: (value.fontSize ? value.fontSize + 'px' : '24px'), height: (value.fontSize ? value.fontSize + 'px' : '24px'), fontSize: (value.fontSize ? value.fontSize + 'px' : '24px') }"
    :class="`editable-icon strap-icon icon ${value.style === 'enclosed' ? 'is-enclosed' : ''}`"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <template v-if="value.name">
      <template v-if="value.label">
        <div>
          <div class="icon" v-if="value.name">
            <i :class="value.name"></i>
          </div>
          <div class="label" v-if="value.label">
            {{ $editableComponent_interpolate(value.label) }}
          </div>
        </div>
      </template>
      <template v-else>
        <span class="icon" v-if="value.name">
          <i :class="value.name"></i>
        </span>
      </template>




    </template>
    <template v-else>
      &times;
    </template>
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableIcon',

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
        title: 'Icon',
        canDelete: false,
        fields: [
          {
            key: 'name',
            type: 'text',
            label: 'Icon Name',
            placeholder: 'icon-*',
            default: ''
          },
          {
            key: 'label',
            type: 'text',
            label: 'Label',
            default: ''
          },
          {
            key: 'fontSize',
            type: 'number',
            label: 'Icon Size',
            default: 0,
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'style',
            type: 'dropdown',
            label: 'Style',
            default: 'none',
            options: [
              { value: 'none', text: 'None' },
              { value: 'enclosed', text: 'Enclosed' }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-icon
  display: inline-flex
  text-align: center
  justify-content: center
  align-items: center
  vertical-align: bottom
  box-sizing: content-box

  i
    display: block
    vertical-align: bottom
    opacity: 0.6

  &.is-enclosed
    padding: 0.8em
    border-radius: 50%

    i
      opacity: 1


/deep/
  +with-palette
    .strap-icon
      background-color: var(--#{$palette}-uiPrimary-bgColor)
      i
        color: var(--#{$palette}-uiPrimary-text)
</style>
