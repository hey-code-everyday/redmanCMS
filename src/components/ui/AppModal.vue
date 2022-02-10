<template>
<div class="app-modal modal is-active">
  <div class="app-modal__background modal-background" @click="closeModal"></div>
  <div :class="`app-modal__content modal-content form-curve-border ${isFullScreenModal ? 'modal-full-screen' : ''}`">
    <slot />
  </div>
  <button class="app-modal__close modal-close is-large" @click="closeModal" v-if="canClose"></button>
</div>
</template>

<script>
export default {
  name: 'AppModal',

  computed: {
    canClose () {
      const { custom } = this.$store.state.ui.modals
      return !custom || (custom && custom.settings.canClose)
    },

    isFullScreenModal() {
      if (this.$store.state.ui.modals.newListingDetailsModal) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    closeModal () {
      if (!this.canClose) return
      this.$store.commit('HIDE_ALL_MODALS')
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.app-modal
  pointer-events: auto
  flex-direction: column

.app-modal__background
  background-color: rgba($wsDarkGrey, 0.4)

.app-modal__content
  width: auto
  border-radius: 4px
  overflow: hidden
  box-shadow: 0 7px 32px rgba($wsDarkGrey, 0.6)

  +mobile
    top: 0
    left: 0
    width: 100vw
    margin: 0
    height: 100vh
    max-height: none
    border-radius: 0
    box-shadow: none

.app-modal__close
  padding: 2rem
  background: rgba($wsDarkGrey, 0.6)

  +mobile
    padding: 1rem

.modal-enter-active,
.modal-leave-active
  .app-modal__close
    transition: transform 250ms ease-in-out, opacity 250ms ease-in-out
  .app-modal__background
    transition: opacity 250ms
  .app-modal__content
    transition: transform 250ms ease-in-out, opacity 250ms ease-in-out

.modal-enter,
.modal-leave-to
  .app-modal__close
    opacity: 0
    transform: translate(10%, -10%) scale(0.95)
  .app-modal__background
    opacity: 0
  .app-modal__content
    opacity: 0
    transform: translateY(5%) scale(0.95)

.modal-content
  overflow-y: auto
  overflow-x: hidden

.form-curve-border
  border-radius: 6rem 0.1rem
  +mobile
      border-radius: 0rem
  
.modal-full-screen
  width: 100%
  height: 100%
  border-radius: 0
  max-height: 100%
</style>
