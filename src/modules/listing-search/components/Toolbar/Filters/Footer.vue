<template>
  <footer class="filters-panel-footer">
    <p>
      <a href="#filters-panel" @click="toggleAdvanced">
        Use {{isAdvanced ? 'Basic' : 'Advanced'}} Search
      </a>
    </p>
    <p v-if="isAdvanced">
      <small>
        <a href="#filters-panel" @click="clearAll">
          Clear all
        </a>
      </small>
    </p>
  </footer>
</template>

<script>
export default {
  name: 'filtersPanelFooter',

  props: ['isAdvanced'],

  methods: {
    clearAll: function (e) {
      this.$store.commit('unsetFilters')
      this.$store.dispatch('submit')
    },

    toggleAdvanced: function (e) {
      e.preventDefault()
      this.$emit('toggleAdvanced')
    }
  }
}
</script>

<style scoped lang="sass">

.filters-panel-footer
  column-span: all
  text-align: center
  padding: 0 1.5rem
  p
    margin: 1.5rem 0

</style>
