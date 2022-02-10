<template>
  <div class="strap-text">
    <div class="strap-container container pad-medium">
      <div class="columns">
        <div class="column">
          <div class='strap-content content'>
            <div class="strap-content__inner">
              <editable-you-tube-video @change="$strap_onComponentChange" keyName="youtubeVideo" :value="strap_state.youtubeVideo" />
            </div>
          </div>
        </div>
        <div class="column column__parent">
          <div class="column__content">
            <header class='strap-header content'>
              <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
            </header>
            <div class='strap-content content'>
              <div class="strap-content__inner">
                <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
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
  name: 'StrapVideoAside',

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

.strap-video

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

.column__parent
  display: flex
  flex-direction: row

.column__content
  margin: auto 0
  padding-left: 2rem
  width: 100%
  +mobile
    padding-left: 0
</style>
