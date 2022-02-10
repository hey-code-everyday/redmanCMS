<template>
  <div class="strap-latest-news">
    <div class="strap-container container pad-medium">
      <div class="columns">
        <div class="column is-4 is-description is-aligned-left">
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
          </header>
          <div class='strap-content content is-hidden-mobile'>
            <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
            <br />
            <editable-button-list
              tag="div"
              listKey="buttonList"
              :small="true"
              :list="strap_state.buttonList"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </div>
        </div>
        <div class="column is-8 is-news is-aligned-left">
          <div class="pad-medium trim-tb trim-right">
            <!-- Error -->
            <template v-if="error">
              <div class="strap-latest-listings__error">
                Error fetching blog posts:<br />
                {{ error }}
              </div>
            </template>

            <!-- Loading -->
            <template v-else-if="loading">
              <div class="strap-latest-listings__loading" :style="{ color: strap_palette.text }">
                <span class="loader" :style="{ borderLeftColor: strap_palette.text, borderBottomColor: strap_palette.text }"></span><br />
                Loading...
              </div>
            </template>

            <div v-else>
              <div v-for="(post, i) in posts" class="strap-latest-news__post" :style="{ borderBottomColor: Color(strap_palette.text).fade(0.8).string() }">
                <h5 class="title is-5" v-html="post.title"></h5>
                <p class="subtitle is-soft">{{ post.date | fromNow }}</p>
                <p v-html="excerpt(post.excerpt || post.content)"></p>
                <a v-if="!strap_state.disableLinks" :href="`/${strap_state.postSlug}/${formatUrl(post.date)}/${post.slug}`" :title="post.title"></a>
              </div>
            </div>

            <div class="is-hidden-desktop" :style="{ paddingTop: '3rem' }">
              <editable-button-list
                tag="div"
                listKey="buttonList"
                :small="true"
                :list="strap_state.buttonList"
                :onCreate="$strap_onListCreate"
                :onChange="$strap_onListChange"
                :onDelete="$strap_onListDelete"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import api from '@/api'
import Color from 'color'
import mixinStrap from '@/mixins/strap'

import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapLatestNews',

  components: {
    EditableButtonList,

    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  computed: {
    Color () {
      return Color
    }
  },

  data () {
    return {
      error: false,
      loading: false,
      posts: []
    }
  },

  methods: {
    excerpt (str) {
      if (!str) return ''

      str = str.replace(/<p>/g, '').replace(/<\/p>/g, '')
      //removing iframes
      str = str.replace(/<iframe\s+src=(".*?").*?<\/iframe>/g, '')

      // remove scripts
      str = str.replace(/<script+.*?\/script>/g, '')

      if (str.length > 240) return str.slice(0, 240) + '...'
      else return str
    },

    formatUrl (date) {
      return dayjs(date).format('YYYY/MM/DD')
    }
  },

  prefetch (resolve, reject, store, state) {
    api.getBlogPosts(store.state).then(response => {
      resolve(response.body)
    }).catch(err => {
      reject(err)
    })
  },

  afterPrefetch (err, result) {
    if (err) {
      this.loading = false
      this.$set(this, 'error', err)
      console.warn(err)
    }

    this.loading = false
    this.$set(this, 'posts', result)
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Latest News', size: 2 }),
      text: defaultQuill({ html: 'Updates from {{ agent.displayName }}' }),
      buttonList: [defaultButton({ text: 'Read More', href: '{{ website.config.setup.blogUrl }}' })],
      postSlug: 'post',
      disableLinks: false
    }
  },

  schema () {
    return [
      {
        title: 'Wordpress Setup',
        tabs: [
          {
            title: 'Links',
            fields: [
              {
                key: 'state.disableLinks',
                type: 'checkbox',
                label: 'Disable Wordpress links',
                text: 'Removes links on blog posts',
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
        postSlug: 'post'
      },
      {
        disableLinks: false
      } // issue-234
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-latest-news

  .trim-right
    +mobile
      padding-left: 0

.strap-latest-news__post
  position: relative
  padding-bottom: 2rem
  margin-bottom: 2rem
  border-bottom: solid 1px

  &:last-child
    margin-bottom: 0
    padding-bottom: 0
    border-bottom: 0

  .title
    margin-bottom: 2rem

  p
    font-size: 18px

    &.subtitle
      font-size: 16px
      margin-bottom: 1rem

  a
    position: absolute
    display: block
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>
