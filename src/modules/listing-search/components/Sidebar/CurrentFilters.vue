<template>
  <div v-if="filters.length">
    <h3 class="gus-sidebar__title var--gus-title">Current filters</h3>
    <ul class="gus-sidebar__list">
      <li v-for="filter in filters" class="gus-sidebar__list-item">
        <span>{{ filter.title }}</span>
        <button
          type="button"
          class="delete"
          @click="filter.clear"
          aria-label="clear"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script>
import filterUtils from '../../filters'

export default {
  name: 'currentFilters',

  methods: {
    clearFilters(filters) {
      this.$store.commit('unsetFilters', filters)
      this.$store.dispatch('submit')
    },
    async removeDefaultSearch(position) {
      if (!store.state.gus.saved) return
      const savedSearch = store.state.gus.saved.filter(item =>
        item.name.includes('[ Default ]')
      )
      if (savedSearch) {
        for (let x = position; x < savedSearch.length; x++) {
          await this.$store.dispatch('deleteSavedSearch', savedSearch[x].id)
        }
      }
    },
    async saveDefaultSearch() {
      if (this.$store.getters.autoSavedSearchTitle() === 'My Saved Search') {
        await this.removeDefaultSearch(0)
      } else {
        if (this.isAuth) {
          await this.$store.dispatch(
            'saveSearch',
            `[ Default ] ${this.$store.getters.autoSavedSearchTitle()}`
          )
          await this.removeDefaultSearch(1)
        }
      }
    }
  },
  computed: {
    filters: function() {
      const filters = this.$store.state.gus.filters
      const config = this.$store.state.gus.config
      // run through all imported panels and if title is not false (is set)
      // display the title as well as a way to clear
      return Object.keys(filterUtils)
        .map(key => {
          const utils = filterUtils[key]
          const title = utils.sidebarText(filters, config)
          const clear = () => this.clearFilters(utils.filters)
          return title ? {title, clear} : false
        })
        .filter(x => x)
    },
    isAuth: function() {
      return this.$store.state.config.clientIdToken !== ''
    },
    loadedState: function() {
      return this.$store.state.gus.userLoadState
    }
  },
  watch: {
    filters: async function() {
      // Check if property exists, if not, don't move further
      if (!store.state.config.gus.autoSaveSearch) {
        new Error('Website Not Configured For AutoSave')
        return
      }

      // Move forward only if feature is activated
      if (
        store.state.config &&
        store.state.config.gus &&
        store.state.config.gus.autoSaveSearch &&
        !store.state.config.gus.autoSaveSearch.activate
      )
        return

      // Only move forward if there is a geo location selected
      if (store.state.gus && !store.state.gus.geo) return

      const propertiesToWatch =
        store.state.config.gus.autoSaveSearch.itemsToWatch
      let filters = store.state.gus.filters
      let filtersAvailable = true

      propertiesToWatch.forEach(property => {
        if (filters[property] == null || !filters.hasOwnProperty(property)) {
          filtersAvailable = false
        }
      })

      if (!filtersAvailable) return

      if (store.getters.uniqueSavedSearchTitle() === 'My Saved Search') {
        await this.removeDefaultSearch(0)
        return
      }

      await this.removeDefaultSearch(0)
      await this.saveDefaultSearch()
    },
    loadedState: async function() {
      if (this.isAuth && this.loadedState === 2) {
        await this.removeDefaultSearch(0)
        await this.saveDefaultSearch()
      }
    }
  }
}
</script>

<style scoped lang="sass">
h3
  margin-bottom: 0.75rem

.delete
  margin: 2px 0 0 4px
</style>
