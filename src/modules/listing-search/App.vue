<template>
  <div id="gus-search" :class="['var--gus-app', 'rm-gus-search', scrollLock ? 'scroll-lock' : null]" ref="app">
    <ListingsSearch :mapMode="mapMode"/>
  </div>
</template>

<script>
import ListingsSearch from './components/ListingsSearch'
import Styles from '@/components/AppStyles'
import stylesSchema from './stylesSchema'

export default {
  name: 'app',

  components: {
    ListingsSearch,
    Styles
  },

  props: {
    mapMode: {
      type: Boolean,
      default: () => false
    }
  },

  data: function () {
    return {
      stylesSchema
    }
  },

  computed: {
    scrollLock: function () {
      return this.$store.getters.isLockVisible
    },

    styles: function () {
      return this.$store.state.config.gus.styles
    }
  },

  created () {
    if (this.mapMode) this.$store.dispatch('requestMapPosition')
  }
}
</script>

<style lang="sass">
@import '../../assets/sass/variables'

#gus-search.scroll-lock
  overflow-y: hidden
  // disrupt rest of page to make it un-scrollable
  height: 0
  margin-top: -9999px
  @media (min-width: 768px)
    height: auto
    margin-top: 0

#gus-search
  .section
    background-color: inherit !important
  strong
    color: inherit !important


// UTILITIES

.gus-panel-container
  position: relative

.gus-panel
  position: absolute
  left: 0
  right: 0
  max-width: 100%
  top: 100%
  z-index: 10

.gus-panel--modal
  position: fixed
  top: 10%
  left: 2em
  right: 2em
  margin: 0 auto
  z-index: 100
  max-width: 450px
  transition: 0.2s ease-in-out opacity
  box-shadow: 0 0 0 1000vh rgba(0, 0, 0, 0.7)
  border-top-left-radius: 0
  border-top-right-radius: 0
  border-bottom-left-radius: 0
  border-bottom-right-radius: 0

.gus-panel--mobile-up
  margin: 0 1rem
  z-index: 100
  max-width: 100%
  transition: 0.2s ease-in-out opacity
  @media (max-width: (768px))
    width: 100%
    background: transparent
    box-shadow: none
    border: none
    padding: 0
    margin: 0
  @media (min-width: 769px)
    position: absolute
    right: 0
    left: auto
    top: 100%
    margin: 1rem
    min-width: 400px
  @media (min-width: 1008px)
    left: 0
    right: auto

.gus-panel[aria-hidden],
.gus-panel--modal[aria-hidden],
.gus-panel--mobile-up[aria-hidden]
  display: none
  opacity: 0

// FILTER PANEL GENERAL

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


// LINK LISTS

.gus-list
  line-height: 1.1

.gus-list__title
  margin-top: 0.5rem
  padding-left: 0.4em
  font-weight: 700
  font-size: 1.2rem
  // +mobile
  //   font-size: 14px
  //   margin: 10px
  //   padding: 0
  //   line-height: 1.3

.gus-list__items
  // +mobile
  //   margin-bottom: 20px
  //   .delete
  //     margin: 10px 10px 0 0

.gus-list__items li a:not(.delete)
  display: block
  padding: 0.5em 0.8em
  color: inherit
  &:hover,
  &.highlighted
    background-color: rgba(10, 10, 10, 0.1)
    color: inherit
  // +mobile
  //   padding: 0 10px
  //   font-size: 14px
  //   height: 40px
  //   line-height: 40px
  //   background: #fff
  //   box-shadow: 0 0 0 1px #dfdfdf

.gus-list__noresults
  padding: 0.5em 0.8em

// SIDEBAR

.gus-sidebar__title
  font-weight: 700
  font-size: 1.2rem

.gus-sidebar__list
  margin-bottom: 1em

.gus-sidebar__list-item
  text-decoration: underline
  cursor: pointer

// "BUBBLE-STYLE" RADIO BUTTON

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


// CUSTOM CHECKBOXES

.var--gus-checkbox__input
  display: none

.var--gus-checkbox__label
  display: block
  width: 100%
  white-space: nowrap
  text-overflow: ellipsis
  overflow: hidden
  &::before
    content: ' '
    display: inline-block
    margin-right: 0.3em
    width: 1.2em
    height: 1.2em
    border-radius: 3px
    border: 1px solid
    vertical-align: text-bottom

.var--gus-checkbox__input:checked + .gus-checkbox__label
  color: #666


// CLICKABLE TAGS

.var--gus-tag
  display: inline-block

.var--gus-tag__input
  display: none

.var--gus-tag__label
  display: block
  border: 1px solid
  margin: 0.25em 0.5em 0.25em 0
  padding: 0 12px
  line-height: 2
  border-radius: 2em
  cursor: pointer

+with-palette
  .var--gus-tag__label
    border-color: var(--#{$palette}-uiPrimary-bgColor)
  .var--gus-tag__input:checked + .var--gus-tag__label
    color: var(--#{$palette}-uiPrimary-text)
    background-color: var(--#{$palette}-uiPrimary-bgColor)

// RANGE

.gus-filter__range
  width: 100%

.gus-range__labels
  font-size: 0.9rem
  display: block

.gus-range__label-max
  float: right


// CLOSE BOX (override modal close)

.gus-close
  position: relative
  top: 0
  right: 0
  background-color: rgba(10, 10, 10, 0.3)


// CIRCULAR LOADING ANIMATION

.gus-loading
  display: inline-block
  width: 1em
  height: 1em
  border-radius: 50%
  border: 2px solid
  border-top-color: transparent
  box-sizing: border-box
  animation: loading 1.2s linear infinite
  -webkit-animation: loading 1.2s linear infinite

@keyframes loading
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

@-webkit-keyframes loading
  0%
    -webkit-transform: rotate(0deg)
  100%
    -webkit-transform: rotate(360deg)

.nagbar
  margin-right: 0 !important

</style>
