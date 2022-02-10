<template>
  <div :class="mapMode ? 'map-mode-toolbar_containner' : ''">
    <div :class="`columns is-multiline inner-toolbar ${mapMode ? 'map-mode-toolbar is-hidden-mobile' : ''}`">

      <div class="column is-one-third-desktop awesome-bar-wrapper gus-layer-sticky">
        <AwesomeBar />
      </div>

      <div class="column is-hidden-tablet-only">
        <div class="level is-mobile">

          <div class="level-left">
            <!-- show max to 1300 width -->
            <div class="level-item filters-wrapper show-over-width-1300">
              <div class="columns align-center">
                <Filters
                  v-on:setIdentifier="updateIdentifier($event)"
                  :identifier="name"
                  uniqueIdentifier="price"
                  filterTitle="Price"
                  :panelConfig="{include: ['budgetRange']}"
                  :showAdvanced="false"
                />
                <Filters
                  v-on:setIdentifier="updateIdentifier($event)"
                  :identifier="name"
                  uniqueIdentifier="beds"
                  filterTitle="Beds"
                  :panelConfig="{include: ['bedrooms']}"
                  :showAdvanced="false"
                />
                <Filters
                  v-on:setIdentifier="updateIdentifier($event)"
                  :identifier="name"
                  uniqueIdentifier="baths"
                  filterTitle="Baths"
                  :panelConfig="{include: ['bathrooms']}"
                  :showAdvanced="false"
                />
                <Filters
                  v-on:setIdentifier="updateIdentifier($event)"
                  :identifier="name"
                  uniqueIdentifier="property"
                  filterTitle="Property Types"
                  :panelConfig="{include: ['propertyTypes']}"
                  :showAdvanced="false"
                />
                <Filters
                  v-on:setIdentifier="updateIdentifier($event)"
                  :identifier="name"
                  uniqueIdentifier="additional-filters"
                  filterTitle="Additional Filters"
                  :panelConfig="{exclude: ['budgetRange', 'bedrooms', 'bathrooms', 'propertyTypes']}"
                  :showAdvanced="true"
                />
                <SaveSearch v-if="mapMode" :mapMode="mapMode" />
              </div>
            </div>
            <!-- show under 1300 width -->
            <div class="level-item filters-wrapper hide-under-width-1300">
              <Filters
                v-on:setIdentifier="updateIdentifier($event)"
                :identifier="name"
                uniqueIdentifier="all-filters"
                :showAdvanced="true"
              />
              <SaveSearch v-if="mapMode" :mapMode="mapMode" />
            </div>
          </div>

          <div class="level-right"  v-if="!mapMode">
            <div class="level-item sort-wrapper is-hidden-mobile">
              <Sort />
            </div>
            <div class="level-item open-map-wrapper" style="margin-right:0">
              <a href="#map" @click="openMap" class="button is-primary open-map" aria-label="Open Map">
                Map
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div class="save-search-wrapper gus-layer-sticky is-hidden-desktop">
      <div class="level is-mobile">

        <div class="level-left is-hidden-mobile">
          <div :class="`level-item filters-wrapper ${mapMode ? 'pl-75' : ''}`">
            <Filters
              v-on:setIdentifier="updateIdentifier($event)"
              :identifier="name"
              uniqueIdentifier="all-filters"
              :showAdvanced="true"
            />
          </div>
          <div class="level-item sort-wrapper is-hidden-mobile">
            <Sort v-if="!mapMode"/>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item sort-wrapper">
            <SaveSearch :mapMode="mapMode"/>
          </div>
          <div class="level-item open-map-wrapper is-hidden-mobile" style="margin-right:0" v-show="!mapMode">
            <a href="#map" @click="openMap" class="open-map var--gus-bg-primary" aria-label="Open Map">
              <i class="icon icon-map2"></i>
            </a>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import AwesomeBar from './AwesomeBar/index.vue'
import SaveSearch from '../SaveSearch'
import Filters from './Filters'
import NumResults from '../Sidebar/NumResults.vue'
import Sort from './Sort'

export default {
  name: 'toolbar',

  components: {
    AwesomeBar,
    SaveSearch,
    Filters,
    NumResults,
    Sort
  },
  props: {
    mapMode: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      name: ''
    }
  },
  methods: {
    openMap: function (e) {
      e.preventDefault()
      this.$emit('reqOpenMap')
    },
    updateIdentifier (newName) {
      this.name = newName
    }
  }
}
</script>

<style scoped lang="sass">
.inner-toolbar
  align-items: center

.sort-wrapper
  text-align: right

.save-search-wrapper
  position: fixed
  bottom: 0
  left: 0
  right: 0
  padding: 0
  @media (min-width: 769px)
    position: static

  &.is-hidden-desktop
    .save-search-wrapper
      margin: 0 !important

.filters-wrapper
  padding-top: 0
  text-align: left
  @media (min-width: 769px)
    margin-top: 0
    // padding-top: 1.25rem

.open-map-wrapper
  text-align: right

.align-center
  align-items: center

.map-mode-toolbar
  margin-left: 0 !important
  margin-right: 0 !important
  padding-left: 0

.map-mode-toolbar_containner
  @media (max-width: 1023px) and (min-width: 769px)
    margin: 0 0 1rem

.hide-under-width-1300
  display: none
  @media (max-width: 1290px)
    display: flex

.show-over-width-1300
  display: none
  @media (min-width: 1291px)
    display: flex

.pl-75
  padding-left: 0.75rem !important
</style>
