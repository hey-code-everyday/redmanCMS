<template>
  <div class="strap-mosaic">
    <div :style="tileStyle" :class="`tile is-ancestor has-${strap_state.numTiles}`">

      <template v-if="strap_state.numTiles === 2">
        <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile1" :value="strap_state.tile1" />
        <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile2" :value="strap_state.tile2" />
      </template>

      <template v-if="strap_state.numTiles === 3">
        <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile1" :value="strap_state.tile1" />
        <div class="tile is-vertical">
          <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile2" :value="strap_state.tile2" />
          <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile3" :value="strap_state.tile3" />
        </div>
      </template>

      <template v-if="strap_state.numTiles === 4">
        <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile1" :value="strap_state.tile1" />
        <div class="tile is-vertical">
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile2" :value="strap_state.tile2" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile3" :value="strap_state.tile3" />
          </div>
          <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile4" :value="strap_state.tile4" />
        </div>
      </template>

      <template v-if="strap_state.numTiles === 5">
        <div class="tile is-vertical">
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-8" @change="$strap_onComponentChange" keyName="tile1" :value="strap_state.tile1" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-4" @change="$strap_onComponentChange" keyName="tile2" :value="strap_state.tile2" />
          </div>
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile3" :value="strap_state.tile3" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile4" :value="strap_state.tile4" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child" @change="$strap_onComponentChange" keyName="tile5" :value="strap_state.tile5" />
          </div>
        </div>
      </template>

      <template v-if="strap_state.numTiles === 6">
        <div class="tile is-vertical">
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-6" @change="$strap_onComponentChange" keyName="tile1" :value="strap_state.tile1" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-3" @change="$strap_onComponentChange" keyName="tile2" :value="strap_state.tile2" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-3" @change="$strap_onComponentChange" keyName="tile3" :value="strap_state.tile3" />
          </div>
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-3" @change="$strap_onComponentChange" keyName="tile4" :value="strap_state.tile4" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-3" @change="$strap_onComponentChange" keyName="tile5" :value="strap_state.tile5" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-6" @change="$strap_onComponentChange" keyName="tile6" :value="strap_state.tile6" />
          </div>
        </div>
      </template>

      <template v-if="strap_state.numTiles === 7">
        <div class="tile is-vertical">
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-8" @change="$strap_onComponentChange" keyName="tile1" :value="strap_state.tile1" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-4" @change="$strap_onComponentChange" keyName="tile2" :value="strap_state.tile2" />
          </div>
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-4" @change="$strap_onComponentChange" keyName="tile3" :value="strap_state.tile3" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-4" @change="$strap_onComponentChange" keyName="tile4" :value="strap_state.tile4" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-4" @change="$strap_onComponentChange" keyName="tile5" :value="strap_state.tile5" />
          </div>
          <div class="tile">
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-4" @change="$strap_onComponentChange" keyName="tile6" :value="strap_state.tile6" />
            <editable-tile :style="tileStyle" :customColor="tileTextColor" class="is-child is-8" @change="$strap_onComponentChange" keyName="tile7" :value="strap_state.tile7" />
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableTile from '@/components/editable/EditableTile'

import defaultTile from '@/store/defaults/components/tile'
import defaultTextShadow from '@/store/defaults/components/textShadow'

export default {
  name: 'StrapMosaic',

  components: {
    EditableTile
  },

  mixins: [mixinStrap],

  computed: {
    tileTextColor () {
      const { useCustomTextColor, customTextColor } = this.strap_state
      return useCustomTextColor ? customTextColor : ''
    },

    tileStyle () {
      const { useTextShadow, textShadow, useBorder, customBorderColor, borderWidth } = this.strap_state
      const { x, y, blur, color } = textShadow

      let style = {}

      if (useTextShadow) {
        style['textShadow'] = useTextShadow && `${x}px ${y}px ${blur}px ${color}`
      }

      if (useBorder) {
        style['border'] = `${borderWidth}px ${customBorderColor} solid`
      }

      if (style) return style
      return {}
    }
  },

  initialState (strap, state) {
    return {
      numTiles: 2,
      tile1: defaultTile(),
      tile2: defaultTile(),
      tile3: defaultTile(),
      tile4: defaultTile(),
      tile5: defaultTile(),
      tile6: defaultTile(),
      tile7: defaultTile(),
      useTextShadow: false,
      textShadow: defaultTextShadow(),
      useCustomTextColor: false,
      customTextColor: '#ffffff',
      useBorder: false,
      customBorderColor: '#ffffff',
      borderWidth: 5
    }
  },

  schema () {
    return [
      {
        title: 'Mosaic',
        tabs: [
          {
            title: 'Layout',
            fields: [
              {
                key: 'state.numTiles',
                type: 'number',
                label: 'Number of Tiles',
                default: 2,
                hint: 'Number of mosaic tiles to display. Between 2 and 7.',
                minValue: 2,
                maxValue: 7,
                step: 1
              }
            ]
          },
          {
            title: 'Text',
            fields: [
              {
                key: 'state.useTextShadow',
                type: 'checkbox',
                label: 'Text Shadow',
                text: 'Apply a drop shadow to the text',
                default: false,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.textShadow.x',
                type: 'number',
                label: 'Text Shadow Position (x, y, blur)',
                default: 0,
                hint: 'Left/right position of the shadow.',
                minValue: 0,
                maxValue: 100,
                step: 1
              },
              {
                key: 'state.textShadow.y',
                type: 'number',
                default: 0,
                hint: 'Top/bottom position of the shadow.',
                minValue: 0,
                maxValue: 100,
                step: 1
              },
              {
                key: 'state.textShadow.blur',
                type: 'number',
                default: 0,
                hint: 'The softness of the shadow.',
                minValue: 0,
                maxValue: 100,
                step: 1
              },
              {
                key: 'state.textShadow.color',
                type: 'color',
                label: 'Text Shadow Color',
                default: '#000000'
              },
              {
                type: 'hr'
              },
              {
                key: 'state.useCustomTextColor',
                type: 'checkbox',
                label: 'Custom Text Color',
                text: 'Use a custom color for text',
                default: false,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.customTextColor',
                type: 'color',
                label: 'Custom Text Color',
                default: '#ffffff'
              }
            ]
          },
          {
            title: 'Border',
            fields: [
              {
                key: 'state.useBorder',
                type: 'checkbox',
                label: 'Custom borderr',
                text: 'Use a custom color for a border',
                default: false,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.customBorderColor',
                type: 'color',
                label: 'Border Shadow Color',
                default: '#000000'
              },
              {
                key: 'state.borderWidth',
                type: 'number',
                default: 5,
                hint: 'The width of the border.',
                minValue: 0,
                maxValue: 20,
                step: 1
              },
            ]
          }
        ]
      }
    ]
  },

  migrations (strap, state) {
    return [
      {
        useTextShadow: false,
        textShadow: defaultTextShadow(),
        useCustomTextColor: false,
        customTextColor: '#ffffff', // Issue #34
        useBorder: false, 
        customBorderColor: '#ffffff',
        borderWidth: 5
      },
      {
        tile1: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        },
        tile2: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        },
        tile3: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        },
        tile4: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        },
        tile5: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        },
        tile6: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        },
        tile7: {
          useHoverOverlay: false,
          hoverOverlayOpacity: 85,
          hoverOverlayColor: '#ffffff',
          hoverFadeSpeed: 1 //Issue #239
        }
      }
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-mosaic

.tile.is-vertical>.tile.is-child:not(:last-child)
  margin-bottom: 0 !important
.tile
  position: relative
  min-height: 20vw
  &.is-child
    margin-bottom: 0px
  
.has-border
  border: 5px solid black

.tile.is-ancestor
  margin: 0px

+mobile
  .tile
    min-height: 150px
+fullhd
  .tile
    min-height: 300px
</style>
