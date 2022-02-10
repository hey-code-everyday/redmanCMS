<template>
  <div v-show="totalSearchResults" >
    <p class="num-results">
      Showing <strong>{{totalSearchResults}}</strong> results
      <span class="is-soft" v-show="totalSearchResults !== totalListingCount"><br>{{totalListingCount}} listings total</span>
    </p>
    <p class="num-results">Page <strong>{{thisPage}}</strong> of <strong>{{totalPages}}</strong></p>
  </div>
</template>

<script>

export default {
  name: 'numResults',

  computed: {
    totalSearchResults() {
      return this.$store.state.gus.totalSearchResults
    },
    totalListingCount() {
      return this.$store.state.gus.totalListingCount
    },
    thisPage() {
      return this.$store.state.gus.page + 1
    },
    totalPages() {
      return this.$store.getters.totalPages()
    }
  }
}

</script>

<style scoped lang="sass">

.num-results
  margin: 1em 0

</style>
