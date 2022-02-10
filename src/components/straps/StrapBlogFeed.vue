<template>
  <client-only>
    <div class="strap-blog-feed">
      <div class="strap-container container custom-padding">
        <div class="columns is-variable is-9">
          <div class="column all-blog-posts">
            <div class="strap-content content">

              <template v-if="!loading && !error">
                <div class="columns is-gapless is-multiline blog-feed">
                  <div class="column is-half" v-for="(post, i) in posts" :key="i">
                    <template v-if="strap_state.useBlogImage">
                      <BlogTileWithImage :post="post" :palette="strap_palette"></BlogTileWithImage>
                    </template>
                    <template v-else>
                      <BlogTile :post="post" :palette="strap_palette"></BlogTile>
                    </template>
                  </div>
                </div>
                <footer style="text-align:right; font-weight:bolder;">
                    <a class="button" :href="`/blog${category ? '/category/' + category + '/': ''}?page=${page - 1}`" v-if="page > 1"> Previous Page </a>
                    <a class="button" :href="`/blog${category ? '/category/' + category + '/': ''}?page=${page + 1}`" v-if="posts.length === 10">Next Page</a>
                </footer>
              </template>

              <template v-else-if="loading">
                Loading...
              </template>

              <template v-else-if="error">
                {{ error }}
              </template>

            </div>
          </div>
          <div class="categories column is-3">
            <!-- Categories -->
            <h3 class="sub-title is-2 align-text-right">Categories</h3>
            <ul class="category-list">
              <li class="category-line" v-for="(category, i) in categories">
                <a :href="`/blog/category/${category.slug}`" v-html="`${category.name} (${category.count})`"></a>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import api from '@/api'
import mixinStrap from '@/mixins/strap'
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import BlogTile from '@/components/BlogTile'
import BlogTileWithImage from '@/components/BlogTileWithImage'
import ClientOnly from '@/components/ClientOnly'

import { parseBlogUrl } from '@/helpers/blog'
import { encodeObject, decodeObject } from '@/helpers/html-encode'

function prefetchBlogPosts (resolve, reject, store, state) {
  if (!store.state.website.config.setup.blogUrl) {
    reject(new Error('Please configure the blog URL in the Website settings.'))
    return
  }

  const parsed = parseBlogUrl(store.state.config.requestUrl)

  const data = {
    categories: [],
    posts: []
  }

  api.getBlogCategories(store.state).then(response => {
    data.categories = encodeObject(response.body)

    // Post filters
    const filters = {
      posts_per_page: 10
    }
    if (parsed.category) {
      filters['taxonomy'] = 'category'
      filters['term'] = parsed.category
    }

    // Other params
    const params = {
      page: parsed.page || 1
    }

    api.getBlogPosts(store.state, filters, params).then(response => {
      data.posts = encodeObject(response.body)
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  }).catch(err => {
    reject(err)
  })
}

function afterPrefetch (err, result) {
  if (err) {
    this.loading = false
    this.$set(this, 'error', err)
    console.warn(err)

    return
  }

  const parsed = parseBlogUrl(this.$store.state.config.requestUrl)

  this.loading = false
  this.$set(this, 'page', Number(parsed.page || 1))
  this.$set(this, 'category', parsed.category || false)
  this.$set(this, 'posts', decodeObject(result.posts))
  this.$set(this, 'categories', decodeObject(result.categories))
  this.$set(this, 'slug', parsed.slug)
}

export default {
  name: 'StrapBlogFeed',

  components: {
    EditableTitle,
    EditableQuill,
    BlogTile,
    BlogTileWithImage,
    ClientOnly
  },

  mixins: [mixinStrap],

  metaInfo () {
    const he = require('he')

    const { agent } = this.$store.getters
    const { website, config, page } = this.$store.state
    const { category } = this.$data

    const meta = []
    const title = category
      ? (he.decode(category) || '')
          .replace(/<[^>]+>/g, '')
          .replace(/-/g, ' ')
          .replace(/(\b[a-z](?!\s))/g, a => a.toUpperCase())
      : page.metaInfo.title

    // Facebook
    meta.push({
      vmid: 'og:title',
      property: 'og:title',
      content: title
    })

    // Twitter
    meta.push({ vmid: 'twitter:title', name: 'twitter:title', content: title })

    // canonical links
    const link = []
    const protocol = this.$store.state.config.websiteProtocol || 'https'
    const hostname = this.$store.state.config.websiteDomain
    link.push({rel: 'canonical', href: `${protocol}://${hostname}/blog${this.category ? '/category/' + this.category + '/': ''}?page=${this.page}`})

    const ldJson = {
      '@context': 'http://schema.org',
      '@type': 'Blog',
      'name': website.config.display.siteName,
      'url': config.requestUrl,
      'description': 'The blog of ' + (agent ? agent.displayName : website.config.display.siteName),
      'publisher': {
        '@type': 'Organization',
        'name': website.config.display.siteName
      }
    }

    return {
      title,
      link,
      meta,
      script: [
        {
          innerHTML: JSON.stringify(ldJson),
          type: 'application/ld+json'
        }
      ]
    }
  },

  data () {
    return {
      loading: true,
      error: false,
      slug: '',
      page: 1,
      posts: [],
      category: false,
      categories: []
    }
  },

  prefetch (resolve, reject, store, state) {
    prefetchBlogPosts(resolve, reject, store, state)
  },

  afterPrefetch (err, result) {
    afterPrefetch.call(this, err, result)
  },

  computed: {
    fadedOverlay() {
      var r = parseInt(this.strap_palette.bgColor.slice(1, 3), 16),
        g = parseInt(this.strap_palette.bgColor.slice(3, 5), 16),
        b = parseInt(this.strap_palette.bgColor.slice(5, 7), 16);

      var fadedColor = "rgba(" + r + ", " + g + ", " + b + ", 0)";

      return {
        "background": "linear-gradient( " + fadedColor + " 65%, " + this.strap_palette.bgColor + " 83%)"
      }
    }
  },

  methods: {
    formatUrl (date) {
      return dayjs(date).format('YYYY/MM/DD')
    },

    fetch () {
      new Promise((resolve, reject) => {
        prefetchBlogPosts(resolve, reject, this.$store, this.strap_state)
      }).then(result => {
        afterPrefetch.call(this, null, result)
      }).catch(err => {
        afterPrefetch.call(this, err, null)
      })
    }
  },

  initialState (strap, state) {
    return {
      useBlogImage: false
    }
  },
  
  schema () {
    return [
      {
        title: 'Image',
        tabs: [
          {
            title: 'Image',
            fields: [
              {
                key: 'state.useBlogImage',
                type: 'checkbox',
                label: 'Show Blog Image',
                text: 'Show the first blog image',
                default: false,
                onValue: true,
                offValue: false
              }
            ]
          }
        ]
      }
    ]
  },

  migrations (strap, state) {
    return [
      {
        useBlogImage: false
      }
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-blog-feed

  .custom-padding
    padding: 6.25vw 0em 6.25vw 0em

  .read-full-post
    font-weight: bolder

  .blog-feed
    margin-top:  40px

  .sub-title
    font-size: 1.75em
    margin-bottom: 10px
    border-bottom: 2px solid rgba(0,0,0,0.1)

  .category-list
    text-align: left
    padding-left: 50px

  .category-line
    padding: 2px
    font-size: 1.2em

  .pagination
    text-align: right
    font-weight: bolder

</style>
