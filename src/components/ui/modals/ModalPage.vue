<template>
<div class="modal-page modal-box">

  <!-- Side menu -->
  <!-- <modal-menu :modal="modal" /> -->

  <!-- Form -->
  <div class="modal-box__content">

    <!-- Title -->
    <div class="modal-box__content-inner">
      <header class="modal-box__content-title">
        <h1 class="title">Page Details</h1>
      </header>
    </div>

    <!-- Tabs -->
    <!-- <modal-tabs :modal="modal" /> -->

    <!-- Content -->
    <div class="modal-box__content-inner">
      <modal-form :modal="modal" :formUpdated="formUpdated" :state="$store.state.page" />
    </div>

  </div>

</div>
</template>

<script>
import { clone } from '@/util'
import ModalForm from '../ModalForm'
import mixinModal from '@/mixins/modal'

export default {
  name: 'ModalPage',

  mixins: [ mixinModal ],

  components: {
    ModalForm
  },

  methods: {
    formUpdated (value, key) {
      const page = clone(this.$store.state.page)

      const { obj, lastKey } = this.$modal_findLastKey(page, key)
      obj[lastKey] = value

      this.$store.dispatch('setPage', page)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.modal-page
  min-width: 400px
  min-height: 400px

</style>
