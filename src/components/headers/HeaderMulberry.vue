<template>
  <div class="header-mulberry" :style="header_styles">
    <header-contact-strip :header="header" :hideSocial="true" />
    <nav class="navbar is-transparent" role="navigation" aria-label="dropdown navigation">
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
          <nav-bar :nav="header.nav" class="header__nav-bar navbar-item" :boxed="true" :branded="true" />
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
  name: 'HeaderMulberry',

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
.header-mulberry
  position: relative
  width: 100%
  color: var(--header-text)
  background: var(--header-bgColor)

.navbar-item
  &.is-masthead
    /deep/ a
      text-decoration: none

.header-mulberry
  /deep/
    .navbar-link,
    .navbar-item,
    a.navbar-link,
    a.navbar-item
      color: var(--header-text)
      &::after
        border-color: var(--header-text)
      &:hover
        color: var(--header-text)
</style>
