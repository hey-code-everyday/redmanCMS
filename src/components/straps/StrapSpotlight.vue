<template>
  <div class="strap-spotlight">
    <div class="columns">
      <div class="column is-7">
        <div class="pad-big">
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
          </header>
          <div class='strap-content content'>
            <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
            <br />
            <editable-button-list
              tag="div"
              listKey="buttonList"
              :list="strap_state.buttonList"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </div>
        </div>
      </div>
      <div class="column is-5 is-aside">
        <div class="strap-spotlight__aside-overlay" :style="asideOverlayStyles"></div>
        <div class="pad-medium strap-spotlight__aside-content">
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="asideTitle" :value="strap_state.asideTitle" />
          </header>
          <div class='strap-content content'>
            <editable-quill @change="$strap_onComponentChange" keyName="asideText" :value="strap_state.asideText" />
            <br />
            <editable-link-list
              tag="div"
              isTags="true"
              listKey="asideLinkList"
              :list="strap_state.asideLinkList"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clone } from '@/util'
import mixinStrap from '@/mixins/strap'

import EditableLinkList from '@/components/editable/EditableLinkList'
import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultLink from '@/store/defaults/components/link'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapSpotlight',

  components: {
    EditableLinkList,
    EditableButtonList,

    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  computed: {
    asideOverlayStyles () {
      const { strap_style, strap_palette } = this

      let opacity = strap_palette.overlayAlpha
      let backgroundColor = strap_palette.bgColor
      let backgroundImage = 'none'

      // Custom solid
      if (strap_style.overlayStyle === 'solid-custom') {
        opacity = strap_style.overlayAlpha / 100
        backgroundColor = strap_style.overlayColor
      // Gradient
      } else if (strap_style.overlayStyle === 'gradient') {
        backgroundColor = 'transparent'
        backgroundImage = this.makeGradient({
          angle: strap_palette.overlayAngle,
          colors: [
            { color: strap_palette.uiPrimary.bgColor, pos: 0 },
            { color: strap_palette.uiSecondary.bgColor, pos: 1 }
          ]
        })
      // Custom gradient
      } else if (strap_style.overlayStyle === 'gradient') {
        backgroundColor = 'transparent'
        opacity = strap_style.overlayAlpha / 100
        const gradient = clone(strap_style.overlayGradient)
        gradient.colors.sort((a, b) => a.pos > b.pos)
        backgroundImage = this.makeGradient(gradient)
      }

      return {
        opacity,
        backgroundColor,
        backgroundImage
      }
    }
  },

  methods: {
    makeGradient (gradient) {
      const colorStops = gradient.colors.map(stop => `${stop.color} ${stop.pos * 100}%`)
      return `linear-gradient(${gradient.angle}deg, ${colorStops.join(', ')})`
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Spotlight' }),
      text: defaultQuill(),
      buttonList: [defaultButton()],
      asideTitle: defaultTitle({ html: 'Spotlight Aside', size: 3 }),
      asideText: defaultQuill(),
      asideLinkList: [defaultLink({ type: 'tag' })]
    }
  }
}
</script>

<style scoped lang="sass">
.strap-spotlight

.columns
  margin: 0

.column
  display: flex
  align-items: center
  justify-content: center
  padding: 0

  &.is-aside
    position: relative

.strap-spotlight__aside-overlay
  position: absolute
  z-index: 0
  top: 0
  left: 0
  width: 100%
  height: 100%

.strap-spotlight__aside-content
  position: relative
  z-index: 1
</style>
