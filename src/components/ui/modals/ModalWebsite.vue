<template>
<div class="modal-website modal-box">

  <!-- Side menu -->
  <modal-menu :modal="modal" mutation="SET_WEBSITE_MODAL_SELECTED" />

  <!-- Form -->
  <div class="modal-box__content">

    <!-- Title -->
    <div class="modal-box__content-inner">
      <header class="modal-box__content-title">
        <h1 class="title">{{ modal.curPanel.title }}</h1>
      </header>
    </div>

    <!-- Tabs -->
    <modal-tabs :modal="modal" mutation="SET_WEBSITE_MODAL_SELECTED" />

    <!-- Content -->
    <div class="modal-box__content-inner">
      <modal-form :modal="modal" :formUpdated="formUpdated" :state="this.$store.state" />
    </div>

  </div>

</div>
</template>

<script>
import { clone } from '@/util'
import ModalTabs from '../ModalTabs'
import ModalMenu from '../ModalMenu'
import ModalForm from '../ModalForm'
import mixinModal from '@/mixins/modal'

export default {
  name: 'ModalWebsite',

  mixins: [mixinModal],

  components: {
    ModalTabs,
    ModalMenu,
    ModalForm
  },

  methods: {
    formUpdated (value, key) {
      const state = {
        website: clone(this.$store.state.website),
        header: clone(this.$store.state.header),
        footer: clone(this.$store.state.footer)
      }

      const { obj, lastKey } = this.$modal_findLastKey(state, key)
      obj[lastKey] = value

      this.$store.dispatch('setState', state)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.modal-website
  min-width: 850px
  height: calc(100vh - 3rem)

  +mobile
    width: 100%
    height: 100%

</style>
