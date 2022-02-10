<template>
<div class="modal-configure modal-box">

  <!-- Side menu -->
  <modal-menu :modal="modal" mutation="SET_STRAP_MODAL_SELECTED" />

  <!-- Form -->
  <div class="modal-box__content">

    <!-- Title -->
    <div class="modal-box__content-inner">
      <header class="modal-box__content-title">
        <h1 class="title">{{ modal.curPanel.title }}</h1>
      </header>
    </div>

    <!-- Tabs -->
    <modal-tabs :modal="modal" mutation="SET_STRAP_MODAL_SELECTED" />

    <!-- Content -->
    <div class="modal-box__content-inner">
      <modal-form :modal="modal" :formUpdated="formUpdated" :state="strap" />
    </div>

  </div>

</div>
</template>

<script>
import { clone, kebabToCamel } from '@/util'
import ModalTabs from '../ModalTabs'
import ModalMenu from '../ModalMenu'
import ModalForm from '../ModalForm'
import mixinModal from '@/mixins/modal'

export default {
  name: 'ModalConfigure',

  mixins: [mixinModal],

  components: {
    ModalTabs,
    ModalMenu,
    ModalForm
  },

  methods: {
    formUpdated (value, key) {
      const strapId = this.$props.modal.strapId
      const strap = strapId === 'hero'
        ? clone(this.$store.state.page.hero)
        : clone(this.$store.state.page.straps.find(s => s.id === strapId))

      const done = () => {
        const { obj, lastKey } = this.$modal_findLastKey(strap, key)
        obj[lastKey] = value

        this.$store.dispatch('setStrap', strap)
      }

      if (strapId === 'hero' && key === 'name' && strap.name !== value) {
        const name = kebabToCamel(value)

        return import(`../../../components/heroes/${name}.vue`).then(component => {
          strap.state = component.default.initialState(strap, strap.state)
          done()
        }).catch(e => {
          console.warn(e)
        })
      }

      done()
    }
  },

  computed: {
    strap () {
      const { strapId } = this.$props.modal

      let strap
      switch (strapId) {
        case 'hero':
          strap = this.$store.state.page.hero
          break
        default:
          strap = this.$store.state.page.straps.find(s => s.id === strapId)
          break
      }

      return strap
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.modal-configure
  width: 800px
  height: 800px

  +mobile
    width: 100%
    height: 100%
</style>
