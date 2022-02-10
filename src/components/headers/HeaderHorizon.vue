<template>
  <div class="header-horizon">
    <header-contact-strip :header="header" />
    <nav class="navbar" role="navigation" aria-label="dropdown navigation">
      <div class="navbar-brand">
        <div class="navbar-item" v-if="header_editing || header_state.logo.imageUrl">
          <editable-image @change="$header_onComponentChange" keyName="logo" :value="header_state.logo" />
        </div>
        <div class="navbar-item masthead" v-if="header_editing || header_state.title.html">
          <editable-quill @change="$header_onComponentChange" keyName="title" :value="header_state.title" />
        </div>

        <div class="navbar-item is-pinned is-hidden-desktop">
          <div class="navbar-burger" @click="$store.commit('SHOW_MOBILE_NAV')">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <nav-bar :nav="header.nav" class="header__nav-bar navbar-item is-expanded" :branded="true" />
          <div class="navbar-item" v-if="header_editing || header_state.logo2.imageUrl">
            <editable-image @change="$header_onComponentChange" keyName="logo2" :value="header_state.logo2" />
          </div>
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
import defaultQuill from '@/store/defaults/components/quill'
import defaultImage from '@/store/defaults/components/image'
import HeaderContactStrip from '@/components/HeaderContactStrip'

export default {
  name: 'HeaderHorizon',

  components: {
    NavBar,
    EditableQuill,
    EditableImage,
    HeaderContactStrip
  },

  mixins: [mixinHeader],

  initialState (strap, state) {
    return {
      logo: defaultImage({ imageUrl: 'https://cdnassets.rmcloud.com/frontend/static/assets/images/redman-demo-site-dark.png', href: '/index', height: 40 }),
      logo2: defaultImage({ imageUrl: '', href: '/index', height: 40 }),
      title: defaultQuill({ html: '<h2><a href="/index">{{ website.config.display.siteName }}</a></h2>' })
    }
  }
}
</script>

<style lang="sass" scoped>
.header-horizon
  position: relative
  width: 100%
  color: var(--header-text) !important
  background: var(--header-bgColor) !important

.navbar-item.is-expanded
  padding: 0
  /deep/
    > .navbar-item
      height: 100%
      border-left: solid 1px rgba(#000, 0.2)

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
