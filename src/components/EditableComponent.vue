<template>
  <component
    :is="tag"
    :class="classes"
    @click="click"
    @mousedown="mousedown"
    @mouseup="edit"
    @contextmenu="edit"
  >
    <slot />
  </component>
</template>

<script>
import uuid from 'uuid/v4'

export default {
  name: 'EditableComponent',

  props: {
    tag: {
      type: String,
      required: false,
      default: 'div'
    },

    keyName: {
      type: [String, Number],
      required: true
    },

    value: {
      required: true
    },

    schema: {
      type: Object,
      required: true
    },

    clickToEdit: {
      type: Boolean,
      default: false
    },

    isQuillEditor: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      id: uuid(),
      limit: 0,
      limitInterval: null
    }
  },

  computed: {
    selected () {
      const { editComponent } = this.$store.state.ui
      if (!editComponent) return false

      return editComponent.id === this.id
    },

    editing () {
      return this.$store.getters.canEdit && this.$store.state.editing
    },

    classes () {
      return [
        'editable-component',
        this.editing ? 'is-editing' : false,
        this.selected ? 'is-selected' : false
      ]
    }
  },

  methods: {
    click (e) {
      if (this.editing) {
        e.preventDefault()

        if (this.clickToEdit) {
          this.openEdit()
        }
      }
    },

    mousedown () {
      this.limit = 0
      this.limitInterval = setInterval(() => {
        this.limit++
      }, 1)
    },

    edit (e) {
      if (this.clickToEdit) return
      if (e.target.closest('.ql-tooltip')) return

      clearInterval(this.limitInterval)
      if (this.limit > 100) return

      if (this.editing) {
        if (!this.isQuillEditor) e.stopPropagation()
        e.preventDefault()

        this.openEdit()
      }
    },

    openEdit () {
      const { id, value, keyName, schema } = this

      const onChange = value => {
        this.$emit('change', { value, keyName })
      }

      const onDelete = () => {
        this.$emit('delete', keyName)
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value,
        schema,
        keyName,
        onChange,
        onDelete
      })
    }
  }
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.editable-component
  position: relative

  &.is-editing
    user-select: none
    -webkit-user-select: text;
    cursor: pointer

    &:before
      content: ''
      position: absolute
      z-index: 1
      top: -2px
      left: -2px
      // right: -2px
      // bottom: -2px
      width: calc(100% + 4px)
      height: calc(100% + 4px)
      border-radius: 2px
      border: dotted 1px rgba($wsTextLight, 0.8)

    &:after
      content: ''
      position: absolute
      z-index: 2
      top: -2px
      left: -2px
      // right: -2px
      // bottom: -2px
      width: calc(100% + 4px)
      height: calc(100% + 4px)
      border: solid 1px transparent
      border-radius: 2px
      transition: box-shadow 150ms ease-in-out, border-color 150ms ease-in-out

    &:hover
      &:after
        border: solid 1px rgba($wsRed, 0.6)
        box-shadow: 0 0 0 4px rgba($wsRed, 0.2)

  &.is-selected
    user-select: none
    -webkit-user-select: text;
    cursor: pointer

    &:after,
    &:hover:after
      content: ''
      position: absolute
      z-index: 2
      top: -2px
      left: -2px
      right: -2px
      bottom: -2px
      border: solid 1px $wsRed
      box-shadow: 0 0 0 6px rgba($wsRed, 0.4)
      border-radius: 2px
      animation-name: selectedPulse
      animation-iteration-count: infinite
      animation-duration: 1200ms
      animation-timing-function: ease-in-out

.var--app-feature
  .editable-component
    &.is-editing
      &:before
        border: dotted 1px rgba(#eee, 0.8)

      &:hover
        &:after
          border-color: #eee
          box-shadow: 0 0 0 4px rgba(#eee, 0.2)

    &.is-selected
      &:after,
      &:hover:after
        animation-name: selectedPulseWhite
        border-color: #eee
        box-shadow: 0 0 0 6px rgba(#eee, 0.4)



@keyframes selectedPulse
  0%
    box-shadow: 0 0 0 4px rgba(#eee, 0.2)
  50%
    box-shadow: 0 0 0 6px rgba(#eee, 0.4)
  100%
    box-shadow: 0 0 0 4px rgba(#eee, 0.2)

@keyframes selectedPulseWhite
  0%
    box-shadow: 0 0 0 4px rgba(#eee, 0.2)
  50%
    box-shadow: 0 0 0 6px rgba(#eee, 0.4)
  100%
    box-shadow: 0 0 0 4px rgba(#eee, 0.2)

</style>
