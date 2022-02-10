<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-tile tile strap-tile"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <div v-if='value.imageUrl' class='overlay has-bg-image' v-lazy:background-image="`${$editableComponent_interpolate(value.imageUrl)}`"></div>
    <div class='overlay is-overlay is-hover-overlay' :style="hoverOverlayStyles"></div>
    <div class='overlay is-overlay' :style="overlayStyles"></div>
    <div class='overlay is-content'>
      <div class='overlay-inner'>
        <h3 class='title is-4' :style="{ color: customColor && customColor + ' !important' }">{{ $editableComponent_interpolate(value.title) }}</h3>
        <p class='subtitle' :style="{ color: customColor && customColor + ' !important' }">{{ $editableComponent_interpolate(value.subtitle) }}</p>
      </div>
    </div>
    <a v-if='value.href' :href='$editableComponent_interpolate(value.href)' class='overlay is-link' :target='value.linkOut ? "_blank" : ""' @mouseover="mouseOver" @mouseout="mouseOut" ></a>
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableTile',

  mixins: [mixinEditableComponent],

  props: {
    customColor: {
      type: String,
      default: ''
    }
  },

  components: {
    EditableComponent
  },

  data () {
    return {
      error: false,
      isActive: false
    }
  },

  methods: {
    mouseOver: function(){
      this.isActive = !this.isActive;   
    },
    mouseOut: function(){
      this.isActive = !this.isActive;   
    }
  },

  computed: {
    overlayStyles () {
      const { useCustomOverlay, overlayColor, overlayOpacity } = this.value

      const bgColor = useCustomOverlay ? overlayColor + ' !important' : 'inherit'
      const opacity = useCustomOverlay ? (overlayOpacity / 100) + ' !important' : '0'

      const styles = {
        'background-color': bgColor,
        'opacity': opacity
      }

      return styles
    },

    hoverOverlayStyles () {
      const { useHoverOverlay, hoverOverlayColor, hoverOverlayOpacity, hoverFadeSpeed } = this.value

      const bgColor = hoverOverlayColor
      const opacity = useHoverOverlay && this.isActive ? (hoverOverlayOpacity / 100): '0'

      const styles = {
        'background-color': bgColor,
        'opacity': opacity,
        'transition': 'opacity ' + hoverFadeSpeed + 's ease-in-out',
      }

      return styles
    },

    schema () {
      return {
        title: 'Tile',
        canDelete: false,
        fields: [
          {
            key: 'imageUrl',
            type: 'image',
            label: 'Background Image URL',
            default: ''
          },
          {
            key: 'title',
            type: 'text',
            label: 'Title',
            default: ''
          },
          {
            key: 'subtitle',
            type: 'text',
            label: 'Text',
            default: ''
          },
          {
            key: 'href',
            type: 'text',
            label: 'Link URL',
            default: ''
          },
          {
            key: 'linkOut',
            type: 'checkbox',
            label: 'Link Out',
            text: 'Open link in a new tab.',
            default: false,
            onValue: true,
            offValue: false
          },
          {
            key: 'useCustomOverlay',
            type: 'checkbox',
            label: 'Custom Overlay',
            text: 'Use custom overlay',
            default: false,
            onValue: true,
            offValue: false
          },
          {
            key: 'overlayOpacity',
            type: 'number',
            label: 'Custom Transparency',
            default: 85,
            hint: 'Overlay transparency between 0 and 100 percent.',
            placeholder: '100',
            minValue: 0,
            maxValue: 100,
            step: 5
          },
          {
            key: 'overlayColor',
            type: 'color',
            label: 'Custom Color',
            default: '#000000',
            placeholder: '#000000'
          },
          {
            key: 'useHoverOverlay',
            type: 'checkbox',
            label: 'Hover Overlay',
            text: 'Use hover overlay',
            default: false,
            onValue: true,
            offValue: false
          },
          {
            key: 'hoverOverlayOpacity',
            type: 'number',
            label: 'Hover Transparency',
            default: 85,
            hint: 'Hover overlay transparency between 0 and 100 percent.',
            placeholder: '100',
            minValue: 0,
            maxValue: 100,
            step: 5
          },
          {
            key: 'hoverOverlayColor',
            type: 'color',
            label: 'Hover Color',
            default: '#000000',
            placeholder: '#000000'
          },
          {
            key: 'hoverFadeSpeed',
            type: 'number',
            label: 'Hover Fade Speed',
            default: 1,
            hint: 'Speed of hover fade in effect (in seconds)',
            placeholder: '1',
            minValue: 0.5,
            maxValue: 5,
            step: 0.5
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-tile
  position: relative

+with-palette
  .strap-tile
    .overlay-inner
      .title,
      .subtitle
        color: var(--#{$palette}-uiPrimary-text)
    .overlay.is-overlay
      opacity: var(--#{$palette}-overlayAlpha)
      background-color: var(--#{$palette}-uiPrimary-bgColor)


</style>
