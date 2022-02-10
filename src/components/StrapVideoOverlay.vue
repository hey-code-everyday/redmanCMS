<template>
  <div class="strap-overlay has-video">
    <video-bg :sources="sources" :img="poster" class="videoBg"></video-bg>
  </div>
</template>

<script>
import VideoBg from 'vue-videobg'

export default {
  props: {
    strap: {
      type: Object,
      require: true
    }
  },

  components: {
    VideoBg
  },

  computed: {
    sources () {
      const { style } = this.$props.strap.config

      const sources = []
      if (style.bgVideo.mp4Url) sources.push(style.bgVideo.mp4Url)
      if (style.bgVideo.webmUrl) sources.push(style.bgVideo.webmUrl)
      if (style.bgVideo.oggUrl) sources.push(style.bgVideo.oggUrl)

      return sources
    },

    poster () {
      const { style } = this.$props.strap.config

      let poster = style.bgImage.imageUrls.length
        ? style.bgImage.imageUrls.length[0]
        : ''

      return poster
    }
  }
}
</script>

<style lang="sass" scoped>
.has-video

.videoBg
  height: 100% !important
</style>
