<template>
<div class="app-ui">
  <!-- Mobile Navigation -->
  <div class="app-ui__inner app-ui__mobile-nav">
    <app-mobile-nav :nav="this.$store.state.header.nav" :visible="this.$store.state.ui.mobileNavVisible" />
  </div>

  <!-- Edit Component -->
  <div class="app-ui__inner app-ui__component-config">
    <transition name="component-config">
      <edit-component v-if="ui.editComponent" :state="ui.editComponent" />
    </transition>
  </div>

  <!-- Modals -->
  <div class="app-ui__inner app-ui__modals">
    <!-- Strap config -->
    <transition name="modal">
      <app-modal v-if="ui.modals.strap">
        <modal-configure :modal="ui.modals.strap" />
      </app-modal>
    </transition>

    <!-- Page config -->
    <transition name="modal">
      <app-modal v-if="ui.modals.page">
        <modal-page :modal="ui.modals.page" />
      </app-modal>
    </transition>

    <!-- Page management -->
    <transition name="modal">
      <app-modal v-if="ui.modals.managePages">
        <modal-manage-pages :modal="ui.modals.managePages" />
      </app-modal>
    </transition>

    <!-- Website config -->
    <transition name="modal">
      <app-modal v-if="ui.modals.website">
        <modal-website :modal="ui.modals.website" />
      </app-modal>
    </transition>

    <!-- Custom -->
    <transition name="modal">
      <app-modal v-if="ui.modals.custom">
        <modal-custom :modal="ui.modals.custom" class="form-curve-border form-bg-color" />
      </app-modal>
    </transition>

    <!-- Estimate modal -->
    <transition name="modal">
      <app-modal v-if="ui.modals.estimateModal">
        <modal-estimate
          :modal="ui.modals.estimateModal"
          :strap="$store.getters.hero"
          class="form-curve-border form-bg-color"
        />
      </app-modal>
    </transition>

    <advanced-search v-if="advancedSearch" />

    <!-- Auth -->
    <auth
      v-if="requestAuth"
      :auth0Config="config.clientAuth0"
      :spaceID="config.spaceID"
      :primaryColor="config.gus.styles.primaryColor"
      :voucherUrl="config.voucherUrl"
      @login="onLogin"
      @requestClose="onCloseAuth" />
  </div>

  <!-- Modals -->
  <div class="app-ui__inner app-ui__modals-under-edit-ui">
    <!-- New listing details images modal -->
    <transition name="modal">
      <app-modal v-if="ui.modals.newListingDetailsModal">
        <modal-new-listing-details class="form-curve-border form-bg-color" />
      </app-modal>
    </transition>
  </div>

  <!-- Mobile Screens -->
  <transition-group name="mobile-screen" tag="div" class="app-ui__inner app-ui__mobile-screens var--app-header">
    <component v-for="(screen, i) in ui.mobileScreens" :is="screen.component" :key="i + screen.component.name" />
  </transition-group>

  <!-- Noticiations -->
  <div class="app-ui__inner app-ui__notifications">
    <notifications :notifications="$store.state.ui.notifications" />
  </div>

</div>
</template>

<script>
import AppModal from './AppModal'
import AppMobileNav from '../AppMobileNav'
import Notifications from './Notifications'
import ModalPage from './modals/ModalPage'
import ModalCustom from './modals/ModalCustom'
import ModalWebsite from './modals/ModalWebsite'
import ModalConfigure from './modals/ModalConfigure'
import ModalManagePages from './modals/ModalManagePages'
import ModalEstimate from './modals/ModalEstimate'
import ModalNewListingDetails from './modals/ModalNewListingDetails'
import EditComponent from '@/components/EditComponent'
import loginActionStorage from '@/helpers/loginActionStorage'

export default {
  name: 'AppUi',

  components: {
    AppModal,
    AppMobileNav,
    Notifications,
    ModalPage,
    ModalCustom,
    ModalWebsite,
    ModalConfigure,
    ModalManagePages,
    EditComponent,
    ModalEstimate,
    ModalNewListingDetails,
    advancedSearch: () => import(/* webpackChunkName: "advanced-search" */ '@/modules/listing-search/components/Toolbar/Filters/Modal'),
    Auth: () => import(/* webpackChunkName: "auth" */ '@/modules/auth')
  },

  computed: {
    requestAuth () {
      return this.$store.state.ui.authVisible
    },

    advancedSearch () {
      return this.$store.getters.isPanelOpen('advanced-search')
    },

    ui () {
      return this.$store.state.ui
    },

    config () {
      return this.$store.state.config
    }
  },

  methods: {
    onLogin (token) {
      this.$store.dispatch('getUserInfo', token).then(() => {
        this.$store.commit('HIDE_AUTH')
      })
    },

    onCloseAuth () {
      this.$store.commit('HIDE_AUTH')
      loginActionStorage.cancel()
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.mobile-screen
  transform: translateX(0%)

.mobile-screen-enter-active,
.mobile-screen-leave-active
  transition: all 350ms

.mobile-screen-enter,
.mobile-screen-leave-to
  transform: translateX(100%)


.app-ui
  pointer-events: none
  position: fixed
  z-index: 1000

  top: 0
  left: 0
  width: 100vw
  height: 100vh

  color: $wsText !important
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, Droid Sans, Helvetica, Arial, sans-serif !important
  font-size: 16px !important
  text-transform: none !important

.app-ui__inner
  pointer-events: none
  position: absolute

  top: 0
  left: 0
  width: 100vw
  height: 100vh

.app-ui__map-view
  z-index: 1

.app-ui__mobile-nav
  z-index: 2

.app-ui__component-config
  z-index: 3

.app-ui__modals
  z-index: 4

.app-ui__modals-under-edit-ui
  z-index: 2

.app-ui__mobile-screens
  z-index: 5

.app-ui__notifications
  z-index: 6

.modal-enter-active,
.modal-leave-active,
.component-config-enter-active,
.component-config-leave-active
  transition: opacity 250ms

.form-curve-border
  border-radius: 6rem 0.1rem

.form-bg-color
  background: #E9EBF0
</style>
