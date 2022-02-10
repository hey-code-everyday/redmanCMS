<template>
  <div class="strap-video-with-text">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class='strap-content content'>
        <div class="strap-content__inner">
          <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
        </div>
      </div>
      <div class='strap-content content'>
        <div class="strap-content__inner">
          <editable-you-tube-video :highres="true" @change="$strap_onComponentChange" keyName="youtubeVideo" :value="strap_state.youtubeVideo" />
        </div>
      </div>
      <footer class='strap-footer content'>
        <editable-button-list
          tag="div"
          listKey="buttonList"
          :list="strap_state.buttonList"
          :onCreate="$strap_onListCreate"
          :onChange="$strap_onListChange"
          :onDelete="$strap_onListDelete"
        />
      </footer>
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
  name: 'StrapVideoWithText',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableYouTubeVideo
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      title: defaultTitle({ html: 'Video Strap' }),
      buttonList: [defaultButton()],
      youtubeVideo: defaultYoutubeVideo()
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-video-with-text

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
