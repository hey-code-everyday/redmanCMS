<template>
  <div class="header-glass is-glass">
    <editable-pattern class="pattern" @change="$header_onComponentChange" keyName="pattern" :value="header_state.pattern" />
    <header-contact-strip-alt class="contact-strip" :header="header" />
    <nav class="navbar is-glass" role="navigation" aria-label="dropdown navigation">
      <div class="navbar-brand">
        <div class="navbar-item" v-if="header_editing || header_state.logo.imageUrl" >
          <editable-image @change="$header_onComponentChange" keyName="logo" :value="header_state.logo" />
        </div>
        <div class="navbar-item masthead" v-if="header_editing || header_state.title.html">
          <editable-quill @change="$header_onComponentChange" keyName="title" :value="header_state.title" />
        </div>

        <div class="navbar-item is-pinned is-hidden-desktop">
          <div class="navbar-burger var--app-default" @click="$store.commit('SHOW_MOBILE_NAV')">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end small-pad-right var--app-default">
          <nav-bar :nav="header.nav" class="header__nav-bar navbar-item is-expanded" :branded="true"/>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import mixinHeader from '@/mixins/header'
import NavBar from '@/components/NavBar'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableImage from '@/components/editable/EditableImage'
import EditablePattern from '@/components/editable/EditablePattern'
import defaultQuill from '@/store/defaults/components/quill'
import defaultImage from '@/store/defaults/components/image'
import defaultPattern from '@/store/defaults/components/pattern'
import HeaderContactStripAlt from '@/components/HeaderContactStripAlt'

export default {
  name: 'HeaderGlass',

  components: {
    EditablePattern,
    NavBar,
    EditableQuill,
    EditableImage,
    HeaderContactStripAlt
  },

  mixins: [mixinHeader],

  initialState (strap, state) {
    return {
      logo: defaultImage({ imageUrl: 'https://cdnassets.rmcloud.com/frontend/static/assets/images/redman-demo-site-dark.png', href: '/index', height: 40 }),
      title: defaultQuill({ html: '<h2><a href="/index">{{ website.config.display.siteName }}</a></h2>' }),
      pattern: defaultPattern({ imageUrl: 'https://cdnassets.rmcloud.com/frontend/static/assets/images/redman-demo-site-dark.png' })
    }
  },
  computed: {
    getTextColor () {
      return 'color: ' + (this.$store.state.website.theme.dark ? this.header_palette.uiPrimary.bgColor : this.header_palette.uiPrimary.bgColor)
    }
  }
}
</script>

<style lang="sass" scoped>
.header-glass
  position: relative
  width: 100%
  color: var(--header-text)
  .navbar-item.is-expanded
    padding: 0
    /deep/
      > .navbar-item
        height: 85%
        font-size: large !important
        font-weight: 600
        padding: 0 2.5vw 0 2.5vw
        &.has-dropdown
          padding: 0
  .small-pad-right
    padding-right: .7vw

.pattern
  top: 0
  left: 0

.contact-strip
  padding-top: 15px !important
  padding-bottom: 0 !important
  box-sizing: border-box

.header__nav-bar
  opacity: 0.85
  /deep/
    .navbar-item.has-dropdown:hover .navbar-link
      color: var(--header-brandText)
      background: var(--header-brandBgColor)
      &::after
        border-color: var(--header-brandText)
    .navbar-link,
    .navbar-item
      color: var(--header-linkText)
      &::after
        border-color: var(--header-linkText)
      &:hover
        color: var(--header-brandText)
        background: var(--header-brandBgColor)
        &::after
          border-color: var(--header-brandText)

.is-glass
  background: transparent  !important
  background-color: transparent  !important
</style>
