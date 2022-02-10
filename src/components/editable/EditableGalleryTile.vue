<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-gallery-tile tile strap-tile column"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <div v-if='value.useSoldLabel' class='overlay has-sold-label' :style='{ "background-image": "url(" + $editableComponent_interpolate(value.soldLabelURL) + ")" }'></div>
    <div v-if='value.imageUrl' class='overlay has-bg-image' :style='{ "background-image": "url(" + $editableComponent_interpolate(value.imageUrl) + ")" }'></div>
    <div class='overlay is-overlay' :style="overlayStyles"></div>
    <div class='overlay is-content' @click="openModal">
      <div class='overlay-inner'>
        <h3 class='title' :style="{ color: value.textColor && value.textColor + ' !important' }">{{ $editableComponent_interpolate(value.title) }}</h3>
        <div class='subtitle' :style="{ color: value.textColor && value.textColor + ' !important' }">{{ $editableComponent_interpolate(value.subtitle) }}</div>
        <div v-if="value.subtext" class="subtitle subtext" :style="{ color: textColor && textColor + ' !important' }">
          {{ $editableComponent_interpolate(value.subtext) }}
        </div>
      </div>
    </div>
    <a v-if='value.useLinkout && value.href' :href='$editableComponent_interpolate(value.href)' class='overlay is-link' :target='value.externalLinkOut ? "_blank" : ""'></a>
  </editable-component>
</template>

<script>
import CustomModalGallery from '@/components/ui/modals/custom/CustomModalGallery'
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultQuill from '@/store/defaults/components/quill'

export default {
  name: 'EditableGalleryTile',

  mixins: [mixinEditableComponent],

  props: {
    textColor: {
      type: String,
      default: '#ffffff'
    }
  },

  components: {
    EditableComponent,
    EditableQuill
  },

  data () {
    return {
      error: false
    }
  },

  methods: {
    openModal () {
      if (!this.value.useLinkout) {
        this.$store.commit('SHOW_CUSTOM_MODAL', {
          state: {
            keyName: this.$props.keyName,
            value: this.$props.value,
            onChange: this.$editableComponent_change.bind(this)
          },
          component: CustomModalGallery,
          settings: {
            width: '600px',
            height: 'auto',
            padded: true,
            palette: this.$store.state.website.theme.straps.default
          }
        })
      }
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
            label: 'Image URL',
            default: ''
          },
          {
            key: 'title',
            type: 'text',
            label: 'Name',
            default: ''
          },
          {
            key: 'subtitle',
            type: 'text',
            label: 'Title',
            default: ''
          },
          {
            key: 'subtext',
            type: 'text',
            label: 'Subtext',
            default: ''
          },
          {
            key: 'useSoldLabel',
            type: 'checkbox',
            label: 'Sold Label',
            text: 'Use Sold Label',
            default: false,
            onValue: true,
            offValue: false
          },
          {
           type: 'hr'
          },
          {
            key: 'useLinkout',
            type: 'checkbox',
            label: 'Link to another page instead of a modal',
            text: 'Link URL',
            default: false,
            onValue: true,
            offValue: false
          },
          {
            key: 'externalLinkOut',
            type: 'checkbox',
            label: 'Link Out',
            text: 'Open this link in a new tab.',
            default: false,
            onValue: true,
            offValue: false
          },
          {
            key: 'href',
            type: 'text',
            label: 'Link URL',
            default: ''
          },
          {
           type: 'hr'
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
           type: 'hr'
          },
          {
            key: 'textModalColor',
            type: 'color',
            label: 'Modal Text Color',
            default: '#000000'
          }
        ]
      }
    }
  },
  
  migrations (strap, state) {
    return [
      {
        useLinkout: false,
        externalLinkOut: false,
        href: '#'
      }
    ]
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-gallery-tile
  border-left: 1px solid
  border-right: 1px solid
  border-bottom: 2px solid
  border-color: var(--#{$palette}-uiPrimary-text)
  height: 340px
  padding: 0
  position: relative
  flex: 1 1 100%
  
  +desktop
    flex: 1 1 33.3333%
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  
  &:hover
    cursor: pointer
    
  .subtitle
    color: var(--#{$palette}-uiPrimary-text)
    font-weight: bold
  
  +desktop
    overflow: hidden
    
  .has-sold-label
    background-position: left center
    background-repeat: no-repeat
    background-size: 100px auto
    height: 100px
    left: 0
    position: absolute
    top: 0
    width: 110px
    z-index: 2

  .has-bg-image
    +desktop
      background-position: center center

    +touch
      background-size: cover
      background-position: center center
      max-height: 340px
      
  .overlay.is-content
    background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)
    background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 52%,rgba(0,0,0,0.5) 100%)
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 52%,rgba(0,0,0,0.5) 100%)

  .overlay-inner
    position: absolute
    left: 0
    bottom: 0
    text-align: left
    width: 100%
    line-height: 50%
    
    +desktop
      margin: 0 0 10px 15px

    .title
      margin: 0

    .subtitle, .subtext
      +touch
        margin: 0

      +desktop
        position: relative
        padding: 0

    .subtitle
      +desktop
        margin: 10px 0 5px 0

    .subtext
      +desktop
        margin: 0

</style>
