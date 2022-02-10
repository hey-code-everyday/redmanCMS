<template>
<div class="custom-modal-youtube">
  <div :class="[ 'container', state.video.highres && 'is-high-res' ]">
    <div class="video-container">
      <iframe
        ref="player"
        type="text/html"
        :src="`https://www.youtube.com/embed/${state.video.videoID}?autoplay=1&modestbranding=1&rel=0&showinfo=0&color=white`"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</div>
</template>

<script>
import mixinCustomModal from '@/mixins/custom-modal'

export default {
  name: 'ModalCustomYouTube',
  mixins: [mixinCustomModal]
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-youtube
  font-size: 0
  +mobile
    display: flex
    justify-content: center
    align-items: center
    height: 100vh

.container
  max-width: 1024px
  +touch
    width: calc(100vw - 4rem)
  +mobile
    width: 100%
    margin: auto
  .video-container
    padding-top: 75%
  &.is-high-res
    max-width: 1280px
    .video-container
      padding-top: 56.25%

.video-container
  position: relative
  width: 100%
  iframe
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>
