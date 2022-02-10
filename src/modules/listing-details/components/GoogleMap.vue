<template>
  <div class="static-map">
    <gmap-map
    :center="center"
    :options="options"
    :zoom="zoom"
    style="width: 100%; height: 100%">
      <gmap-marker
      :position="center"
      :icon="markerIcon"
      :label="markerLabel">
      </gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

import constants from 'listing-details@/config/constants'

const mapStyles = constants.config.styles.map
const googleMaps = constants.config.api.googleMaps

Vue.use(VueGoogleMaps, {
  load: {
    key: googleMaps.key
  }
})

export default {
  props: {
    center: {
      type: Object,
      required: true
    }
  },

  data () {
    const isDark = this.$store.state.website.theme.dark
    const theme = isDark ? 'dark' : 'light'

    return {
      options: {
        clickableIcons: false,
        disableDefaultUI: false,
        disableDoubleClickZoom: true,
        draggable: true,
        styles: theme === 'light' ? mapStyles.light : mapStyles.dark
      },
      shapePath: 'M24.0000008,55.2928384 L31.7905282,47.5011027 L31.9976577,47.5011027 L44.0177273,47.5016455 C45.1583184,47.5548353 46.0203332,47.2674481 46.6399737,46.6477019 C47.2596335,46.0279365 47.5469902,45.1657195 47.4932643,44.0015927 L47.4937183,4.02754973 C47.4391885,2.74874958 47.1446091,1.86486068 46.6399737,1.36013925 C46.1353556,0.855435154 45.2516648,0.560821341 43.9944359,0.506738504 L3.98227107,0.506195565 C2.84168944,0.452998756 1.97967613,0.740385496 1.36002798,1.36013925 C0.740360588,1.97991225 0.45300435,2.84212788 0.506737355,4.00624843 L0.506283404,43.9802914 C0.560813121,45.2590916 0.85539255,46.1429805 1.36002798,46.6477019 C1.86464607,47.152406 2.74833691,47.4470198 4.00556579,47.5011027 L16.2094735,47.5011027 L24.0000008,55.2928384 Z',
      zoom: 15
    }
  },

  methods: {
    icon (name) {
      switch (name) {
        case 'res-house': return ''
        case 'res-condo': return ''
        case 'commercial': return ''
        case 'industrial': return ''
        case 'rural': return ''
      }
      return ''
    }
  },

  computed: {
    markerIcon () {
      const { shapePath } = this.$data
      const colorPrimary = this.$store.getters.palette('default').uiPrimary.bgColor

      return {
        path: shapePath,
        fillColor: colorPrimary,
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 1,
        labelOrigin: { x: 24, y: 24 },
        anchor: { x: 24, y: 50 }
      }
    },

    markerLabel () {
      const colorText = this.$store.getters.palette('default').uiPrimary.text

      return {
        text: this.icon('res-house'),
        fontSize: '24px',
        fontFamily: 'Linearicons',
        color: colorText
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.static-map
  position: relative
  width: 100%
  height: 100%
  background-size: cover
  background-position: 50% 50%
  background-repeat: no-repeat

  iframe
    width: 100%
    height: 100%
    border: 0
</style>
