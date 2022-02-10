<template>
  <div class="edit-json app-control control ws-ui">
    <h2 class="title is-4">Edit JSON</h2>

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

    <div class="field is-grouped" style="display:flex">
      <div class="field has-addons control" style="flex:1">
        <p class="control app-control" style="width:100%">
          <span class="select app-select">
            <select ref="jsonField">
              <option value="page" selected>Page</option>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
              <option value="website">Website</option>
            </select>
          </span>
        </p>
        <p class="control app-control">
          <a :class="[ 'button', 'is-primary' ]" @click="loadJson">
            <span>Load</span>
          </a>
        </p>
      </div>
      <div class="field control">
        <p class="control">
          <a :class="[ 'button', 'is-primary' ]" @click="saveJson">
            <span>Save</span>
          </a>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import DynamicField from '../DynamicField'

export default {
  name: 'EditJson',

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
    }
  },

  computed () {

  },

  methods: {
    loadJson () {

    },

    saveJson () {

    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.edit-json
  width: 100%
  height: 100%
</style>
