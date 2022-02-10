<template>
<div :class="[ 'modal-custom', 'modal-box', modalClass ]" :style="modalStyles">
  <div :class="[ 'modal-box__content', modalBoxClass ]">

    <div class="modal-box__inner">
      <template v-if="template">
        <div v-html="template"></div>
      </template>

      <template v-else="component">
        <component :is="component" :state="modal.state" :settings="modal.settings"></component>
      </template>

      <template v-else>
        Missing template or component.
      </template>
    </div>

  </div>
</div>
</template>

<script>
import { clone } from '@/util'
import mixinModal from '@/mixins/modal'

export default {
  name: 'ModalCustom',

  mixins: [mixinModal],

  components: {},

  data () {
    const { template, component } = this.$props.modal

    if (template) {
      return {
        template,
        component: false
      }
    }

    if (component) {
      return {
        component,
        template: false
      }
    }

    return {
      template: false,
      component: false
    }
  },

  computed: {
    modalStyles () {
      const { width, height } = this.$props.modal.settings

      return {
        width, height
      }
    },

    modalClass () {
      const { palette } = this.$props.modal.settings
      return `var--app-${palette}`
    },

    modalBoxClass () {
      return this.$props.modal.settings.padded
        ? 'is-padded'
        : ''
    }
  },

  methods: {}
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.modal-custom
  +mobile
    width: 100% !important
    height: 100% !important

.modal-box__content
  display: flex
  justify-content: center
  align-items: center
  padding: 0
  background: transparent
  &.is-padded
    padding: 50px
    +mobile
      padding: 20px
  +mobile
    display: block

.modal-box__inner
  position: relative
  width: 100%
</style>
