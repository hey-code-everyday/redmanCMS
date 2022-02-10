<template>
  <nav class="listing-nav">
    <div class="container strap-container">
      <div class="is-flex listing-nav-inner">

        <div class="listing-nav-left breadcrumb">
          <ul v-show="showReturnToSearch">
            <li><a :href="formattedSearchUrl" @click="goBack" class="var--gus-link">Return to Search</a></li>
          </ul>
          <ul v-show="!showReturnToSearch">
            <li v-show="!mobile"><a :href="formattedSearchUrl" @click="goBack" class="var--gus-link">Return to Search</a></li>
            <li v-for="crumb in formattedBreadcrumbs"><a :href="crumb.url" class="var--gus-link">{{ crumb.name }}</a></li>
          </ul>
        </div>

        <!-- <div class="listing-nav-right">
          <a class="link var--gus-link" href=""><i class='icon-chevron-left var--gus-icon'></i><span>Previous Listing</span></a>
          <a class="link var--gus-link" href=""><span>Next Listing</span><i class='icon-chevron-right var--gus-icon'></i></a>
        </div> -->

      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'listingNav',

  props: {
    breadcrumbs: { type: [Array, Boolean], required: true },
    searchUrl: { type: String, default: '/search/%slug%' }
  },

  metaInfo () {
    if (!this.breadcrumbs) return {}

    const schema = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: this.formattedBreadcrumbs.map((crumb, i) => {
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@id': crumb.url,
            name: crumb.name
          }
        }
      })
    }

    return {
      script: [
        { innerHTML: JSON.stringify(schema), type: 'application/ld+json' }
      ]
    }
  },

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    },

    showReturnToSearch () {
      return !this.mobile && (!this.breadcrumbs || !this.breadcrumbs.length)
    },

    formattedBreadcrumbs () {
      const breadcrumbs = this.breadcrumbs
      const url = this.searchUrl

      if (breadcrumbs === null) {
        return false
      }

      function makeCrumb (c) {
        return {
          name: c['wof:name'],
          url: url.replace('%slug%', 'geo/wof/' + c['wof:id']) + '/'
        }
      }

      const crumbs = []
      const placetypes = ['region', 'locality', 'metro area', 'county', 'macrocounty', 'neighbourhood']

      placetypes.forEach(p =>
        breadcrumbs.forEach(c =>
          (c['wof:placetype'] === p) ? crumbs.push(makeCrumb(c)) : ''))

      return crumbs
    },

    formattedSearchUrl () {
      return this.searchUrl.replace('%slug%', '')
    }
  },

  methods: {
    goBack (e) {
      if (!process.browser) return

      const referrer = document.referrer
      const origin = window.location.origin

      if (referrer && referrer.includes(origin) && referrer.includes('search')) {
        e.preventDefault()
        window.history.back()
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-nav-inner
  padding: 12px 0
  +mobile
    padding: 0
    height: 28px
    line-height: 28px

.listing-nav
  position: relative
  font-size: 14px
  &:after
    display: block
    content: ''
    width: 100%
    height: 1px
    left: 0
    bottom: -1px
    border-bottom: solid 1px
    opacity: 0.2
  p
    &:first-child
      opacity: 0.6
  h1
    margin-top: 1rem

.breadcrumb
  margin-bottom: 0
  font-size: 14px
  li
    + li:before
      content: ''
      font-family: 'Linearicons'
      font-size: 12px
      margin-top: 1px
    &:first-child
      a
        padding-left: 0
  a[href]
    text-decoration: underline

.listing-nav-right
  position: relative
  margin-left: auto
  +mobile
    width: 100%
    a
      width: 49%
      padding-left: 0 !important
      padding-right: 0 !important
      &:last-child
        text-align: right
  a
    font-size: 14px
    display: inline-block
    padding: 0.5em 0.75em
    text-decoration: none
    span
      text-decoration: underline
    i
      display: inline-flex
      font-size: 12px
      &:first-child
        margin-right: 6px
      &:last-child
        margin-left: 6px
    &:last-child
      padding-right: 0
</style>
