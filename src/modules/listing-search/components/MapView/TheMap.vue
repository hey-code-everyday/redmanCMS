<template>
  <div class="map-containner">
    <div :class="`mobile-toolbar-map-mode ${$store.getters.canEdit ? 'top-115' : 'top-65'}`" v-show="mapMode && mapView">
      <div v-if="hasPolygon" class="button is-primary" @click="clear">Clear Drawing</div>
      <div v-else class="button is-primary" @click="toggleDrawing">Draw on Map</div>
      <div class="button is-primary" @click="recenter">Recenter Map</div>
      <div class="delete" @click="closeMap"></div>
    </div>
    <div ref="the-map" class="the-map"></div>
    <div v-if="loading && mapMode" class="loading-wrapper">
      <div class="loading gus-loading"></div>
    </div>
  </div>
</template>

<script>
import ReactiveGoogleMap from './ReactiveGoogleMap'
import {mapState} from '../../store/map'
import { listingDetailsHref } from '../../helpers/formatting'

export default {
  name: 'theMap',

  props: {
    mapMode: {
      type: Boolean,
      default: () => false
    },
    hoverSearchItem: {
      type: [Object, Boolean],
      default: () => false
    }
  },

  data: () => ({
    googleMap: null,
    mapInfoWindow: null,
  }),

  computed: {
    mapState: function () {
      return this.$store.getters.mapState
    },

    mapView () {
      return this.$store.state.gus.anchor === 'map'
    },
    
    hasPolygon () {
      return this.$store.state.gus.geo && this.$store.state.gus.geo.geometry
    },

    storestate () {
      return this.$store.state
    },

    loading () {
      return this.$store.state.gus.map.markersLoadState === 1 ||
        this.$store.state.gus.map.positionLoadState === 1
    },
  },

  watch: {
    hoverSearchItem() {
      if (!this.mapMode || !this.googleMap) return
      this.closeInfoWindow()
      this.openInfoWindow(this.hoverSearchItem)
    }
  },

  mounted: function () {
    ReactiveGoogleMap('AIzaSyAPmxzrNGkf_2tdVBSfyJZmjF-ZZUP1J14', this.$refs['the-map'], this.mapState).then(map => {
      this.googleMap = map.refs.map
      map.dispatch(this.mapState)
      this.$store.subscribe((mutation, state) => {
        map.dispatch(mapState(state, this.$store.state.website.theme.straps))
      })

      map.subscribe(async (type, payload, state) => {
        switch (type) {
          case '@@RGM/BOUNDS_CHANGED': {
            this.$store.commit('setMapPosition', {position: 'manual'})
            this.$store.dispatch('requestMapMarkers', payload)
            return
          }

          case '@@RGM/MARKER_CLICK': {
            const isMlsResult = payload.title.split('-').length < 2
            const zoom = map.refs.map.getZoom()
            const nextZoom = this.$store.getters.nextZoom(zoom)
            if (isMlsResult) {
              const fetchResult = await this.$store.dispatch('fetchProperties', payload.title)
              if (this.mapMode && fetchResult) {
                if (fetchResult[0]) {
                  this.closeInfoWindow()
                  this.openInfoWindow(fetchResult[0])
                }
              } else {
                this.$store.commit('openMarker', payload.title)
              }
            } else {
              this.$store.commit('setMapPosition', {
                position: 'center',
                centerLat: payload.lat,
                centerLng: payload.lng,
                zoom: nextZoom
              })
            }
            return
          }

          case '@@RGM/POLYGON_COMPLETE': {
            this.$store.dispatch('customPolygon', payload.coords)
            return
          }

          case '@@RGM/MARKER_MOUSEOVER': {
            const isMlsResult = payload.title.split('-').length < 2
            if (isMlsResult) {
              const fetchResult = await this.$store.dispatch('fetchProperties', payload.title)
              if (this.mapMode && fetchResult) {
                if (fetchResult[0]) {
                  this.closeInfoWindow()
                  this.openInfoWindow(fetchResult[0])
                }
              }
            }
            return
          }

          case '@@RGM/MARKER_MOUSEOUT': {
            this.closeInfoWindow()
            return
          }
        }
      })
    }).catch(e => {
      alert('Failed to load Google map')
      this.$emit('reqCloseMap')
    })
  },

  methods: {
    openInfoWindow: function (searchResult) {
      if (!searchResult) return
      if (!searchResult['_source']) return
      if (!searchResult._source.location) return

      this.mapInfoWindow = new google.maps.InfoWindow({
        content: this.getInfoWindowContent(searchResult._source, searchResult._id),
        position: {
          lat: searchResult._source.location.lat,
          lng: searchResult._source.location.lon
        },
      })
      this.mapInfoWindow.open(this.googleMap)
    },

    getInfoWindowContent: function (searchResult, id) {
      const href = listingDetailsHref(this.$store.state.config.gus.listingDetailsHref, id, searchResult.address)
      const imageURL = this.getItemImage(searchResult)
      const content = `
          <a href='${href}' class='map-infowindow__containner'>
            ${imageURL ? `<img src='${imageURL}' alt='infoWindowImage' />` : '' }
            <div>
              ${searchResult.price ? `<h4>${this.getItemPrice(searchResult.price)}</h4>` : ''}
              <h5>
                ${searchResult.bedrooms ? `${searchResult.bedrooms} bed, ` : ''}
                ${searchResult.bathrooms ? `${searchResult.bathrooms} bath` : ''}
              </h5>
              ${searchResult.area ? `<h5>${searchResult.area.toFixed()} sqft</h5>` : ''}
            </div>
          </a>
        `
      return content
    },

    getItemImage: function (searchResult) {
      if (searchResult.images) {
        return searchResult.images.length > 0 ? searchResult.images[0] : false
      } else {
        return false
      }
    },

    getItemPrice: function (value, sep = ',') {
      if (!value) return ''

      if (value <= 1000) {
        return '$' + value + '/sqft'
      } else {
        return '$' + value.toString().split('').reverse().join('').match(/([\w\d]{1,3})/g).join(sep).split('').reverse().join('')
      }
    },

    closeInfoWindow: function () {
      if (this.mapInfoWindow) this.mapInfoWindow.close()
    },

    clear () {
      this.$store.commit('clearGeo')
      this.$store.dispatch('submit')
      this.$store.dispatch('requestMapPosition')
    },

    toggleDrawing () {
      if (this.drawMode) {
        this.$store.commit('endDrawing')
      } else {
        this.$store.commit('beginDrawing')
      }
    },

    recenter () {
      this.closeInfoWindow()
      this.$store.commit('recenterMap')
    },

    closeMap () {
      this.$store.commit('setAnchor', null)
      this.$store.commit('endDrawing')
    },
  },
}
</script>

<style scoped lang="sass">

.the-map
  height: 100%
.map-containner
  width: 100%
  height: 100%
  position: relative
.mobile-toolbar-map-mode
  position: absolute
  width: 100vw
  display: flex
  top: 60px
  align-items: center
  justify-content: space-around
  z-index: 2
  .button
    margin-left: 1rem
  .delete
    margin: auto 1rem auto auto
.top-115
  top: 115px
.top-65
  top: 65px
.loading-wrapper
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  text-align: center
  pointer-events: none
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  font-size: 5rem
  opacity: 0.5
</style>
