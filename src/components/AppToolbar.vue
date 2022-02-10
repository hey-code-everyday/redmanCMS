<template>
  <nav class="app-toolbar navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item navbar-home" href="/">
        <img class="brand" src="../assets/images/triangle.svg" alt="Redman Page Builder" />
        <p>
          <strong>Redman</strong><br />
          <span>Page Builder</span>
        </p>
      </a>

      <div class="navbar-burger">
        <a class="navbar-item" title="Website Settings" @click="$store.dispatch('logout')">
          <i class="icon icon-exit"></i>
        </a>

        <a class="navbar-item" title="Website Settings" @click="openWebsiteModal">
          <i class="icon icon-cog"></i>
        </a>

        <a class="navbar-item" title="Website Settings" @click="openPageModal">
          <i class="icon icon-file-empty"></i>
        </a>

        <!-- Edit page -->
        <template v-if="canEdit">
          <a class="navbar-item is-dark is-save" v-if="!$store.state.editing" @click="startEditing">
            <i class="icon icon-pencil2"></i>
          </a>
          <a class="navbar-item is-dark is-save" v-if="$store.state.editing && !$store.state.dirty" @click="stopEditing">
            <i class="icon icon-check"></i>
          </a>
          <a class="navbar-item is-dark is-icon" v-if="$store.state.editing && $store.state.dirty && !saving" @click="revert" title="Undo Changes">
            <i class="icon icon-undo2"></i>
          </a>
          <a class="navbar-item is-primary is-save" v-if="$store.state.editing && $store.state.dirty && !saving" @click="save">
            <i class="icon icon-cloud-upload"></i>
          </a>
          <a class="navbar-item is-primary is-save button is-loading" v-if="$store.state.editing && $store.state.dirty && saving">
          </a>
        </template>
      </div>
    </div>

    <div class="navbar-menu">
      <div class="navbar-start">

        <!-- Site menu -->
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            <i class="icon icon-menu"></i>
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item" :href="crmHref" target="_blank">
              Clients &amp; Leads
            </a>
            <a class="navbar-item" :href="formsHref" target="_blank">
              Form Editor
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item" @click="$store.dispatch('logout')">
              Logout
            </div>
          </div>
        </div>
      </div>

      <div class="navbar-end">

        <!-- Site menu -->
        <a class="navbar-item" title="Website Settings" @click="openWebsiteModal">
          Website Settings
        </a>

        <!-- Page menu -->
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Manage Pages
          </a>
          <div class="navbar-dropdown is-right">
            <a class="navbar-item" @click="openPageModal" v-if="$store.getters.isCmsPage">
              Edit Page Details
            </a>
            <a class="navbar-item" @click="openManagePagesModal">
              View All Pages
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item" @click="duplicatePage">
              Duplicate
            </div>
            <div class="navbar-item" @click="newPage">
              New Page
            </div>
          </div>
        </div>

        <!-- Edit page -->
        <template v-if="canEdit">
          <a class="navbar-item is-dark is-save" v-if="!$store.state.editing" @click="startEditing">
            <span>Start Editing</span>
          </a>
          <a class="navbar-item is-dark is-save" v-if="$store.state.editing && !$store.state.dirty" @click="stopEditing">
            <span>Finish Editing</span>
          </a>
          <a class="navbar-item is-dark is-icon" v-if="$store.state.editing && $store.state.dirty && !saving" @click="revert" title="Undo Changes">
            <i class="icon icon-undo2"></i>
          </a>
          <a class="navbar-item is-primary is-save" v-if="$store.state.editing && $store.state.dirty && !saving" @click="save">
            <span>Save Changes</span>
          </a>
          <a class="navbar-item is-primary is-save button is-loading" v-if="$store.state.editing && $store.state.dirty && saving">
          </a>
        </template>
        <template v-else>
          <a class="navbar-item is-dark is-save" @click="createPage">
            <span>Create Page</span>
          </a>
        </template>

      </div>
    </div>
  </nav>
</template>

<script>
import constants from '@/constants'
import createPage from '@/store/defaults/page'
import api from '@/api'

export default {
  name: 'AppToolbar',

  data () {
    return {
      saving: false
    }
  },

  computed: {
    formsHref () {
      return this.$store.state.config.redformsUrl
    },

    canEdit () {
      return !this.$store.getters.hasPageError
    },

    crmHref () {
      const { config } = this.$store.state

      if (this.$store.getters.featureEnabled('gus-v2')) {
        return constants.marleyUrl.replace('%spaceID%', config.spaceID)
      } else {
        if (process.browser) {
          return constants.workstationUrl.replace('%siteUrl%', window.location.origin)
        }
        return constants.workstationUrl
      }
    }
  },

  methods: {
    startEditing () {
      this.$store.dispatch('startEditing', true)
    },

    stopEditing () {
      this.$store.dispatch('stopEditing')
    },

    createPage () {
      if (!process.browser) return

      let slug = window.location.pathname === '/'
        ? 'index'
        : window.location.pathname.replace('/', '').split('/')[0]

      if (this.$route.meta.pageID) {
        slug = this.$route.meta.pageID
      }

      const page = createPage(slug)

      this.$store.dispatch('newPage', { page, pageID: slug }).then(() => {
        if (process.browser) {
          const { origin } = window.location
          window.location.href = origin + '/' + slug
        }
      })
    },

    newPage () {
      const slug = prompt('What would you like the URL to be?')
      if (!slug) return
      var slug_clean =  slug.replace('/', '');


      const page = createPage(slug_clean)

      this.$store.dispatch('newPage', { page, pageID: slug_clean }).then(() => {
        if (process.browser) {
          const { origin } = window.location
          window.location.href = origin + '/' + slug_clean
        }
      })
    },

    openWebsiteModal () {
      this.$store.commit('SHOW_WEBSITE_MODAL')
    },

    openPageModal () {
      this.$store.commit('SHOW_PAGE_MODAL')
    },

    openManagePagesModal () {
      this.$store.commit('SHOW_MANAGE_PAGES_MODAL')
    },

    save () {
      this.saving = true
      this.$store.dispatch('savePage', this.$router)
      .then(() => {
        this.saving = false
      }).catch(e => {
        this.saving = false
      })
    },

    revert () {
      // this.$store.dispatch('revertEdit')
      if (process.browser) {
        window.location.reload()
      }
    },

    duplicatePage () {
      const slug = prompt('What would you like the URL to be?')
      if (!slug) return

      let slug_clean =  slug.replace('/', '');
      const page = createPage(slug_clean);

      api.duplicatePage(this.$store.state, page.slug).then((res) => {
        if (process.browser) {
          const { origin } = window.location
          window.location.href = origin + '/' + slug_clean
        }
      })
    }
  }
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.app-toolbar
  +wsFont
  height: 52px
  background-color: $wsDarkGrey
  box-shadow: $wsBoxShadow
  user-select: none
  max-width: 100vw

.navbar-link,
.navbar-item
  cursor: pointer
  transition: all 150ms ease-in-out
  color: #dfdfdf !important

  .icon
    font-size: 20px

  &:hover
    background-color: darken($wsGrey, 5) !important
    color: #fff !important

  &.is-dark
    +wsButtonDark
    +wsButtonBig
    border-radius: 0
    box-shadow: none
    color: #fff !important

  &.is-primary
    +wsButtonPrimary
    +wsButtonBig
    border-radius: 0
    box-shadow: none
    color: #fff !important

  &.is-save
    width: 180px

.navbar-link
  &.is-dark,
  &.is-primary
    padding-right: 2.5rem

.navbar-home
  +wsButtonPrimary
  +wsButtonBig
  border-radius: 0
  text-align: left
  color: #fff !important
  box-shadow: none

  p,
  img
    position: relative
    z-index: 1

  p
    font-size: 14px
    text-transform: uppercase
    display: inline-block
    line-height: 1
    padding-left: 0.6rem
    font-weight: lighter

$dropdownBg: darken($wsGrey, 5)

.navbar-dropdown
  background-color: $dropdownBg !important
  display: block !important
  border-top-color: lighten($wsGrey, 5)
  pointer-events: none
  opacity: 0
  transform: scale(0.95)
  transition: all 150ms ease-in-out
  transform-origin: 0 0

  &.is-right
    transform-origin: 100% 0

  .navbar-item
    &:hover
      background-color: $wsGrey !important

.navbar-divider
  background-color: lighten($wsGrey, 5) !important

.navbar-item.is-hoverable
  &:hover
    .navbar-link
      background-color: $dropdownBg !important
      color: #fff !important

    .navbar-dropdown
      opacity: 1
      pointer-events: auto
      transform: scale(1)

.navbar-burger
  display: flex
  flex-direction: row
  width: auto

  .navbar-item
    height: 100%
    width: 52px
    text-align: center
    align-items: center
    justify-content: center

    &.is-dark,
    &.is-primary
      width: 82px

  +desktop
    display: none
</style>
