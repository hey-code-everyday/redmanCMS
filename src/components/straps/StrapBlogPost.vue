<template>
  <div class="strap-blog-post">
    <div class="strap-container container pad-medium">
      <template v-if="!loading && !error">
        <div class="columns">
          <div class="column is-9">
            <header class='strap-header content'>
              <h1 style="text-align:center;" class="title is-1" v-html="post.title"></h1>

              <!-- desktop/tablet -->
              <div class="level is-hidden-mobile">
                <div v-show="strap_state.useFacebookButton" class="level-left">
                  <div class="level-item">
                    <div class="post-facebook-like-button">
                      <div id="fb-root"></div>
                        <!-- Your like button code -->
                        <div class="fb-like"
                          data-href= window.location.href
                          data-layout="standard"
                          data-action="like"
                          data-show-faces="false"
                          data-share="true">
                        </div>
                    </div>
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <div class="post-info">
                      {{ post.date | fromNow }} | {{ post.author.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- desktop/tablet -->
              <div class="is-hidden-tablet">
                <div class="post-info">
                  {{ post.date | fromNow }} | {{ post.author.name }}
                </div>
                <div v-show="strap_state.useFacebookButton" class="post-facebook-like-button">
                  <div id="fb-root"></div>
                    <!-- Your like button code -->
                    <div class="fb-like"
                      data-href= window.location.href
                      data-layout="standard"
                      data-action="like"
                      data-show-faces="false"
                      data-share="true">
                    </div>
                </div>
              </div>
            </header>

            <div class='strap-content content' v-html='post.content'>
            </div>
          </div>
          <div class="column">
            <h3 class="sub-title is-2 align-text-right">Categories</h3>
            <ul class="category-list">
              <li class="category-line" v-for="(category, i) in categories">
                <a :href="`/blog/category/${category.slug}`" v-html="`${category.name} (${category.count})`"></a>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <template v-else-if="loading">
        Loading...
      </template>

      <template v-else-if="error">
        {{ error }}
      </template>

    </div>
  </div>
</template>

<script>
import api from '@/api'
import mixinStrap from '@/mixins/strap'
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import { parseBlogUrl } from '@/helpers/blog'
import { encodeObject, decodeObject } from '@/helpers/html-encode'

function prefetchBlogPost (resolve, reject, store, state) {
  const parsed = parseBlogUrl(store.state.config.requestUrl)

  if (!parsed.postID) {
    return reject(new Error('No post with this ID found.'))
  }

  const data = {
    categories: [],
    post: {}
  }

  api.getBlogPost(store.state, parsed.postID).then(response => {
    if (response.body.length) data.post = encodeObject(response.body[0])
    else reject(new Error('No post found.'))

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
  this.$set(this, 'post', decodeObject(result.post))
  this.$set(this, 'categories', decodeObject(result.categories))
  this.$set(this, 'slug', parsed.slug)
}

export default {
  name: 'StrapBlogPost',

  components: {
    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  mounted() {
    if (this.strap_state.useFacebookButton) {
      //facebook SDK for like/share button
      (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  },

  metaInfo () {
    const he = require('he')

    const { post } = this.$data
    const { agent } = this.$store.getters
    const { page, config, website } = this.$store.state

    let terms = []
    for (let key in post.terms) {
      if (key === 'category') {
        post.terms[key].forEach(term => {
          terms.push(term.name.toLowerCase())
        })
      }
    }
    terms = terms.join(' ').split(' ')
    terms = terms.filter((term, i) => terms.indexOf(term) === i)

    const ldJson = {
      '@context': 'http://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'genre': 'real estate',
      'keywords': terms.join(' '),
      'publisher': agent ? agent.displayName : website.config.display.siteName,
      'url': config.requestUrl,
      'datePublished': post.date,
      'description': post.excerpt || post.content,
      'articleBody': post.content,
      'author': {
        '@type': 'Person',
        'name': agent ? agent.displayName : website.config.display.siteName
      }
    }

    const meta = []
    const title = (he.decode(post.title) || '').replace(/<[^>]+>/g, '')
    const description = (he.decode(post.excerpt) || he.decode(post.content) || '').replace(/<[^>]+>/g, '')

    let imageUrl = null
    if (post.featured_image && post.featured_image.guid) imageUrl = post.featured_image.guid
    if (imageUrl) {
      let title = post.featured_image.title
      meta.push({ vmid: 'og:image', property: 'og:image', content: imageUrl })
      meta.push({ vmid: 'og:image:alt', property: 'og:image:alt', content: title })
      meta.push({ vmid: 'twitter:image', name: 'twitter:image', content: imageUrl })
      if (post.featured_image.attachment_meta) {
        let height = post.featured_image.attachment_meta.height
        let width = post.featured_image.attachment_meta.width
        meta.push({ vmid: 'og:image:height', property: 'og:image:height', content: height })
        meta.push({ vmid: 'og:image:width', property: 'og:image:width', content: width })
      }
    }

    // Facebook

    meta.push({
      vmid: 'og:type',
      property: 'og:type',
      content: 'article'
    })
    meta.push({
      vmid: 'og:title',
      property: 'og:title',
      content: title
    })
    meta.push({
      vmid: 'og:description',
      property: 'og:description',
      content: description
    })

    // Twitter

    meta.push({ vmid: 'twitter:title', name: 'twitter:title', content: title })
    meta.push({ vmid: 'twitter:description', name: 'twitter:description', content: description })

    return {
      title,
      meta: [
        {
          name: 'description',
          content: description
        },
        ...meta
      ],
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
      post: {},
      categories: []
    }
  },

  prefetch (resolve, reject, store, state) {
    prefetchBlogPost(resolve, reject, store, state)
  },

  afterPrefetch (err, result) {
    afterPrefetch.call(this, err, result)
  },

  methods: {
    fetch () {
      new Promise((resolve, reject) => {
        prefetchBlogPost(resolve, reject, this.$store, this.strap_state)
      }).then(result => {
        afterPrefetch.call(this, null, result)
      }).catch(err => {
        afterPrefetch.call(this, err, null)
      })
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Latest News', size: 2 }),
      text: defaultQuill({ html: 'Updates from {{ agent.displayName }}' })
    }
  },

  schema () {
    return [
      {
        title: 'Social Media',
        tabs: [
          {
            title: 'Facebook',
            fields: [
              {
                key: 'state.useFacebookButton',
                type: 'checkbox',
                label: 'Facebook Like/Share Button',
                text: 'Show the Facebook like/share button',
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
      { useFacebookButton: false } // Issue #782
    ]
  }
}

</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-blog-post

  .post-info

  .sub-title
    text-align: center
    font-size: 1.75em
    margin-bottom: 10px
    margin-top: 120px
    border-bottom: 2px solid rgba(0,0,0,0.1)

  .category-list
    text-align: left
    padding-left: 1.5em

  .category-line
    padding: 2px
    font-size: 1.2em

#gallery-1
  margin: auto

#gallery-1 .gallery-item
  float: left
  margin-top: 10px
  text-align: center
  width: 33%

#gallery-1 img
  border: 2px solid #cfcfcf

#gallery-1 .gallery-caption
  margin-left: 0

</style>
