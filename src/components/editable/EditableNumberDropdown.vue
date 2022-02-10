<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-number-dropdown"
    @change="$editableComponent_change"
  >
    <div class="field" ref="field" data-number-dropdown>
      <!-- <label class="label">{{ $editableComponent_interpolate(value.label) }}</label> -->
      <div class="control">
        <div :class="[ 'dropdown', isOpen && 'is-active' ] ">
          <div class="dropdown-trigger" @click="isOpen = !isOpen">
            <button class="button is-dropdown is-outlined">
              <span class="button__value">{{ currentValue }} {{ unit }}</span>
              <span class="icon">
                <i class="icon-chevron-down"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu">
            <div class="dropdown-content" :style="{ backgroundColor: palette.bgColor }">
              <a
                class="dropdown-item"
                v-for="(item, i) in items"
                :key="i"
                :data-value="item"
                :style="{ color: palette.text + ' !important' }"
                @click="onItemClick(item)">
                {{ item }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </editable-component>
</template>

<script>
import closestParent from '@/helpers/closest-parent'
import mixinDocumentEvents from '@/mixins/document-events'
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableNumberDropdown',

  mixins: [mixinEditableComponent, mixinDocumentEvents],

  props: {
    unit: {
      type: String,
      default: ''
    },

    theme: {
      type: String,
      default: 'default'
    }
  },

  components: {
    EditableComponent
  },

  data () {
    return {
      isOpen: false,
      currentValue: Number(this.value.initial)
    }
  },

  computed: {
    palette () {
      return this.$store.getters.palette(this.theme)
    },

    schema () {
      return {
        title: 'Dropdown',
        canDelete: false,
        fields: [
          {
            key: 'min',
            type: 'number',
            label: 'Minimum',
            default: 0,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'max',
            type: 'number',
            label: 'Maximum',
            default: 100,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'initial',
            type: 'number',
            label: 'Initial Value',
            default: 0,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          }
        ]
      }
    },

    items () {
      const { min, max } = this.value

      const items = []
      for (let i = min; i <= max; i++) {
        items.push(i)
      }

      return items
    }
  },

  methods: {
    onItemClick (value) {
      this.currentValue = Number(value)
      this.closeDropdown()

      this.$emit('onValueChanged', this.currentValue)
    },

    onDocumentClick (e) {
      if (closestParent(e.target, '[data-number-dropdown]') !== this.$refs.field) this.closeDropdown()
    },

    closeDropdown () {
      this.isOpen = false
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-number-dropdown

.field,
.button,
.dropdown,
.dropdown-trigger
  width: 100%

.button
  position: relative
  background: transparent
  color: inherit
  border: none
  &:focus
    box-shadow: none
  &:after
    content: ''
    display: block
    position: absolute
    pointer-events: none
    top: 0
    left: 0
    width: 100%
    height: 100%
    border: solid 1px
    border-radius: 3px
    opacity: 0.25

.button.is-dropdown
  height: $strapButtonHeight
  padding: 0 1rem
  display: flex
  .icon
    margin-left: auto

.dropdown-menu
  width: 100%
  min-width: auto

.dropdown-item
  font-size: 18px
</style>
