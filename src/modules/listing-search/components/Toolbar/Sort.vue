<template>

<div class="sort-wrapper">
  <label>
    <strong>Sort By</strong>
    <select class="sort" @change="onChange" :value="value">
      <option value="list_date_des">Most Recent</option>
      <option value="list_date_asc">Longest Listed</option>
      <option value="price_asc">Lowest Price</option>
      <option value="price_des">Highest Price</option>
      <option value="geo_centre" :disabled="!isNearestEnabled">Nearest</option>
    </select>
    <i class="icon icon-chevron-down is-hidden-mobile"></i>
  </label>
</div>

</template>

<script>
export default {
  name: 'sort',

  computed: {
    value: function () {
      return this.$store.state.gus.sort
    },
    isNearestEnabled: function () {
      const {geo} = this.$store.state.gus
      return geo && geo.centre_lat && geo.centre_lon
    }
  },

  methods: {
    onChange: function (e) {
      this.$store.commit('setSort', e.target.value)
      this.$store.dispatch('submit')
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../../../assets/sass/variables'

.sort-wrapper
  position: relative
  .icon
    position: absolute
    right: 0
    top: 0
    font-size: 0.8rem
    pointer-events: none
  +mobile
    margin: 10px

.sort
  appearance: none
  border: none
  padding: 0 22px 0 0.3rem
  font-size: inherit
  cursor: pointer
  background: transparent
  color: inherit

</style>
