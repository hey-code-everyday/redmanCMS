<template>
  <div class="strap-video">
    <div class="strap-video__inner" :style="{ backgroundColor: topBg }"></div>
    <div class="strap-video__inner is-bottom" :style="{ backgroundColor: bottomBg }"></div>
    <div class="strap-container container pad-small">
      <div class='strap-content content'>
        <div class="strap-content__inner">
          <editable-you-tube-video :highres="true" @change="$strap_onComponentChange" keyName="youtubeVideo" :value="strap_state.youtubeVideo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableButtonList from '@/components/editable/EditableButtonList'
import EditableYouTubeVideo from '@/components/editable/EditableYouTubeVideo'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'
import defaultYoutubeVideo from '@/store/defaults/components/youtubeVideo'

export default {
  name: 'StrapVideo',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableYouTubeVideo
  },

  mixins: [mixinStrap],

  computed: {
    topBg () {
      const order = this.strap.order
      const theme = this.strap.config.style.theme

      const before = this.$store.state.page.straps.find(s => s.order === order - 1)
      const beforePalette = this.$store.getters.palette(before ? before.config.style.theme : theme)

      return beforePalette.bgColor
    },

    bottomBg () {
      const order = this.strap.order
      const theme = this.strap.config.style.theme

      const after = this.$store.state.page.straps.find(s => s.order === order + 1)
      const afterPalette = this.$store.getters.palette(after ? after.config.style.theme : theme)

      return afterPalette.bgColor
    }
  },

  initialState (strap, state) {
    return {
      youtubeVideo: defaultYoutubeVideo()
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-video
  z-index: 10

.strap-video__inner
  position: absolute
  top: -1px
  bottom: 50%
  left: 0
  width: 100%
  z-index: 0
  &.is-bottom
    top: 50%
    bottom: -1px

.strap-container
  position: relative
  z-index: 1

.strap-content
  display: flex

  .strap-content__inner
    width: 100%

.is-aligned-centered
  .strap-content
    justify-content: center

.is-aligned-right
  .strap-content
    justify-content: flex-end

+mobile
  .strap-content__inner
    max-width: 100% !important
</style>
