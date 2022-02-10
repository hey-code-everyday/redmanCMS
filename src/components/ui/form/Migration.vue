<template>
  <div class="migration app-control control ws-ui">

    <template v-if="step === 1">
      <h2 class="title is-4">Migrate from Engine</h2>
      <div class="content">
        <p>
          This tool is for migrating an existing Phoenix 2.X webpage from the engine to version 3.0.
          The website MUST be an existing Phoenix 2.X site, and the page you are importing MUST be a Phoenix page.
          Engine, stock and CMS pages cannot be imported.
        </p>
      </div>
      <br />
    </template>

    <h2 class="title is-4">
      <template v-if="step === 1">Step 1: Fetch Pages</template>
      <template v-if="step === 2">Step 2: Choose Pages</template>
      <template v-if="step === 3">Step 3: Migrate Pages</template>
    </h2>
    <div class="content">
      <template v-if="error">
        <p>Error: {{ error.code }}</p>
        <div class="app-control control">
          <div :class="[ 'button', 'is-primary' ]" @click="reset">
            <span>Start Over</span>
          </div>
        </div>
      </template>
      <template v-else>

        <!-- Step 1: Fetch pages -->
        <template v-if="step === 1">
          <p>To start the migration process, click the button below to fetch a list of available pages.</p>
          <div class="field">
            <div class="app-control control">
              <div :class="[ 'button', 'is-primary', (loading ? 'is-loading' : '') ]" @click="fetchPages">
                <span>List Pages</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Step 2: Choose pages to import -->
        <template v-if="step === 2">
          <p>Now choose which pages you would like to migrate.</p>
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>
                  <div class="app-control control">
                    <label class="app-checkbox checkbox">
                      <input
                        type="checkbox"
                        id="chk_all"
                        :value="true"
                        @change="selectAll"
                      >
                      <label :for="'chk_all'"></label>
                    </label>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody ref="pagesTableBody">
              <tr v-for="page in pages" :key="page.id">
                <th>{{ page.title }}</th>
                <td>
                  /{{ page.slug }}
                </td>
                <td>
                  <div class="app-control control">
                    <label class="app-checkbox checkbox">
                      <input
                        type="checkbox"
                        :id="'chk_' + page.id"
                        :ref="'chk_' + page.id"
                        :value="page.id"
                        @change="selectOne"
                      >
                      <label :for="'chk_' + page.id"></label>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="app-control control">
            <div :class="[ 'button', 'is-primary', (pagesSelected ? '' : 'is-disabled') ]" @click="migratePages">
              <span>Migrate Selected Pages</span>
            </div>
          </div>
        </template>

        <!-- Step 3: Migrate pages -->
        <template v-if="step === 3">
          <p>The migration is in process. Please do not close this window until the migration has finished.</p>
          <ul>
            <template v-for="page in pages" >
              <li v-if="!page.done && !page.error" :key="page.id">Migrating <strong>{{ page.title }}</strong>...</li>
              <li v-if="page.done">
                <span class="icon is-done">
                  <i class="icon-check"></i>
                </span>
                <strong>{{ page.title }}</strong> migrated!
              </li>
              <li v-if="page.done">
                <span class="icon is-error">
                  <i class="icon-cross"></i>
                </span>
                <strong>Error migrating {{ page.title }}</strong>.
              </li>
            </template>
          </ul>
        </template>

      </template>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import DynamicField from '../DynamicField'

export default {
  name: 'Migration',

  props: {
    props: {
      type: Object,
      required: true
    }
  },

  components: {
    DynamicField
  },

  data () {
    return {
      step: 1,
      loading: false,
      error: false,
      pages: [],
      pagesSelected: 0
    }
  },

  methods: {
    reset () {
      this.loading = false
      this.error = false
      this.step = 1
    },

    fetchPages () {
      this.loading = true

      api.getEnginePages(this.$store.state).then(response => {
        this.loading = false
        const pages = response.body.map(page => {
          const isIndex = page.NAME_ID === 'INDEX_HOME'

          return {
            id: page.ID,
            title: isIndex ? 'Home' : page.TITLE,
            slug: isIndex ? '' : page.CUSTOM_PATH,
            done: false,
            error: false
          }
        })

        this.$set(this.$data, 'pages', pages)
        this.step = 2
      }).catch(e => {
        this.loading = false
        this.error = e
      })
    },

    migratePages () {
      const pageIDs = []
      this.$refs.pagesTableBody.querySelectorAll('input[type="checkbox"]').forEach(el => {
        if (el.checked) pageIDs.push(el.value)
      })

      const result = confirm(`Are you sure you want to migrate ${pageIDs.length} pages?`)
      if (!result) return

      this.step = 3
    },

    selectAll (e) {
      this.$refs.pagesTableBody.querySelectorAll('input[type="checkbox"]').forEach(el => {
        el.checked = e.target.checked
      })

      this.checkSelected()
    },

    selectOne () {
      this.checkSelected()
    },

    checkSelected () {
      if (!this.$refs.pagesTableBody) return 0

      const pageIDs = []
      this.$refs.pagesTableBody.querySelectorAll('input[type="checkbox"]').forEach(el => {
        if (el.checked) pageIDs.push(el.value)
      })

      this.pagesSelected = pageIDs.length
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.migration
  width: 100%
  height: 100%

.button
  &.is-loading,
  &.is-disabled
    opacity: 0.6
    pointer-events: none

  &.is-loading
    > span
      opacity: 0
ul
  list-style-type: none
  margin: 0

li
  margin: 0.6em 0

  .icon
    color: #fff
    font-size: 12px !important
    border-radius: 50%
    margin-right: 0.4em
    display: inline-flex

    &.is-done

</style>
