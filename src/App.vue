<template>
  <div id="phoenix" class="rm-page-builder" :class="$store.getters.canEdit ? 'rm-page-builder-editor' : ''">
    <!-- User generated styles -->
    <!-- <app-styles v-if="process.browser" :schema="stylexSchema" :styles="$store.state.website.theme" /> -->

    <!-- Analytics integrations -->
    <noscript v-if="analytics.googleTagManager.trackingID">
      <iframe
        :src="`https://www.googletagmanager.com/ns.html?id=${analytics.googleTagManager.trackingID}`"
        height="0" width="0" style="display:none;visibility:hidden"
      >
      </iframe>
    </noscript>

    <!-- UI components (modals, notifications, etc) -->
    <div class="app-page__ui">
      <app-ui />
    </div>

    <!-- Page container -->
    <div class="app-page var--app">
      <!-- Search map view -->
      <div class="app-page__map-view var--app-default" :style="{ top: isMobile ? 0 : (headerHeight + 'px') }">
        <map-view v-if="mapLoaded && !isMapListingSearchStrap" :isOpen="mapView" @reqCloseMap="closeMap" />
      </div>

      <!-- Header content -->
      <div class="app-page__header">
        <!-- Admin toolbar -->
        <client-only>
          <div class="app-page__toolbar" v-if="$store.getters.canEdit">
            <app-toolbar />
          </div>
        </client-only>

        <!-- Main nav -->
        <div class="app-page__nav" >
          <app-header :header="$store.state.header" @ready="update" ref="nav" :key="$store.state.header.name" />
        </div>
      </div>

      <template v-if="mobileFooter">
        <div class="mobile-header-outer app-header__mobile var--app-header is-footer">
          <component
            :is="mobileFooter"
            :key="mobileFooter.name"
          />
        </div>
      </template>

      <AppIEDisclaimer v-show="isIE"/>

      <!-- Main page content -->
      <div class="app-page__content" ref="content">
        <!-- Hero strap -->
        <div class="app-page__hero" v-if="!$store.getters.hasPageError && $store.getters.hero && $store.getters.isCmsPage && !(isMapListingSearchStrap && mapView)">
          <app-strap :strap="$store.getters.hero" :key="$store.getters.hero.name" />
        </div>

        <router-view />

        <!-- Footer -->
        <div v-if="!isMapListingSearchStrap" class="app-page__footer">
          <app-footer :footer="$store.state.footer" :key="$store.state.footer.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import constants from '@/constants'
import AppUi from '@/components/ui/AppUi'
import AppStrap from '@/components/AppStrap'
import AppHeader from '@/components/AppHeader'
import AppStyles from '@/components/AppStyles'
import AppFooter from '@/components/AppFooter'
import AppToolbar from '@/components/AppToolbar'
import AppIEDisclaimer from '@/components/AppIEDisclaimer'
import ClientOnly from '@/components/ClientOnly'
import filters from '@/filters'
import stylex from '@/constants/stylex'
import get from 'lodash/get'
import cssVars from 'css-vars-ponyfill'
import Color from 'color'
import PageAPI from '@/page-api'
import makeMetaInfo from '@/meta-info'
const MapView = process.browser ? () => import('@/modules/listing-search/components/MapView/index.vue') : null

// Use filters
for (let name in filters) {
  const method = filters[name]
  Vue.filter(name, method)
}

export default {
  name: 'app',

  components: {
    AppUi,
    AppStrap,
    AppHeader,
    AppStyles,
    AppFooter,
    AppToolbar,
    AppIEDisclaimer,
    ClientOnly,
    MapView
  },

  metaInfo () {
    return makeMetaInfo(this.$store.state, this.cssVars)
  },

  data () {
    const p = this.$store.state.website.theme.straps
    const { fonts, header } = this.$store.state.website.theme

    const textShadow = (obj) => {
      return obj.enabled ? `${obj.x}px ${obj.y}px ${obj.blur}px ${obj.color}` : 'none'
    }

    const getRGB = (color) => {
      const { r, g, b } = Color(color).rgb().object()
      return `${r}, ${g}, ${b}`
    }

    const fontStyle = (weight) => {
      if (weight.includes('i')) return 'italic'
      return 'inherit'
    }

    const cssVars = {
      // Fonts
      'fonts-body-family': `'${fonts.body.family}'`,
      'fonts-body-weight': fonts.body.weight.replace('i', ''),
      'fonts-body-style': fontStyle(fonts.body.weight),
      'fonts-title-family': `'${fonts.title.family}'`,
      'fonts-title-weight': fonts.title.weight.replace('i', ''),
      'fonts-title-style': fontStyle(fonts.title.weight),

      // Styles
      // TODO

      // Header
      'header-text': header.text,
      'header-linkText': header.linkText,
      'header-titleText': header.titleText,
      'header-bgColor': header.bgColor,
      'header-brandBgColor': header.brandBgColor,
      'header-brandBgColor2': header.brandBgColor2,
      'header-brandText': header.brandText,
      'header-textShadow': textShadow(header.textShadow),

      // Palettes
      'default-text': p.default.text,
      'default-text-rgb': getRGB(p.default.text),
      'default-linkText': p.default.linkText,
      'default-titleText': p.default.titleText,
      'default-bgColor': p.default.bgColor,
      'default-accentColor': p.default.accentColor,
      'default-overlayAlpha': p.default.overlayAlpha,
      'default-overlayAngle': p.default.overlayAngle,
      'default-uiPrimary-text': p.default.uiPrimary.text,
      'default-uiPrimary-bgColor': p.default.uiPrimary.bgColor,
      'default-uiSecondary-text': p.default.uiSecondary.text,
      'default-uiSecondary-bgColor': p.default.uiSecondary.bgColor,

      'feature-text': p.feature.text,
      'feature-text-rgb': getRGB(p.feature.text),
      'feature-linkText': p.feature.linkText,
      'feature-titleText': p.feature.titleText,
      'feature-bgColor': p.feature.bgColor,
      'feature-accentColor': p.feature.accentColor,
      'feature-overlayAlpha': p.feature.overlayAlpha,
      'feature-overlayAngle': p.feature.overlayAngle,
      'feature-uiPrimary-text': p.feature.uiPrimary.text,
      'feature-uiPrimary-bgColor': p.feature.uiPrimary.bgColor,
      'feature-uiSecondary-text': p.feature.uiSecondary.text,
      'feature-uiSecondary-bgColor': p.feature.uiSecondary.bgColor,

      'alternate-text': p.alternate.text,
      'alternate-text-rgb': getRGB(p.alternate.text),
      'alternate-linkText': p.alternate.linkText,
      'alternate-titleText': p.alternate.titleText,
      'alternate-bgColor': p.alternate.bgColor,
      'alternate-accentColor': p.alternate.accentColor,
      'alternate-overlayAlpha': p.alternate.overlayAlpha,
      'alternate-overlayAngle': p.alternate.overlayAngle,
      'alternate-uiPrimary-text': p.alternate.uiPrimary.text,
      'alternate-uiPrimary-bgColor': p.alternate.uiPrimary.bgColor,
      'alternate-uiSecondary-text': p.alternate.uiSecondary.text,
      'alternate-uiSecondary-bgColor': p.alternate.uiSecondary.bgColor
    }

    return {
      cssVars,
      headerHeight: 0,
      scrollHandler: null,
      watchHandler: null,
      initialBodyClasses: [],
      resizeHandler: null,
      resizeDebounce: null,
      setCssVarsInterval: null
    }
  },

  computed: {
    isMobile () {
      return this.$store.getters.isMobile
    },

    isIE () {
      let userAgent = (window.navigator.userAgent).indexOf("MSIE ");
      if (userAgent > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  {
        return true
      }
    },

    mobileFooter () {
      return this.$route.meta && (this.$route.meta.mobileFooter || false)
    },

    process () {
      return process
    },

    constants () {
      return constants
    },

    analytics () {
      return this.$store.state.website.integrations.analytics
    },

    modalOpen () {
      return this.$store.getters.modalOpen || (this.$store.state.ui.mobileScreens.length > 0) || this.mapView
    },

    stylexSchema () {
      return stylex(this.$store.state.website.theme.dark)
    },

    mapView () {
      return this.$store.state.gus.anchor === 'map'
    },

    mapLoaded () {
      return this.$store.state.gus.mapLoaded
    },

    isMapListingSearchStrap () {
      return this.$store.state.page.straps.find(strap => strap.name === 'strap-map-listing-search')
    }
  },

  watch: {
    modalOpen (value) {
      if (process.browser) {
        console.log('modal open? --', value)
        this.setHeaderHeight()
        if (value) {
          document.body.addEventListener('touchmove', this.preventScrolling)
        } else {
          document.body.removeEventListener('touchmove', this.preventScrolling)
        }
      }

      this.update()
    }
  },

  created () {
    if (process.browser) {
      window.setCssVars = this.setCssVars.bind(this)
    }

    // Set page type for back button functionality
    this.$store.commit('SET_PAGE_TYPE', this.$route.meta.pageType)

    if (process.browser) {
      // Window / document global event handlers
      this.$store.dispatch('attachPageAPI', new PageAPI(this))

      this.scrollHandler = this.onScroll.bind(this)
      window.addEventListener('scroll', this.scrollHandler)

      this.resizeHandler = this.onResize.bind(this)
      window.addEventListener('resize', this.resizeHandler)
    }
  },

  destroyed () {
    if (process.browser) {
      window.removeEventListener('scroll', this.scrollHandler)
      window.removeEventListener('resize', this.resizeHandler)
    }
  },

  mounted () {
    this.$store.dispatch('triggerCustomEvent', {
      eventName: 'before-mount'
    })

    if (process.browser) {
      this.initialBodyClasses = document.body.className
        ? document.body.className.split(' ')
        : []

      this.$store.commit('SET_SCREEN_SIZE', {
        width: window.innerWidth,
        height: window.innerHeight
      })

      this.$nextTick(() => this.setCssVars())

      // Hacky thing for IE 11
      if (!!window.MSInputMethodContext && !!document.documentMode) {
        console.log('IE 11 hack. IE 11 hack.')

        clearInterval(this.setCssVarsInterval)
        this.setCssVarsInterval = setInterval(() => {
          this.setCssVars()
        }, 2000)
      }
    }

    this.update()

    this.$nextTick(() => {
      this.$store.dispatch('triggerCustomEvent', {
        eventName: 'mount'
      })
    })
  },

  updated () {
    this.update()
  },

  methods: {
    setCssVars () {
      console.log('- set CSS vars -')

      cssVars({
        variables: this.cssVars
      })
    },

    preventScrolling (e) {
      e.preventDefault()
    },

    closeMap () {
      this.$store.commit('setAnchor', null)
    },

    setHeaderHeight () {
      const { nav } = this.$refs

      let height = 0

      if (process.browser && nav) {
        if (this.$store.getters.canEdit) {
          height += constants.toolbarHeight // height of toolbar
        }

        const rect = nav.$el.getBoundingClientRect()
        height += rect.height
      }

      this.headerHeight = height
    },

    setBodyClasses () {
      if (process.browser) {
        const { website } = this.$store.state
        const { modalOpen } = this

        const body = document.querySelector('body')
        const classes = website.config.setup.bodyClasses
          ? [ ...website.config.setup.bodyClasses.trim().split(' '), ...this.initialBodyClasses ]
          : [ ...this.initialBodyClasses ]

        if (website.theme.dark) classes.push('rm-dark-website')
        if (modalOpen) classes.push('has-modal-open')
        classes.push('page-' + this.$store.state.config.pageID)

        body.className = ''
        classes.forEach(c => {
          if (!c) return

          try {
            body.classList.add(c)
          } catch (e) {
            console.warn(e)
          }
        })

        document.documentElement.className = modalOpen ? 'has-modal-open' : ''
      }
    },

    update () {
      // if the map view is navigated to, set the header height explict
      if (this.$store.state.gus.mapLoaded) Vue.nextTick(() => this.setHeaderHeight())
    },

    onScroll (e) {

    },

    onResize (e) {
      clearTimeout(this.resizeDebounce)

      this.resizeDebounce = setTimeout(() => {
        this.$store.commit('SET_SCREEN_SIZE', {
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 100)
    }
  }
}
</script>

<style lang="sass">
@import './assets/sass/editable'
@import './assets/sass/flickity'
@import './assets/sass/form'
@import './assets/sass/hero'
@import './assets/sass/modal'
@import './assets/sass/nav'
@import './assets/sass/padding'
@import './assets/sass/strap'
@import './assets/sass/file-upload'
@import './assets/sass/mobile-header'

*
  -ms-touch-action: manipulation
  touch-action: manipulation

strong,
.radio:hover,
.checkbox:hover
  color: inherit


body
  font-family: var(--fonts-body-family)
  font-weight: var(--fonts-body-weight)
  font-style: var(--fonts-body-style)
  .title
    font-family: var(--fonts-title-family)
    font-weight: var(--fonts-title-weight)
    font-style: var(--fonts-title-style)

.header__nav-bar
  .navbar-dropdown
    background: var(--header-brandBgColor) !important
    color: var(--header-brandText) !important
    a.navbar-item,
    a.navbar-link
      color: var(--header-brandText) !important
      &:hover
        color: var(--header-brandBgColor) !important
        background: var(--header-brandText) !important

.var--app-header
  &.app-header__desktop
    color: var(--header-text)
    background: var(--header-bgColor)
    a,
    a:link,
    a:hover,
    a:visited
      color: var(--header-linkText)
    .title,
    .masthead
      color: var(--header-titleText)
      a,
      a:link,
      a:hover,
      a:visited
        color: var(--header-titleText)
    .button,
    a.button,
    .button:hover,
    .button:visited
      color: var(--header-brandText)
      background-color: var(--header-brandBgColor)
  .app-header__mobile,
  &.app-header__mobile
    color: var(--header-brandText)
    background-color: var(--header-brandBgColor)
    background-image: linear-gradient(90deg, var(--header-brandBgColor), var(--header-brandBgColor2))
    @media (min-width: 769px)
      display: none
    a,
    a:link,
    a:hover,
    a:visited
      color: var(--header-brandText)
    .button,
    a.button,
    .button:hover,
    .button:visited
      &.is-primary
        color: var(--header-brandBgColor)
        background-color: var(--header-brandText)
      &.is-outlined
        color: var(--header-brandText)
        border-color: var(--header-brandText)
    .input
      color: var(--header-brandText)
      &::placeholder
        color: var(--header-brandText)
        opacity: 0.6
  .app-screen__mobile,
  &.app-screen__mobile
    color: var(--header-text)
    background-color: var(--header-bgColor)
    a,
    a:link,
    a:hover,
    a:visited
      color: var(--header-brandBgColor)
    .button,
    a.button,
    .button:hover,
    .button:visited
      &.is-primary
        color: var(--header-brandText)
        background-color: var(--header-brandBgColor)
      &.is-outlined
        color: var(--header-brandBgColor)
        border-color: var(--header-brandBgColor)
    .input
      color: var(--header-text)
      &::placeholder
        color: var(--header-text)
        opacity: 0.6

+with-palette
  color: var(--#{$palette}-text)
  &.strap
    background: var(--#{$palette}-bgColor)
  a,
  a:link,
  a:hover,
  a:visited
    color: var(--#{$palette}-linkText)
  .title
    color: var(--#{$palette}-titleText)
  .tag,
  strong,
  .subtitle
    color: var(--#{$palette}-text)
  .button,
  a.button,
  .button:hover,
  .button:visited
    &.is-primary
      color: var(--#{$palette}-uiPrimary-text)
      background-color: var(--#{$palette}-uiPrimary-bgColor)
    &.is-secondary
      color: var(--#{$palette}-uiSecondary-text)
      background-color: var(--#{$palette}-uiSecondary-bgColor)
    &.is-outlined
      color: var(--#{$palette}-uiPrimary-bgColor)
      border-color: var(--#{$palette}-uiPrimary-bgColor)
    &.is-outlined-light
      color: #fff
      border-color: #fff
  .input
    color: var(--#{$palette}-text)
    &::placeholder
      color: var(--#{$palette}-text)
      opacity: 0.6
  input,
  button,
  select,
  textarea
    color: var(--#{$palette}-text)
    font-family: var(--fonts-body-family)
    font-weight: var(--fonts-body-weight)
    &::placeholder
      color: var(--#{$palette}-text)
      opacity: 0.6
  .social-icons
    a
      background: var(--#{$palette}-uiPrimary-bgColor)
      color: var(--#{$palette}-uiPrimary-text)

html
  overflow-x: hidden
  &.has-modal-open
    overflow-y: hidden

html,
body
  max-width: 100vw

.masthead
  a
    text-decoration: none !important

.app-page
  position: relative

a,
.button
  transition: none

/*
 * UI
 */

.app-page__ui
  position: fixed
  pointer-events: none
  z-index: 5
  top: 0
  left: 0
  width: 100vw
  height: 100vh

// LAYERS

.gus-layer-base
  z-index: 0

.gus-layer-img
  z-index: 11
  pointer-events: all

.gus-layer-caption
  z-index: 21
  pointer-events: all

.gus-layer-sticky
  z-index: 31
  pointer-events: all
  .layer-bg
    z-index: 30
  .layer-fg
    z-index: 32

.gus-layer-map
  pointer-events: all
  .layer-bg
    z-index: 40
  .layer-fg
    z-index: 42

.gus-layer-panel
  z-index: 51
  pointer-events: all
  .layer-bg
    z-index: 50
  .layer-fg
    z-index: 52

/*
 * Header
 */

.app-page__header
  z-index: 1
  top: 0
  left: 0
  right: 0

.app-page__toolbar
  position: fixed
  z-index: 3
  top: 0
  left: 0
  right: 0

.app-page__nav
  z-index: 0
  // left: 0
  // right: 0

.rm-page-builder-editor .app-page__nav
  padding-top: 52px
  position: relative
  top: 0px
  z-index: 2

.app-page__hero
  position: relative
  z-index: 2

/*
 * Content
 */

.app-page__map-view
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 1
  pointer-events: none

.app-page__content
  position: relative
  z-index: 0
  min-height: 100vh
  display: flex
  flex-direction: column
  border-bottom: 1px solid red
  +mobile
    padding-top: 50px


.rm-page-builder-editor .app-page__content
  +mobile

/*
 * Quill
 */

.quill-editor
  position: relative
  z-index: 1
  display: block
  width: 100%
  min-width: 1em
  min-height: 1em

  .ql-tooltip
    width: 300px
    text-align: center
    background-color: $wsDarkGrey
    border-radius: 3px
    box-shadow: 0 2px 7px rgba($wsDarkGrey, 0.4)
    z-index: 9

  .ql-picker-options
    background-color: $wsDarkGrey
    box-shadow: 0 2px 7px rgba($wsDarkGrey, 0.4)

  .ql-container,
  &.ql-container
    font-family: inherit
    font-size: inherit
    height: auto !important

  .ql-editor
    text-align: inherit
    font-size: inherit
    overflow: visible
    overflow-x: visible
    overflow-y: visible
    padding: 0
    height: auto !important

    p
      margin-bottom: 1em

      &:last-child
        margin-bottom: 0

  .ql-tooltip
    border-radius: 2px
    z-index: 3

.ql-bubble
  .ql-tooltip-editor
    input[type=text]
      left: 0

.editable-title
  .ql-editor
    margin: -12px -15px
    padding: 12px 15px
.p-b-0
  .ql-editor
    margin: -12px -15px
    padding: 0 15px

.rm-dark-website
  .rm-disclaimer
    div[class*='background:url']
      filter: invert(1)

// SUBMIT FORM IN SEARCH HERO
.modal-estimate
  .modal-box__content
    padding: 30px 0
  .title
    color: grey !important
  .form-control
    border-color: grey
  .form-group
    margin-bottom: .3rem !important
  button
    background-color: var(--feature-uiPrimary-bgColor) !important

// HERO FILTER SEARCH STYLES
.gus-filter
  display: inline-block
  width: 100%

.gus-filter__title
  font-weight: 700
  font-size: 1.1rem
  margin: 1em 0 0.25em

.gus-filter__text-value
  font-size: 14px
  margin-bottom: 5px
  +desktop
    font-size: 0.9rem
    margin: 0.25em 0
.var--gus-radio
  display: inline-block

.var--gus-radio__input
  display: none

.var--gus-radio__label
  display: inline-block
  border: 1px solid
  border-radius: 3px
  padding: 0 10px
  +mobile
    height: 28px
    line-height: 28px
    font-size: 16px
    flex: 1
  +desktop
    padding: 0.3em 0.6em

.var--gus-radio__input:checked + .var--gus-radio__label
  color: white

.control__placeholder
  white-space: nowrap!important
  overflow: hidden!important
  text-overflow: ellipsis!important

// RANGE

.gus-filter__range
  width: 100%

.gus-range__labels
  font-size: 0.9rem
  display: block

.gus-range__label-max
  float: right

// map info window
.map-infowindow__containner
  display: flex
  img
    width: 50px
    height: 50px
  div
    margin-left: 7px
  h4
    font-weight: 800
    font-size: 16px
  h5
    font-weight: 500
    font-size: 14px

.gm-style-iw
  button
    display: none !important

.gm-style-iw-t::after
  display: none

.map-search-listing__footer
  .container
    width: fit-content !important
  @media (max-width: 1023px) and (min-width: 769px)
    .strap-container
      padding-left: 1rem !important
      padding-right: 1rem !important
      .columns
        display: block !important
    .level
      display: block !important
    .level-item
      width: fit-content !important
  .rm-disclaimer-logo
    @media (max-width: 1023px)
      padding: 2rem 0 !important

.anchor-map-search-listing
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: 31
</style>
