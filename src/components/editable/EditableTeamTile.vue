<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-team-tile tile strap-tile column is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <div v-if='value.imageUrl' class='overlay has-bg-image' :style='{ "background-image": "url(" + $editableComponent_interpolate(value.imageUrl) + ")" }'></div>
    <div class='overlay is-overlay' :style="overlayStyles"></div>
    <div class='overlay is-content' @click="openModal">
      <div class='overlay-inner'>
        <h3 class='title' :style="{ color: value.textColor && value.textColor + ' !important' }">{{ $editableComponent_interpolate(value.title) }}</h3>
        <div class='subtitle' :style="{ color: value.textColor && value.textColor + ' !important' }">{{ $editableComponent_interpolate(value.subtitle) }}</div>
        <div v-if="value.subtext" class="subtitle subtext" :style="{ color: textColor && textColor + ' !important' }">
          {{ $editableComponent_interpolate(value.subtext) }}
        </div>
        <div v-if="value.subtextImage" class="subtext subtextImage" :style='{ "background-image": "url(" + $editableComponent_interpolate(value.subtextImage) + ")" }'>
        </div>
      </div>
    </div>
    <a v-if='value.useLinkout && value.href' :href='$editableComponent_interpolate(value.href)' class='overlay is-link' :target='value.externalLinkOut ? "_blank" : ""'></a>
  </editable-component>
</template>

<script>
import CustomModalTeamRoster from '@/components/ui/modals/custom/CustomModalTeamRoster'
import mixinEditableComponent from '@/mixins/editable-component'
import EditableComponent from '@/components/EditableComponent'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultQuill from '@/store/defaults/components/quill'

export default {
  name: 'EditableTeamTile',

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
          component: CustomModalTeamRoster,
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
            key: 'subtextImage',
            type: 'text',
            label: 'Subtext Image URL',
            default: ''
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
            default: '#ffffff'
          },
          {
            key: 'useDropShadow',
            type: 'checkbox',
            label: 'Drop Shadow',
            text: 'Use drop shadow on modal',
            default: false,
            onValue: true,
            offValue: false
          },
          {
            key: 'textShadowX',
            type: 'number',
            label: 'Text Shadow Position (x, y, blur)',
            default: 0,
            hint: 'Left/right position of the shadow.',
            minValue: 0,
            maxValue: 100,
            step: 1
          },
          {
            key: 'textShadowY',
            type: 'number',
            default: 0,
            hint: 'Top/bottom position of the shadow.',
            minValue: 0,
            maxValue: 100,
            step: 1
          },
          {
            key: 'textShadowBlur',
            type: 'number',
            default: 0,
            hint: 'The softness of the shadow.',
            minValue: 0,
            maxValue: 100,
            step: 1
          },
          {
            key: 'textShadowColor',
            type: 'color',
            label: 'Text Shadow Color',
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

.editable-team-tile
  height: 450px
  position: relative
  +desktop
    transition: transform 250ms ease-in-out!important
    overflow: hidden

  .has-bg-image
    +desktop
      background-position: center top

    +touch
      background-size: cover
      background-position: center top
      max-height: 450px

  .overlay-inner
    position: absolute
    left: 0
    bottom: 0
    text-align: left
    margin: 0 0 10px 15px
    width: 100%
    line-height: 50%

    +desktop
      transition: transform 250ms ease-in-out!important

    .title
      margin: 0

      +desktop
        position: absolute
        transform: translateY(-5px)
        transition: transform 250ms ease-in-out

    .subtitle, .subtext, .subtextImage
      +touch
        margin: 0

      +desktop
        position: relative
        padding: 0
        visibility: hidden
        transform: translateY(95px)

    .subtextImage
      height: 30px;
      background-size: contain
      background-repeat: no-repeat
      background-position: left center

    .subtitle
      +desktop
        margin: 10px 0 5px 0
        transition: transform 350ms ease-in-out, visibility 350ms ease-in-out!important

    .subtext, .subtextImage
      +desktop
        margin: 0
        transition: transform 350ms ease-in-out, visibility 350ms ease-in-out!important

  &:hover
    +desktop
      transform: translateX(-20px)

      .overlay-inner
        transform: translate(20px, -10px)

        .title
          transform: translateY(-25px)

        .subtitle
          margin-top 5px

        .subtitle, .subtext
          visibility: visible
          transform: translateY(10px)

</style>
