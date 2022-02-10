<template>
  <div :class="classes">
    <div class="strap-container container pad-medium">
      <!-- New page -->
      <template v-if="isNew && strap_state.code === 404">
        <StrapMessageBox title="New Page" icon="icon-file-empty">
          This page doesn't exist... yet.
          <client-only>
            <template
              v-if="$store.getters.canEdit && strap_state.code === 404"
              slot="footer"
            >
              <a @click='createPage'>Create this page</a>
            </template>
          </client-only>
        </StrapMessageBox>
      </template>

      <!-- Error page -->
      <template v-else>
        <StrapMessageBox :title="strap_pageMeta.title" icon="icon-file-empty">
          Error {{ strap_state.code }} - {{ strap_state.error }}
          <template slot="footer">
            <client-only>
              <template v-if="$store.getters.canEdit && strap_state.code === 404">
                <a @click='createPage'>Create this page</a>
              </template>
              <template v-else>
                <a @click='returnToLast'>Return to last page</a>
              </template>
            </client-only>
          </template>
        </StrapMessageBox>
      </template>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import createPage from '@/store/defaults/page'
import ClientOnly from '@/components/ClientOnly'
import StrapMessageBox from '@/components/StrapMessageBox'

export default {
  name: 'StrapError',

  mixins: [mixinStrap],

  components: {
    ClientOnly,
    StrapMessageBox
  },

  computed: {
    isNew () {
      return this.$route.hash === '#new-page' && this.$store.getters.canEdit
    },

    classes () {
      if (this.isNew) return 'strap-error is-new'
      else return 'strap-error'
    }
  },

  methods: {
    createPage () {
      if (!process.browser) return

      let slug = window.location.pathname === '/'
        ? 'index'
        : window.location.pathname.replace('/', '').split('/')[0]

      if (this.$route.meta.pageID) {
        slug = this.$route.meta.pageID
      }

      const page = createPage(slug)

      this.$store.dispatch('newPage', { page, pageID: slug }).then(() => {
        if (process.browser) {
          const { origin } = window.location
          window.location.href = origin + '/' + slug
        }
      })
    },

    returnToLast () {
      if (process.browser) {
        window.history.back()
      }
    }
  }
}
</script>

<style scoped lang="sass">
.strap-error
  &.is-new
    background-image: url('../../assets/images/geometry2.png')
</style>
