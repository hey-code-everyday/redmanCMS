<template>
  <div class="postscribe-html">
    <template v-if="!disablePostscribe && browser">
      <div
        class="postscribe-html__inner"
        ref="container"
      ></div>
    </template>
    <template v-else>
       <div
        class="postscribe-html__inner"
        v-html="decodedHtml"
      ></div>
    </template>
  </div>
</template>

<script>
const postscribe = process.browser ? require('postscribe') : false

export default {
  name: 'PostscribeHtml',

  props: {
    html: {
      type: String,
      default: ''
    },
    disablePostscribe: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    browser () {
      return process.browser
    },

    decodedHtml () {
      let html
      try {
        html = decodeURI(this.html)
      } catch (e) {
        console.warn(e)
      }

      return html
    }
  },

  methods: {
    postscribe () {
      if (process.browser && this.$refs.container) {
        this.$refs.container.innerHTML = ''

        let html = 'Invalid HTML'
        try {
          html = decodeURI(this.html)
        } catch (e) {
          console.warn(e)
        }

        postscribe(this.$refs.container, html, this.ready)
      }
    },

    ready () {
    }
  },

  mounted () {
    if (!this.disablePostscribe) this.postscribe()
  },

  updated () {
    if (!this.disablePostscribe) this.postscribe()
  },

  watch: {
    html () {
      if (!this.disablePostscribe) this.postscribe()
    }
  }
}
</script>

<style lang="sass" scoped>
.postscribe-html

.postscribe-html__inner

</style>
