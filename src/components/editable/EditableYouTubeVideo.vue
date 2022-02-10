<template>
  <editable-component
    tag="span"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    :style="videoStyle"
    :class="[ 'editable-youtube-video', highres && 'is-high-res' ]"
    :click-to-edit="clickToEdit"
    @change="$editableComponent_change"
    @delete="$editableComponent_delete"
  >
    <div class="play-button" :style="{ backgroundColor: bgColor }" @click="openVideo">
      <svg width="60px" height="60px" viewBox="0 0 60 60">
        <g fill-rule="evenodd">
          <g fill-rule="nonzero">
            <polygon points="30 4 60 56 0 56"></polygon>
          </g>
        </g>
      </svg>
    </div>
  </editable-component>
</template>

<script>
import EditableComponent from '@/components/EditableComponent'
import CustomModalYouTube from '@/components/ui/modals/custom/CustomModalYouTube'
import mixinEditableComponent from '@/mixins/editable-component'

export default {
  name: 'EditableYouTubeVideo',

  mixins: [mixinEditableComponent],

  components: {
    EditableComponent,
    CustomModalYouTube
  },

  props: {
    highres: { type: Boolean, default: false },

    clickToEdit: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      video: undefined
    }
  },

  computed: {
    schema () {
      return {
        title: 'YouTube Video',
        fields: [
          {
            key: 'url',
            type: 'text',
            label: 'Video URL',
            default: ''
          }
        ]
      }
    },

    videoStyle () {
      if (!this.video) return {}

      return {
        backgroundImage: `url(${this.video.thumbnail})`
      }
    },

    bgColor () {
      return this.$store.getters.palette('default').uiPrimary.bgColor
    }
  },

  methods: {
    fetchVideoData () {
      const { url } = this.value
      const { highres } = this.$props

      if (!url) {
        this.$set(this.$data, 'video', undefined)
        return
      }

      const regxp = /(?:(?:youtu\.be\/)|(?:youtube.com\/watch\?v=))([^?]*)/g
      const matches = regxp.exec(url)

      if (!matches || !matches[1]) return
      const videoID = matches[1]

      let thumbnail = `//img.youtube.com/vi/${videoID}/hqdefault.jpg`

      if (highres) {
        thumbnail = `//img.youtube.com/vi/${videoID}/maxresdefault.jpg`
        const img = new Image()
        img.onload = () => {
          if (img.width <= 120) {
            this.$set(this.video, 'thumbnail', `//img.youtube.com/vi/${videoID}/hqdefault.jpg`)
          }
        }
        img.onerror = () => {
          this.$set(this.video, 'thumbnail', `//img.youtube.com/vi/${videoID}/hqdefault.jpg`)
        }
        img.src = thumbnail
      }

      this.$set(this.$data, 'video', {
        url,
        highres,
        videoID,
        thumbnail
      })
    },

    openVideo (e) {
      if (!this.value.url) return

      if (this.$store.state.editing) return

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          video: this.video
        },
        component: CustomModalYouTube,
        settings: {
          width: 'auto',
          height: 'auto',
          padded: false,
          palette: 'feature'
        }
      })
    }
  },

  created () {
    this.fetchVideoData()
  },

  watch: {
    value: {
      handler () {
        this.fetchVideoData()
      },
      deep: true
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.editable-youtube-video
  display: block
  position: relative
  background-color: #dfdfdf
  background-position: 50% 50%
  background-size: cover
  width: 100%
  padding-top: 75%
  border-radius: 3px
  &.is-high-res
    padding-top: 56.25%
    .play-button
      margin: -60px 0 0 -60px
      width: 120px
      height: 120px
      svg
        transform: translate(-50%, -50%) rotate(90deg) scale(0.7)
        margin-left: 0.2rem
  +touch
    padding-top: 75% !important

.play-button
  position: absolute
  z-index: 1
  cursor: pointer
  top: 50%
  left: 50%
  margin: -40px 0 0 -40px
  width: 80px
  height: 80px
  border-radius: 100px
  box-shadow: 0 4px 17px rgba(#000, 0.2)
  svg
    top: 50%
    left: 50%
    position: absolute
    transform: translate(-50%, -50%) rotate(90deg) scale(0.5)
    margin-left: 0.2rem
    polygon
      fill: #fff
  +touch
    margin: -30px 0 0 -30px !important
    width: 60px !important
    height: 60px !important
    svg
      transform: translate(-50%, -50%) rotate(90deg) scale(0.4) !important

</style>
