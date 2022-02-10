<template>
  <div class="blog-post">
    <a class="title blog-title" v-html="post.title" :href="`/blog/${formatUrl(post.date)}/${post.slug}`"></a>
    <div class="post-excerpt-container" :style="fadedOverlay"></div>
    <p class="post-excerpt" v-html="post.excerpt || post.content"></p>
    <footer class="post-footer">
      <a class="read-full-post" :href="`/blog/${formatUrl(post.date)}/${post.slug}`">Read Full Post</a>
      <p class="post-info"> {{ post.author.name }} | {{ post.date | fromNow }}  </p>
    </footer>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)


export default {
  name: 'BlogTile',

  props: {
    post: {
      type: Object,
      required: true,
    },
    palette: {
      type: Object,
      required: true,
    }
  },

  data () {
    return {}
  },

  computed: {
    fadedOverlay() {
      let strapPalette = this.palette

      var r = parseInt(strapPalette.bgColor.slice(1, 3), 16),
        g = parseInt(strapPalette.bgColor.slice(3, 5), 16),
        b = parseInt(strapPalette.bgColor.slice(5, 7), 16);

      var fadedColor = "rgba(" + r + ", " + g + ", " + b + ", 0)";

      return {
        "background": "linear-gradient( " + fadedColor + " 65%, " + strapPalette.bgColor + " 83%)"
      }
    }
  },

  methods: {
    formatUrl (date) {
      return dayjs(date).format('YYYY/MM/DD')
    }
  }
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.blog-post
  border: 2px rgba(0,0,0,0.2) solid
  margin: 10px
  position: relative
  overflow: hidden

  +desktop
    height: 420px
    padding: 30px

  +touch
    padding: 10px
    height: 300px

  .blog-title
    +desktop
      font-size: 1.5em
    +touch
      font-size: 1.25em

  .post-excerpt-container
    height: 100%
    width: 100%
    top: 0
    left: 0
    position: absolute
    pointer-events: none

  .post-excerpt
    overflow: hidden
    margin-top: 10px

    +desktop
      height: auto

    +touch
      height: auto

  .post-footer
    margin: 0px 10px 20px 10px
    position: absolute
    bottom: 0
    right: 0

  .post-info
    line-height: 70%

</style>
