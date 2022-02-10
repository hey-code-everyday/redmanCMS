<template>
  <div class="save-search-wrapper">
    <a href="#" class="var--gus-primary save-search__user-action" @click="signin" v-if="!mapMode">{{userLoadState ? 'Logout' : 'Sign up'}}</a>
    <div class="save-search gus-panel-container" :ref="$options.name">
      <button type="button" :class="`button strap-button is-primary save-search__save ${mapMode ? 'min-height-46' : ''}`" @click="openSaveSearch">Save Search</button>
      <button type="button" :class="`button strap-button is-primary save-search__previous ${mapMode ? 'min-height-46' : ''}`" @click="openPreviousSearches" aria-label="Previous searches">
        <i class="icon-chevron-up"></i>
      </button>
      <SaveSearch v-if="isSaveSearchOpen" @requestClose="close" :disabled="disabled" />
      <PreviousSearches :open="isPreviousSearchesOpen" @requestClose="close" :disabled="disabled" />
    </div>

  </div>
</template>

<script>
import SaveSearch from './SaveSearch'
import PreviousSearches from './PreviousSearches.vue'
import Panel from '../partials/Panel.vue'
import loginActionStorage from '@/helpers/loginActionStorage'

export default {
  name: 'saveSearch',
  extends: Panel,

  data: function () {
    return {
      openPanel: null
    }
  },
  props: {
    mapMode: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    isLoggedIn (loggedIn) {
      if (loggedIn) loginActionStorage.onLogin(this.$store)
    }
  },

  computed: {
    userLoadState: function () {
      return this.$store.state.gus.userLoadState
    },
    disabled: function () {
      return (this.userLoadState === 1)
    },
    isSaveSearchOpen: function () {
      return this.$store.getters.isPanelOpen('SaveSearch')
    },
    isPreviousSearchesOpen: function () {
      return this.$store.getters.isPanelOpen('PreviousSearches')
    },
    isLoggedIn: function () {
      if (this.$store.state.config.clientIdToken) return true
      return false
    }
  },

  methods: {
    openSaveSearch: function () {
      loginActionStorage.deferUntilLogin(this.$store, 'openPanel', 'SaveSearch')
    },

    openPreviousSearches: function () {
      loginActionStorage.deferUntilLogin(this.$store, 'openPanel', 'PreviousSearches')
    },

    close: function () {
      this.$store.commit('closePanel')
    },

    signout: function () {
      this.$store.dispatch('clearClientAuth')
    },

    signin: function () {
      if (this.userLoadState) return this.signout()
      this.$store.commit('SHOW_AUTH')
    }
  },

  components: {
    SaveSearch,
    PreviousSearches
  }
}
</script>

<style scoped lang="sass">

.save-search-wrapper
  flex-wrap: wrap
  align-items: center
  display: flex
  @media (min-width: 769px)
    margin: 1rem 0
    justify-content: flex-end
  @media (min-width: 1008px)
    justify-content: flex-start

.save-search
  flex: 1 0 auto
  display: flex
  align-items: center
  @media (min-width: 769px)
    flex-grow: 0
    justify-content: flex-end
  @media (min-width: 1008px)
    justify-content: flex-start

.save-search__user-action
  display: block
  padding: 0 12px
  margin-left: 1.5rem
  text-decoration: underline
  &:hover
    color: inherit !important
  @media (min-width: 1008px)
    order: 3
    padding: 1em 0
  @media (max-width: 1215px)
    margin-left: 0

.save-search__save,
.save-search__previous

.save-search__save
  flex-grow: 1
  @media (min-width: 769px)
    flex-grow: 0

.save-search__previous
  margin-left: 1px
  i
    vertical-align: text-bottom
  @media (min-width: 769px)
    min-width: 52px
    width: 52px
    margin-left: 1px
    i
      display: inline-block
      transform: rotate(180deg)
.min-height-46
  height: 46px !important
  min-height: 46px !important
</style>
