<template>
  <div class="header-columns" :style="header_styles">

    <nav class="navbar is-main" role="navigation" aria-label="dropdown navigation">

      <div class="navbar-brand is-hidden-desktop">
        <div class="navbar-item" v-if="header_editing || header_state.logo.imageUrl">
          <editable-image @change="$header_onComponentChange" keyName="logo" :value="header_state.logo" />
        </div>
        <div class="navbar-item masthead" v-if="header_editing || header_state.title.html">
          <editable-quill @change="$header_onComponentChange" keyName="title" :value="header_state.title" />
        </div>

        <div class="navbar-item is-pinned">
          <div class="navbar-burger" @click="$store.commit('SHOW_MOBILE_NAV')">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="columns is-hidden-touch" style="margin:0">
        <div class="column column-custom-1">
          <editable-html @change="$header_onComponentChange" keyName="htmlCol1" :value="header_state.htmlCol1" />
        </div>
        <div class="column column-custom-2">
          <editable-html @change="$header_onComponentChange" keyName="htmlCol2" :value="header_state.htmlCol2" />
        </div>
        <div class="column column-custom-3">
          <editable-html @change="$header_onComponentChange" keyName="htmlCol3" :value="header_state.htmlCol3" />
        </div>
        <div class="column column-custom-4">
          <editable-html @change="$header_onComponentChange" keyName="htmlCol4" :value="header_state.htmlCol4" />
        </div>
        <div class="column column-custom-5">
          <editable-html @change="$header_onComponentChange" keyName="htmlCol5" :value="header_state.htmlCol5" />
        </div>
      </div>
    </nav>

    <nav class="navbar is-nav is-centered is-hidden-touch" :style="{ backgroundColor: header_palette.uiPrimary.bgColor }">
      <div class="navbar-item is-expanded var--app-feature">
        <nav-bar :nav="header.nav" class="header__nav-bar navbar-item is-expanded" :branded="true" />
        <div v-show="loggedIn" class="navbar-item is-expanded">
          <a class="navbar-item" @click="logout">Sign Out</a>
        </div>
        <div v-show="!loggedIn" class="header__nav-bar navbar-item is-expanded">
          <a class="navbar-item is-branded" @click="login">Sign In</a>
        </div>

      </div>

    </nav>

  </div>
</template>

<script>
import mixinHeader from '@/mixins/header'
import NavBar from '@/components/NavBar'
import EditableHtml from '@/components/editable/EditableHtml'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableImage from '@/components/editable/EditableImage'
import defaultQuill from '@/store/defaults/components/quill'
import defaultHtml from '@/store/defaults/components/html'
import defaultImage from '@/store/defaults/components/image'

export default {
  name: 'HeaderColumns',

  components: {
    NavBar,
    EditableQuill,
    EditableImage,
    EditableHtml
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
      title: defaultQuill({ html: '<h2><a href="/index">{{ website.config.display.siteName }}</a></h2>' }),
      htmlCol1: defaultHtml({ html: 'Column 1' }),
      htmlCol2: defaultHtml({ html: 'Column 2' }),
      htmlCol3: defaultHtml({ html: 'Column 3' }),
      htmlCol4: defaultHtml({ html: 'Column 4' }),
      htmlCol5: defaultHtml({ html: 'Column 5' })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.header-columns
  position: relative
  width: 100%
  color: var(--header-text)
  background: var(--header-bgColor)
  .columns
    justify-content: center
    justify-items: center
    align-content: center
    align-items: center
    display: flex
    width: 100%
  .column
    justify-content: center
    align-items: center
    display: flex
    &:empty
      display: none
  .sign-in
    margin-right: 15px

.navbar
  &.is-main
    border-top: solid 4px
    border-bottom: solid 1px rgba(#000, 0.2)
    +touch
      border-bottom: none
  &.is-nav
    height: 48px
    min-height: auto
    display: flex
    justify-content: center
    > .navbar-item
      padding: 0
  &.is-centered
    justify-content: center
    > .navbar-item
      margin: 0 auto
      flex-grow: 0
      flex-shrink: 0

.navbar-item.is-expanded
  padding: 0
  /deep/
    > .navbar-item
      height: 100%
      color: #fff
      &.has-dropdown
        padding: 0

.header__nav-bar
  /deep/
    .navbar-item.has-dropdown:hover .navbar-link
      color: var(--header-brandBgColor)
      background: var(--header-brandText)
      &::after
        border-color: var(--header-brandBgColor)
    .navbar-link,
    .navbar-item
      color: var(--header-brandText)
      &::after
        border-color: var(--header-brandText)
      &:hover
        color: var(--header-brandBgColor)
        background: var(--header-brandText)
        &::after
          border-color: var(--header-brandText)
</style>
