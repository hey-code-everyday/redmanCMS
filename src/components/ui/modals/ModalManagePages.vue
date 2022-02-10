<template>
<div class="modal-manage-page modal-box">

  <!-- Form -->
  <div class="modal-box__content">

    <!-- Title -->
    <div class="modal-box__content-inner">
      <header class="modal-box__content-title">
        <h1 class="title">Manage Pages</h1>
      </header>
    </div>

    <!-- Content -->
    <div class="modal-box__content-inner">

      <!-- Error -->
      <template v-if="error">
        Error fetching page list.
      </template>

      <!-- Loading -->
      <template v-else-if="loading">
        <div class="loading">
          <span class="loader"></span><br />
          Loading...
        </div>
      </template>

      <!-- List -->
      <template v-else>
        <table class="table">
          <thead>
            <tr>
              <th><!-- Title -->Page</th>
              <th>URL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in pages" :key="page.slug">
              <th>{{ page.metaInfo.title }}</th>
              <td>
                <!-- Index -->
                <template v-if="page.slug === 'index'">
                  <a
                    v-if="$store.state.page.slug !== page.slug"
                    :href="'/'+page.slug"
                    title="This is your home page."
                  >
                    /<span style="opacity:0.4">index</span>
                  </a>
                  <template v-else>
                    <span title="This is your home page.">/<span style="opacity:0.4">index</span></span>
                  </template>
                </template>

                <!-- Other -->
                <template v-else>
                  <a
                    v-if="$store.state.page.slug !== page.slug"
                    :href="'/'+page.slug"
                  >
                    /{{ page.slug }}
                  </a>
                  <template v-else>
                    /{{ page.slug }}
                  </template>
                </template>
              </td>
              <td>
                  <span
                    v-if="page.slug !== 'index' && page.slug !== $store.state.page.slug"
                    class="delete"
                    @click="deletePage(page.slug)"
                  ></span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

    </div>

  </div>

</div>
</template>

<script>
import mixinModal from '@/mixins/modal'

export default {
  name: 'ModalManagePages',

  mixins: [mixinModal],

  data () {
    return {
      loading: true,
      error: null,
      pages: {}
    }
  },

  created () {
    this.$store.dispatch('fetchPages').then(response => {
      const pages = JSON.parse(response.body).rows
      this.pages = pages.map(p => {
        return {
          slug: p.key[1],
          metaInfo: {
            title: p.key[1]
          }
        }
      })
      this.loading = false
    })
    .catch(e => {
      console.warn(e)
      this.error = e
    })
  },

  methods: {
    closeModal () {
      this.$store.commit('HIDE_MANAGE_PAGES_MODAL')
    },

    deletePage (pageID) {
      const result = confirm(`Are you sure you want to delete ${pageID}? This action cannot be reversed!`)
      if (!result) return

      this.$store.dispatch('deletePage', pageID).then(response => {
        return this.$store.dispatch('fetchPages')
      }).then(response => {
        const pages = JSON.parse(response.body).rows
        this.pages = pages.map(p => {
          return {
            slug: p.key[1],
            metaInfo: {
              title: p.key[1]
            }
          }
        })
      }).catch(e => {
        console.warn(e)
        this.error = null
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.modal-manage-page
  min-width: 550px
  min-height: 700px
  max-height: calc(100vh - 100px)
  overflow-y: auto
  overflow-x: hidden

.table
  width: 100%

  tr
    td
      &:last-child
        text-align: right
        justify-content: center
        align-items: flex-end

.delete
  margin: 2px -5px 0 0

.loading
  padding: 50px
  text-align: center
  color: $wsTextLight

.loader
  +loader
  display: inline-block
  width: 3rem
  height: 3rem
  margin-bottom: 1rem
  border-left-color: $wsBorder
  border-bottom-color: $wsBorder
</style>
