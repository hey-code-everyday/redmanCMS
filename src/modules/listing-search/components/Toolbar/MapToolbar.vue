<template>
  <div class="map-toolbar layer-fg">
    <div class="columns">

      <div class="column is-half-tablet awesome-bar-wrapper">
        <AwesomeBar class="map-toolbar__awesome-bar" />
      </div>

      <div class="column filters-wrapper">
        <div class="close-map-wrapper">
          <a href="#" class="delete close-map var--gus-bg-primary" @click="closeMap">
          </a>
        </div>
        <Filters
          map="true"
          v-on:setIdentifier="updateIdentifier($event)"
          :identifier="name"
          uniqueIdentifier="one"
          :showAdvanced="true"
        />
      </div>

    </div>
  </div>
</template>

<script>
import AwesomeBar from './AwesomeBar/index.vue'
import Filters from './Filters'

export default {
  name: 'mapDefault',

  components: {
    AwesomeBar,
    Filters
  },
  data () {
    return {
      name: ''
    }
  },

  methods: {
    closeMap (e) {
      e.preventDefault()
      this.$emit('reqCloseMap')
    },
    updateIdentifier (newName) {
      this.name = newName
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.map-toolbar
  position: absolute
  top: 2rem
  left: 2rem
  right: 2rem

.awesome-bar-wrapper
  @media (min-width: 769px)
    padding-right: 0

  /deep/
    .awesome-bar
      background: #fff
      border-radius: 3px

.filters-wrapper
  padding-top: 0
  @media (min-width: 769px)
    padding-top: 0.75rem
    padding-left: 0

.close-map-wrapper
   float: right

.close-map
  display: inline-block
  font-size: 1.5rem
  min-width: 46px
  min-height: 46px
  text-align: center
  line-height: 46px
  i
    color: white

$mapBoxShadow: 0 2px 7px rgba(#000, 0.15)

.map-toolbar__awesome-bar
  background: #fff
  box-shadow: $mapBoxShadow

.close-map
  box-shadow: $mapBoxShadow

.map-toolbar__filters
  /deep/
    .filters-panel--map__toggle
      box-shadow: $mapBoxShadow
</style>
