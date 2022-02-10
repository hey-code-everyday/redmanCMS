<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-compare-tile tile strap-tile"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <div v-if='value.imageUrl' class='overlay has-bg-image' :style='{ "background-image": "url(" + $editableComponent_interpolate(value.imageUrl) + ")" }'></div>
    <div class='overlay is-overlay' :style="overlayStyles"></div>
    <div class='overlay is-content position-relative'>
      <div class='overlay-inner'>
        <h3 class='title is-4' :style="{ color: customColor && customColor + ' !important' }">{{ $editableComponent_interpolate(value.title) }}</h3>
        <p class='subtitle' :style="{ color: customColor && customColor + ' !important' }">{{ $editableComponent_interpolate(value.subtitle) }}</p>
        <ul>
          <li :style="{ color: customColor && customColor + ' !important' }">
            <span class='larger'>{{ $editableComponent_interpolate(value.text1) }}</span>
            <span>{{ $editableComponent_interpolate(value.tag1) }}</span>
          </li>
          <li :style="{ color: customColor && customColor + ' !important' }">
            <span class='larger'>{{ $editableComponent_interpolate(value.text2) }}</span>
            <span>{{ $editableComponent_interpolate(value.tag2) }}</span>
          </li>
          <li :style="{ color: customColor && customColor + ' !important' }">
            <span class='larger'>{{ $editableComponent_interpolate(value.text3) }}</span>
            <span>{{ $editableComponent_interpolate(value.tag3) }}</span>
          </li>
          <li :style="{ color: customColor && customColor + ' !important' }">
            <span class='larger'>{{ $editableComponent_interpolate(value.text4) }}</span>
            <span>{{ $editableComponent_interpolate(value.tag4) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </editable-component>
</template>

<script>
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'

export default {
  name: 'EditableCompareTile',

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
      error: false
    }
  },

  computed: {
    overlayStyles () {
      const { useCustomOverlay, overlayColor, overlayOpacity } = this.value

      const bgColor = useCustomOverlay ? overlayColor + ' !important' : 'inherit'
      const opacity = useCustomOverlay ? (overlayOpacity / 100) + ' !important' : 'inherit'

      const styles = {
        'background-color': bgColor,
        'opacity': opacity
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
            label: 'Subtitle',
            default: ''
          },
          {
            key: 'text1',
            type: 'text',
            label: 'Text 1',
            default: ''
          },
          {
            key: 'tag1',
            type: 'text',
            label: 'Tag 1',
            default: ''
          },
          {
            key: 'text2',
            type: 'text',
            label: 'Text 2',
            default: ''
          },
          {
            key: 'tag2',
            type: 'text',
            label: 'Tag 2',
            default: ''
          },
          {
            key: 'text3',
            type: 'text',
            label: 'Text 3',
            default: ''
          },
          {
            key: 'tag3',
            type: 'text',
            label: 'Tag 3',
            default: ''
          },
          {
            key: 'text4',
            type: 'text',
            label: 'Text 4',
            default: ''
          },
          {
            key: 'tag4',
            type: 'text',
            label: 'Tag 4',
            default: ''
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
          }
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-compare-tile
  position: relative

+with-palette
  .strap-tile
  
    .overlay.position-relative
      position: relative
  
    .overlay-inner
      .title,
      .subtitle,
      li
        color: var(--#{$palette}-uiPrimary-text)
      ul
        display: flex
        flex-wrap: wrap
        justify-content: center
        
        li
          width: 50%
          padding: 0.5rem
        
        span
          display: block
          line-height: 1
          
          &.larger
            font-size: 3em
        
    .overlay.is-overlay
      opacity: var(--#{$palette}-overlayAlpha)
      background-color: var(--#{$palette}-uiPrimary-bgColor)
</style>
