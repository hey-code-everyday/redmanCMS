<template>
  <div class='strap-compare-block'>

    <div class='strap-container pad-header'>
      <header class='strap-header content'>
        <editable-title @change='$strap_onComponentChange' keyName='title' :value='strap_state.title' />
      </header>
    
      <div class='strap-content content'>
        <div class='strap-content__inner'>
          <editable-quill @change='$strap_onComponentChange' keyName='text' :value='strap_state.text' />
        </div>
      </div>
    </div>
          
    <div class='tile is-ancestor has-2'>
      <editable-compare-tile :style='tileStyle' :customColor='tileTextColor' class='is-child' @change='$strap_onComponentChange' keyName='tile1' :value='strap_state.tile1' />
      <editable-compare-tile :style='tileStyle' :customColor='tileTextColor' class='is-child' @change='$strap_onComponentChange' keyName='tile2' :value='strap_state.tile2' />
    </div>

    <div class='strap-container'>
      <footer class='strap-footer content pad-footer'>
        <editable-button-list
          tag='div'
          listKey='buttonList'
          :list='strap_state.buttonList'
          :onCreate='$strap_onListCreate'
          :onChange='$strap_onListChange'
          :onDelete='$strap_onListDelete'
        />
      </footer>
    </div>

  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableCompareTile from '@/components/editable/EditableCompareTile'
import EditableButtonList from '@/components/editable/EditableButtonList'

import defaultCompareTile from '@/store/defaults/components/compareTile'
import defaultTextShadow from '@/store/defaults/components/textShadow'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapCompareBlock',

  components: {
    EditableTitle,
    EditableQuill,
    EditableCompareTile,
    EditableButtonList
  },

  mixins: [mixinStrap],

  computed: {
    tileTextColor () {
      const { useCustomTextColor, customTextColor } = this.strap_state
      return useCustomTextColor ? customTextColor : ''
    },

    tileStyle () {
      const { useTextShadow, textShadow } = this.strap_state
      const { x, y, blur, color } = textShadow

      if (useTextShadow) {
        return {
          textShadow: useTextShadow && `${x}px ${y}px ${blur}px ${color}`
        }
      } else {
        return {}
      }
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Compare Block' }),
      text: defaultQuill(),
      tile1: defaultCompareTile(),
      tile2: defaultCompareTile(),
      useTextShadow: false,
      textShadow: defaultTextShadow(),
      useCustomTextColor: false,
      customTextColor: '#ffffff',
      buttonList: [defaultButton()]
    }
  },

  schema () {
    return [
      {
        title: 'Compare Block',
        tabs: [
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
        customTextColor: '#ffffff'
      } // Issue #34
    ]
  }
}
</script>

<style scoped lang='sass'>
@import '../../assets/sass/variables'

.strap-compare-block

  .pad-header
    padding-top: 6.25rem
    padding-bottom: 2.25rem
    
    +mobile
      padding-top: 2.25rem

  .pad-footer
    padding-bottom: 6.25rem
    
    +mobile
      padding-bottom: 2.25rem

.tile.is-vertical>.tile.is-child:not(:last-child)
  margin-bottom: 0 !important
.tile
  position: relative
  min-height: 20vw
  &.is-child
    margin-bottom: 0 !important

+mobile
  .tile
    min-height: 150px
+fullhd
  .tile
    min-height: 300px
</style>
