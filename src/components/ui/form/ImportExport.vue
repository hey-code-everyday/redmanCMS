<template>
  <div class="import-export app-control control ws-ui">
    <!-- <h2 class="title is-4">Import JSON</h2>

    <div class="field">
      <div class="app-control control">
        <textarea
          class="textarea app-input"
          placeholder="Paste JSON into me"
          ref="jsonText"
        >
        </textarea>
      </div>
    </div>

    <div class="field add-strap-field has-addons">
      <p class="control app-control" style="width:100%">
        <span class="select app-select">
          <select ref="jsonField">
            <optgroup label="Phoenix 3.X">
              <option value="page" selected>Page</option>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
              <option value="website">Website</option>
            </optgroup>
            <optgroup label="Phoenix 2.X">
              <option value="page-old">Page (2.X)</option>
              <option value="website-old">Website (2.X)</option>
            </optgroup>
          </select>
        </span>
      </p>
      <p class="control app-control">
        <a :class="[ 'button', 'is-primary' ]" @click="importJson">
          <span>Import JSON</span>
        </a>
      </p>
    </div>

    <br />
    <br /> -->
    <h2 class="title is-4">Export JSON</h2>

    <!-- Export page JSON -->
    <div class="field" v-if="!showPageJson">
      <label class="label">Page JSON</label>
      <div class="app-control control">
        <div class="button is-primary" @click="showPageJson = true"><span>Export Page JSON</span></div>
      </div>
    </div>
    <dynamic-field
      v-if="showPageJson"
      :field="{
        key: 'page',
        type: 'readOnlyText',
        label: 'Page JSON',
        default: ''
      }"
      :state="exportJson('page')"
    />

    <!-- Export header JSON -->
    <div class="field" v-if="!showHeaderJson">
      <label class="label">Header JSON</label>
      <div class="app-control control">
        <div class="button is-primary" @click="showHeaderJson = true"><span>Export Header JSON</span></div>
      </div>
    </div>
    <dynamic-field
      v-if="showHeaderJson"
      :field="{
        key: 'header',
        type: 'readOnlyText',
        label: 'Header JSON',
        default: ''
      }"
      :state="exportJson('header')"
    />

    <!-- Export footer JSON -->
    <div class="field" v-if="!showFooterJson">
      <label class="label">Footer JSON</label>
      <div class="app-control control">
        <div class="button is-primary" @click="showFooterJson = true"><span>Export Footer JSON</span></div>
      </div>
    </div>
    <dynamic-field
      v-if="showFooterJson"
      :field="{
        key: 'footer',
        type: 'readOnlyText',
        label: 'Footer JSON',
        default: ''
      }"
      :state="exportJson('footer')"
    />

    <!-- Export website JSON -->
    <div class="field" v-if="!showWebsiteJson">
      <label class="label">Website JSON</label>
      <div class="app-control control">
        <div class="button is-primary" @click="showWebsiteJson = true"><span>Export Website JSON</span></div>
      </div>
    </div>
    <dynamic-field
      v-if="showWebsiteJson"
      :field="{
        key: 'website',
        type: 'readOnlyText',
        label: 'Website JSON',
        default: ''
      }"
      :state="exportJson('website')"
    />
  </div>
</template>

<script>
import DynamicField from '../DynamicField'

export default {
  name: 'ImportExport',

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
      showPageJson: true,
      showHeaderJson: true,
      showFooterJson: true,
      showWebsiteJson: true
    }
  },

  methods: {
    importJson () {
    },

    exportJson (key) {
      return {
        [key]: JSON.stringify(this.$store.state[key])
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.import-export
  width: 100%
  height: 100%
</style>
