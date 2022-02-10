<template>
  <div :class="[ 'awesome-bar', 'gus-panel-container', mobile && 'is-mobile' ]" ref='awesome-bar'>

    <div class="field has-addons awesome-bar__field">
      <div :class="[ 'awesome-bar__control', 'control', 'has-icons-right', 'has-icons-left' ]">
        <Textbox @change="onTextChange" @focus="onFocus" @prevChoice="prevChoice" @nextChoice="nextChoice" @onChoose="onChoose" :searchString="searchString" />

        <span class="icon is-left gus-loading awesome-bar__loading" v-if="loading"></span>
        <span class="icon is-left icon-magnifier is-hidden-touch" v-else></span>

        <span v-if="searchString.length" @click="clear" class="icon is-right">
          <i class="icon-cross"></i>
        </span>

        <!--
        TODO before activiating: 
          - Error handling for when location services is off
          - ability to automatically switch filter to nearby
          - possibly add a radius

        <span v-if="!searchString.length" @click="getUserGeoLocation" class="icon is-right">
          <i class="icon-location"></i>
        </span>-->

        <div class="awesome-bar__border"></div>
        <div class="awesome-bar__mobile-bg is-hidden-tablet"></div>
      </div>
    </div>

    <div class="awesome-bar__results gus-panel box var--gus-box gus-layer-panel" :aria-hidden="hidden">
      <Sublist v-for="key in keys" :key="key" :results="results[key]" :title="definitions[key]" :highlighted="highlighted" @click="onChoose" />
    </div>
  </div>
</template>

<script>
import {
  sort as sortAutocompleteResults,
  KEYS,
  DEFINITIONS
} from '../../../helpers/autocomplete'
import Sublist from './Sublist.vue'
import Textbox from './Textbox.vue'
import {listingDetailsHref} from '../../../helpers/formatting'

export default {
  name: 'awesomeBar',

  props: [ 'mobile' ],

  data () {
    return {
      // focus refers to whether the input box OR the dropdown has the focus
      // a blur event only happens when you click outside the box
      focus: false,
      keys: KEYS,
      definitions: DEFINITIONS,
      highlightedIndex: 0,
      searchString: this.$store.getters.locationTitle
    }
  },

  computed: {
    results: function () {
      const sorted = sortAutocompleteResults(this.$store.state.gus.autocompleteResults)
      this.highlightedIndex = 0
      return sorted
    },

    highlighted: function () {
      return this.results.all[this.highlightedIndex]
    },

    loading: function () {
      return this.$store.state.gus.autocompleteWaiting
    },

    hidden: function () {
      return !(this.searchString && this.results.total && this.focus)
    },

    isHttps: function () {
      return this.$store.state.gus.config.requestUrl.indexOf('https') === 0
    }
  },
  methods: {
    onFocus () {
      this.focus = true
    },

    onBlur (e) {
      this.focus = false
    },

    onTextChange (newValue) {
      this.searchString = newValue
      this.$store.dispatch('maybeAutocomplete', newValue)
    },

    prevChoice () {
      this.highlightedIndex--
      if (this.highlightedIndex < 0) {
        this.highlightedIndex = this.results.all.length - 1
      }
    },

    nextChoice () {
      this.highlightedIndex++
      if (this.highlightedIndex >= this.results.all.length) {
        this.highlightedIndex = 0
      }
    },

    clear () {
      this.searchString = ''
      this.$store.commit('clearAutocompleteResults')
      this.$store.commit('clearGeo')
      this.$store.dispatch('submit')

      // if the map has been positioned, refresh it
      if (this.$store.state.gus.map.positionLoadState) {
        this.$store.dispatch('requestMapPosition')
      }
    },

    onChoose (choice) {
      // if choice is not passed, use whatever is highlighted
      choice = choice || this.highlighted
      // if nothing is highlighted, return early
      if (!choice) return

      // for listings, navigate directly to the listings page
      if (choice.type === 'listing') {
        window.location.href = listingDetailsHref(this.$store.state.config.gus.listingDetailsHref, choice.mls, choice.locationTitle)
        return
      }
      // for addresses, neighourhoods, and localities, set the geo
      // prop in the store and resubmit query
      this.$store.commit('setGeo', choice)
      this.$store.dispatch('submit')
      this.focus = false

      // clear results so that don't weirdly appear on the next focus
      this.$store.commit('clearAutocompleteResults')

      // if the map has been positioned, refresh it
      if (this.$store.state.gus.map.positionLoadState) {
        this.$store.dispatch('requestMapPosition')
      }
    },

    noop: function (e) {
      e.stopPropagation()
      return true
    },

    getUserGeoLocation: function (e) {
      e.preventDefault()
      this.$store.dispatch('getUserGeoLocation').then(() => {
        this.$store.dispatch('submit')
      })
    }
  },

  created () {
    let locationTitle = this.$store.getters.locationTitle
    this.$store.subscribe(() => {
      const newLocationTitle = this.$store.getters.locationTitle
      if (locationTitle !== newLocationTitle) {
        locationTitle = newLocationTitle
        this.searchString = newLocationTitle
      }
    })
  },

  mounted () {
    this.$refs['awesome-bar'].addEventListener('click', this.noop)
    document.querySelector('body').addEventListener('click', this.onBlur)
  },

  beforeDestroy () {
    this.$refs['awesome-bar'].removeEventListener('click', this.noop)
    document.querySelector('body').removeEventListener('click', this.onBlur)
  },

  components: {
    Textbox,
    Sublist
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../../assets/sass/variables'

.awesome-bar__control
  flex-grow: 1

.control.has-icons-right .is-right
  &:last-of-type
    margin-right: 0 !important

.control.has-icons-right .is-right
  font-size: 1rem
  border: none
  background: none
  pointer-events: all
  cursor: pointer

.awesome-bar__field
  height: 46px
  margin-bottom: 0
  .control
    position: relative
    &.has-icons-left
      .input
        padding-left: 40px
    &.has-icons-right
      .input
        padding-right: 40px

    +desktop
      .icon
        opacity: 1
        height: 46px
        width: 46px
    +touch
      .icon
        height: 28px
        width: 28px
        padding: 0 !important
        i
          color: var(--header-brandText)
    .input
      border: none
      box-shadow: none
      background: none
      height: 46px
      line-height: 46px
      border-radius: 0
    .is-right
      margin-right: 46px
    .awesome-bar__loading
      font-size: 0.6em
      width: 18px
      height: 18px
      margin: 14px 0 0 14px
      opacity: 0.4
      +mobile
        margin: 3px 0 0 2px

.awesome-bar__border,
.awesome-bar__mobile-bg
  position: absolute
  pointer-events: none
  top: 0
  left: 0
  right: 0
  bottom: 0

.awesome-bar__border
  z-index: 0
  border: solid 1px transparent
  border-radius: 4px

+with-palette
  .awesome-bar__border
    border-color: var(--#{$palette}-text)

.awesome-bar__mobile-bg
  z-index: -1

.awesome-bar__results
  width: 100%
  top: 100%
  padding: 0.5rem 0
  padding-bottom: 1rem

.is-mobile
  .awesome-bar__field
    height: 28px
    line-height: 28px
    .control
      .input
        height: 28px
        line-height: 28px
        padding: 0 28px 0 10px
        background: rgba(0,0,0,0.2)
  .awesome-bar__results
    position: fixed
    top: 50px
    right: 0px
    left: 0px
    width: auto
    max-height: calc(100vh - 40px - 50px)
    overflow-y: auto
    -webkit-overflow-scrolling: touch
    border-radius: 0
    background: #fafafa
    padding: 0 0 60px 0 !important

.is-mobile
  /deep/
    .gus-list__title
      font-size: 16px
      margin: 20px 0 10px 0
    li
      margin-top: -1px
      &:hover
        background: transparent !important
    a
      line-height: 1.4rem
      border-top: solid 1px #dfdfdf
      border-bottom: solid 1px #dfdfdf
      font-size: 16px
      color: var(--header-text) !important
      background: #fff
      &:hover,
      &.highlighted
        background: #fff !important

</style>
