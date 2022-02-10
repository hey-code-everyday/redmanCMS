<template>
  <div class="edit-component">
    <div class="edit-component__inner card ws-ui">
      <header class="card-header">
        <p class="card-header-title">
          Edit {{ state.schema.title }}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <template v-for="(field, i) in state.schema.fields">
            <dynamic-field :field="field" :state="state.value" :formUpdated="formUpdated" :index="i" />
          </template>
        </div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item" @click="close">
          Close
        </a>
        <a
          @click="deleteItem"
          class="card-footer-item"
          style="max-width:80px"
          v-if="typeof state.keyName === 'number'">
          <i class="icon icon-trash2"></i>
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
import DynamicField from '@/components/ui/DynamicField'

export default {
  name: 'EditComponent',

  props: {
    state: {
      type: Object,
      required: true
    }
  },

  components: {
    DynamicField
  },

  methods: {
    close () {
      this.$store.commit('HIDE_EDIT_COMPONENT')
    },

    formUpdated (value, keyName) {
      this.$props.state.onChange({ value, keyName })
    },

    deleteItem () {
      this.$props.state.onDelete()
      this.close()
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.edit-component
  pointer-events: none
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: flex-end
  padding-right: 1rem

  &:before
    pointer-events: none
    content: ''
    position: absolute
    right: 0
    width: 100%
    height: 100%
    max-width: 500px
    opacity: 0.2
    transform: translateX(0)
    background-image: linear-gradient(to right, rgba($wsDarkGrey, 0), rgba($wsDarkGrey, 1))

.edit-component__inner
  position: relative
  z-index: 1
  pointer-events: auto
  width: 350px
  box-shadow: $wsUiShadow
  border: none
  border-radius: 3px

.card-content
  max-height: 550px
  overflow-y: auto

.card-footer
  border-top-color: rgba($wsTextLight, 0.4)

.card-footer-item:not(:last-child)
  border-right-color: rgba($wsTextLight, 0.4)

.component-config-enter-active,
.component-config-leave-active
  &.edit-component
    &:before
      transition: all 150ms ease-in-out
  .edit-component__inner
    transition: all 150ms ease-in-out

.component-config-enter,
.component-config-leave-to
  &.edit-component
    &:before
      opacity: 0
      transform: translateX(25%)
  .edit-component__inner
    opacity: 0
    transform: translateX(50%)
</style>
