<template>
  <div v-if="searches.length">
    <h3 v-show="!mobile" class="gus-sidebar__title var--gus-title">Popular searches</h3>
    <ul v-show="!mobile" class="gus-sidebar__list">
      <li v-for="search in searches" class="gus-sidebar__list-item">
        <a :href="search.href" class="popular-filter" @click="(e) => { search.onClick(e), $emit('search-selected') }">
          {{search.label}}
        </a>
      </li>
    </ul>
    <div v-show="mobile" class="gus-list">
      <ul class="gus-list__items">
        <li v-for="search in searches">
          <a :href="search.href" class="popular-filter" @click="(e) => { search.onClick(e), $emit('search-selected') }">
            {{search.label}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popularFilters',

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    },

    searches () {
      return Object.keys(this.$store.state.config.gus.preconfiguredSearches)
        .slice(0, 20)
        .map(slug => {
          const _this = this
          return {
            label: this.$store.getters.preconfiguredSearchName(slug),
            href: _this.$store.getters.urlAfterMutation('setPreconfiguredSearch', slug),
            onClick: e => {
              e.preventDefault()
              _this.$store.commit('setPreconfiguredSearch', slug)
              _this.$store.dispatch('submit')
              // if the map has been positioned, refresh it
              if (this.$store.state.gus.map.positionLoadState) {
                this.$store.dispatch('requestMapPosition')
              }
              return false
            }
          }
        })
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.popular-filter
  border: none
  background: none
  font-size: inherit
  text-decoration: inherit
  font-weight: inherit
  padding: 0
  cursor: pointer
  color: inherit
  +mobile
    text-decoration: none

.gus-list
  margin: 10px 0

h3
  margin-bottom: 0.75rem

.delete
  margin: 2px 0 0 4px
</style>
