<template>
  <div class="strap-text">
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
          <template v-for="(n, i) in numRows">
            <editable-you-tube-columns
              listKey="videoList"
              class="video-list"
              :row="i"
              :rowLength="3"
              :list="filteredVideos(i)"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </template>
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
import EditableYouTubeColumns from '@/components/editable/EditableYouTubeColumns'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'
import defaultYoutubeVideo from '@/store/defaults/components/youtubeVideo'

export default {
  name: 'StrapVideoColumns',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableYouTubeColumns
  },

  mixins: [mixinStrap],

  computed: {
    numRows () {
      const rows = Math.ceil(this.strap_state.videoList.length / 3)

      const arr = []
      arr.length = rows

      return arr
    }
  },

  methods: {
    filteredVideos (row) {
      return this.strap_state.videoList.filter((v, i) => i >= (row * 3) && i < (row * 3) + 3)
    }
  },

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      title: defaultTitle({ html: 'Video Strap' }),
      buttonList: [defaultButton()],
      videoList: [defaultYoutubeVideo(), defaultYoutubeVideo(), defaultYoutubeVideo()]
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

/deep/
  .strap-content__inner
    .video-list
      .editable-list__button
        position: absolute
        right: -2rem
        top: 0.75rem
      &:not(:last-child)
        .editable-list__button
          display: none

</style>
