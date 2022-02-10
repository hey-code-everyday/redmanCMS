<template>
  <div>
    <!-- Meta -->
    <MetaData :listing="state.listing" v-if="state.listing" />

    <!-- Modals -->
    <FormModal :modal="state.modal" :hideModal="actions.hideModal" />
    <Auth
      v-if="isAuthOpen"
      :auth0Config="constants.config.api.auth0"
      :spaceID="state.config.spaceID"
      :primaryColor="state.config.styles.primaryColor"
      @login="onLogin"
      @requestClose="onCloseAuth" />

    <!-- Content -->
    <template v-if="state.listing">
      <Gallery />
      <div :class="containerClasses">
        <Listing />
      </div>
    </template>

    <!-- No results -->
    <template v-else>
      <NoResults :mls="state.config.mls" />
    </template>

    <!-- Styles -->
    <Styles :styles="state.config.styles" :schema="constants.config.styles.schema" />
    <V4Styles v-if="state.config.v4styles" />
  </div>
</template>

<script>
// Imports
import constants from 'listing-details@/config/constants'
import window from 'listing-details@/window'

// Components
import Styles from 'listing-details@/components/Styles'
import V4Styles from 'listing-details@/components/V4Styles'
import Gallery from 'listing-details@/components/Gallery/Gallery'
import Listing from 'listing-details@/components/Listing/Listing'
import NoResults from 'listing-details@/components/NoResults'
import MetaData from 'listing-details@/components/MetaData'
import FormModal from 'listing-details@/components/FormModal'

// Component
export default {
  name: 'listingsSearch',

  props: {
    state: {
      type: Object,
      required: true
    },

    actions: {
      type: Object,
      required: true
    }
  },

  provide () {
    return {
      state: this.$props.state,
      actions: this.$props.actions
    }
  },

  components: {
    Styles,
    V4Styles,
    Gallery,
    Listing,
    NoResults,
    MetaData,
    FormModal,
    Auth: () => import(/* webpackChunkName: "auth" */ '@/modules/auth')
  },

  data () {
    return {
      resizeHandler: null,
      resizeDebounce: null
    }
  },

  mounted () {
    const resizeHandler = this.windowResize.bind(this)
    this.resizeHandler = resizeHandler
    window.addEventListener('resize', resizeHandler)
  },

  created () {
    const width = window.innerWidth
    this.$store.dispatch('setMobile', width <= 768)
  },

  destroyed () {
    window.removeEventListener('resize', this.resizeHandler)
  },

  methods: {
    error (err) {
      console.warn(err)
    },

    windowResize () {
      clearTimeout(this.resizeDebounce)
      this.resizeDebounce = setTimeout(() => {
        this.$store.dispatch('setMobile', window.innerWidth <= 768)
      }, 20)
    },

    onLogin () {
      this.$store.commit('SHOW_LOCK')
    },

    onCloseAuth () {
      this.$store.commit('HIDE_MODAL')
    }
  },

  computed: {
    styles () {
      return {
        borderRadius: '3px',
        boxShadow: '0 7px 24px rgba(74, 74, 74, 0.3)',
        mediaColor: '#303841',
        mediaTextColor: '#ffffff'
      }
    },

    constants () {
      return constants
    },

    listing () {
      return this.state.listing
    },

    isAuthOpen () {
      return this.state.auth
    },

    containerClasses () {
      const margins = this.state.config.margins

      return {
        'container': margins === 'contained',
        'is-fluid': margins === 'fluid',
        'details-container': true
      }
    }
  }
}
</script>

<style lang="sass">
@import '~gus-components/index.sass'
@import '~bulma/sass/utilities/_all'

.var--gus-link
  text-decoration: underline

  em
    text-decoration: none

.column
  position: relative

.flickity-viewport
  position: relative
  height: 100% !important
  width: 100%
  outline: none !important
  overflow: hidden

.flickity-page-dots
  outline: none !important

.flickity-enabled
  outline: none !important

.flickity-slider
  position: relative
  width: 100%
  height: 100%

.flickity-prev-next-button
  outline: none !important

.details-container
  margin: 0 auto
  box-sizing: border-box
  padding: 0 2.5rem 100px 2.5rem
  color: #000

  +touch
    padding: 0 2.5rem 50px 2.5rem

  &.is-fluid
    padding-left: 0
    padding-right: 0

  +mobile
    padding: 0 20px 50px 20px !important
</style>
