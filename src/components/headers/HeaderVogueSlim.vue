<template>
  <div class="header-vogue" :style="header_styles">
    <!--<header-contact-strip :header="header" />-->
    <nav class="navbar is-main" role="navigation" aria-label="dropdown navigation">
      <div class="navbar-brand">
        <div class="navbar-item" v-if="header_editing || header_state.logo.imageUrl">
          <editable-image @change="$header_onComponentChange" keyName="logo" :value="header_state.logo" />
        </div>

        <div class="navbar-item is-pinned is-hidden-desktop">
          <div class="navbar-burger" @click="$store.commit('SHOW_MOBILE_NAV')">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

    <nav class="navbar is-nav is-centered is-hidden-touch">
      <div class="navbar-item is-expanded">
        <nav-bar :nav="header.nav" class="header__nav-bar navbar-item is-expanded" :branded="true" />
      </div>
    </nav>

      <div class="navbar-end is-hidden-touch">
        <div class="navbar-item">
          <a :href="`tel:${$store.state.website.config.office.phone}`">
            <span>{{ $store.state.website.config.office.phone }}</span>
          </a>
        </div>
        <div v-show="loggedIn" class="navbar-item">
          <a @click="logout">Sign Out</a>
        </div>
        <div v-show="!loggedIn" class="navbar-item">
          <a @click="login">Sign In</a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import mixinHeader from '@/mixins/header'
import NavBar from '@/components/NavBar'
import EditableImage from '@/components/editable/EditableImage'
import defaultImage from '@/store/defaults/components/image'
import HeaderContactStrip from '@/components/HeaderContactStrip'

export default {
  name: 'HeaderVogueSlim',

  components: {
    NavBar,
    EditableImage,
    HeaderContactStrip
  },

  mixins: [mixinHeader],

  computed: {
    loggedIn () {
      return this.$store.getters.clientAuthenticated
    }
  },

  methods: {
    login () {
      this.$store.commit('SHOW_AUTH')
    },

    logout () {
      this.$store.dispatch('clearClientAuth')
    }
  },

  initialState (strap, state) {
    return {
      logo: defaultImage({ imageUrl: 'https://cdnassets.rmcloud.com/frontend/static/assets/images/redman-demo-site-dark.png', href: '/index', height: 40 }),
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.header-vogue
  position: relative
  width: 100%
  color: var(--header-text)
  background: var(--header-bgColor)

.navbar-brand
  z-index: 1

.navbar
  &.is-main
    border-top: solid 4px var(--header-brandBgColor)
    border-bottom: solid 1px rgba(#000, 0.2)
    +touch
      border-bottom: none
  &.is-nav
    height: 48px
    min-height: auto
    display: flex
    justify-content: center
    position: absolute
    > .navbar-item
      padding: 0
  &.is-centered
    justify-content: center
    margin-left: auto
    margin-right: auto
    width: 100%
    > .navbar-item
      margin: 0 auto
      flex-grow: 0
      flex-shrink: 0

.navbar-item.is-expanded
  padding: 0
  /deep/
    > .navbar-item
      height: 100%
      &.has-dropdown
        padding: 0

.header__nav-bar
  /deep/
    .navbar-item.has-dropdown:hover .navbar-link
      color: var(--header-brandText)
      background: var(--header-brandBgColor)
      &::after
        border-color: var(--header-brandText)
    .navbar-link,
    .navbar-item,
    a.navbar-link,
    a.navbar-item
      color: var(--header-text)
      &::after
        border-color: var(--header-text)
      &:hover
        color: var(--header-brandText)
        background: var(--header-brandBgColor)
        &::after
          border-color: var(--header-brandText)
</style>
