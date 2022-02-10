<template>
  <component :is="tag" class="editable-list">
    <slot />
    <template v-if="editing">
      <br v-if="!empty" />
      <div class="ws-ui" style="margin-top:7px">
        <div
          @click="$emit('create')"
          :class="[ 'button', 'is-primary', 'editable-list__button', (empty ? 'is-medium' : 'is-small') ]"
        >
          <span class="icon"><i class="icon-plus"></i></span>
          <span v-if="empty">Add {{ label }}</span>
        </div>
      </div>
    </template>
  </component>
</template>

<script>
export default {
  name: 'EditableList',

  props: {
    tag: {
      type: String,
      required: false,
      default: 'div'
    },

    label: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      empty: this.checkEmpty()
    }
  },

  computed: {
    editing () {
      return this.$store.getters.canEdit && this.$store.state.editing
    }
  },

  methods: {
    checkEmpty () {
      this.empty = !this.$slots.default
      return this.empty
    }
  },

  updated () {
    this.checkEmpty()
  }
}
</script>

<style lang="sass" scoped>
.editable-list
  > *
    vertical-align: middle !important

.editable-list__button
  span
    &:not(.icon)
      font-size: 16px
      line-height: 1.1

  &.is-small
    padding: 0 !important
    width: 27px !important
    height: 27px !important

    .icon
      font-size: 16px !important

.ws-ui
  background-color: transparent
</style>
