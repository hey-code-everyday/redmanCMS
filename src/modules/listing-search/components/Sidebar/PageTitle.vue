<template>
  <h1 class="title is-4 page-title var--gus-title">{{ title }}</h1>
</template>

<script>
export default {
  name: 'pageTitle',

  computed: {
    title: function () {
      return this.$store.getters.pageTitle
    },

    htmlTitle: function () {
      return this.$store.getters.meta('title')
    }
  },

  metaInfo: function () {
    const url = this.$store.getters.encodeUrl
    const title = this.$store.getters.meta('title')
    const description = this.$store.getters.meta('description')
    const robots = this.$store.getters.robots
    const prevPage = this.$store.getters.hasPrevPage() &&
      this.$store.getters.prevPageHref()
    const nextPage = this.$store.getters.hasNextPage() &&
      this.$store.getters.nextPageHref()
    return {
      title,
      meta: [
        { vmid: 'description', name: 'description', content: description },
        { vmid: 'robots', name: 'robots', content: robots },
        { vmid: 'og:title', property: 'og:title', content: title },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:type', property: 'og:type', content: 'website' },
        { vmid: 'og:url', property: 'og:url', content: url },
        { vmid: 'twitter:title', property: 'twitter:title', content: title },
        { vmid: 'twitter:description', property: 'twitter:description', content: description },
        { vmid: 'twitter:card', property: 'twitter:card', content: 'summary' }
      ],
      link: [
        { rel: 'canonical', href: url },
        prevPage && { rel: 'prev', href: prevPage },
        nextPage && { rel: 'next', href: nextPage }
      ].filter(x => x)
    }
  }
}
</script>

<style scoped lang="sass">

.page-title
  font-size: 2rem
  line-height: 1.1
  font-weight: 400
  margin-bottom: 0.5em

</style>
