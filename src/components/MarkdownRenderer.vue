<template>
  <div v-html="html"/>
</template>

<script>
export default {
  name: 'MarkdownRenderer',
  props: {
    markdown: {
      required: true,
      type: String
    }
  },
  data () {
    return { md: null }
  },
  computed: {
    html () {
      if (!this.md) return ''

      return this.md.render(this.markdown)
    }
  },
  created () {
    this.initRenderer()
  },
  methods: {
    initRenderer () {
      return import('markdown-it').then((MarkdownIt) => {
        this.md = new MarkdownIt()
      })
    }
  }
}
</script>
