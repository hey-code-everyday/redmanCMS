<template>
<div class="app-control control">

  <label>Family</label>

  <div class="field">
    <div class="dropdown is-active">
      <div class="dropdown-trigger">
        <input type="text" class="input app-input" @focus="familyFocus" @blur="familyBlur" v-model="search"  />
      </div>
      <div class="dropdown-menu" v-if="focused && filteredFonts">
        <div class="dropdown-content">
          <div class="dropdown-item" v-if="filteredFonts.length === 0">
            No results found for <em>"{{ this.search }}"</em>.
          </div>
          <a v-else class="dropdown-item" v-for="(f, i) in filteredFonts" :key="i" :value="f.family" @click="setFamily(f.family)" :style="{ fontFamily: f.family }">
            <v-style>
              @import url('//fonts.googleapis.com/css?family={{f.family}}')
            </v-style>
            {{ f.family }}
          </a>
          <hr class="dropdown-divider">
          <div class="dropdown-item">
            <small>
              Viewing {{ filteredFonts.length }} of {{ fonts.length }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div class="field">
        <label>Default Weight</label>
        <div class="select app-select">
          <select ref="weight" class="select app-select" @change="setWeight">
            <option v-for="(w, i) in weights" :key="i" :value="w" :selected="value.weight === w">
              {{ w.replace('i', ' (italic)') }}
            </option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Preview</label>
        <p class="font-preview" :style="previewStyle">
          A red flare silhouetted the jagged edge of a wing.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="field">
        <label>Weights to Load</label>
        <div class="select app-select is-multiple">
          <select multiple @change="setWeights" style="font-size:14px">
            <option v-for="(v, i) in getVariants(this.curFont)" :key="i" :value="v.value" :selected="weights.includes(v.value)">
              {{ v.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import Vue from 'vue'
import mixinField from '@/mixins/field'

const popsicle = require('popsicle')

Vue.component('v-style', {
  render (createElement) {
    return createElement('style', this.$slots.default)
  }
})

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      apiKey: 'AIzaSyD37HqVCCNb6NZbTzlRcqLtmpWHMAhxWGo',
      fonts: [],
      search: this.value.family,
      searchListLength: 10,
      focused: false,
      debounce: null
    }
  },

  computed: {
    weights () {
      return this.value.weights.split(',').map(w => w.trim())
    },

    curFont () {
      return this.fonts.find(font => font.family === this.value.family)
    },

    previewStyle () {
      let fontStyle = 'normal'
      if (this.value.weight.includes('i')) {
        fontStyle = 'italic'
      }

      return {
        fontStyle,
        fontFamily: this.value.family,
        fontWeight: this.value.weight.replace('i', '')
      }
    },

    filteredFonts () {
      let cur = 0
      const limit = this.searchListLength

      return this.search.length >= 1
        ? this.fonts.filter(font => font.family.toLowerCase().includes(this.search.toLowerCase()) && cur++ < limit)
        : false
    }
  },

  created () {
    const url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + this.apiKey
    popsicle
      .request(url)
      .use(popsicle.plugins.parse('json'))
      .then(res => {
        if (res.status !== 200 || !res.body.items) {
          return console.warn('Error fetching Google Fonts.')
        }

        this.$set(this.$data, 'fonts', res.body.items)
      })
      .catch(err => {
        console.warn(err)
      })
  },

  methods: {
    getVariants (font) {
      if (!font || !font.variants) return []

      return font.variants.map(v => {
        if (v === 'regular') return { value: '400', label: '400' }
        if (v === 'italic') return { value: '400i', label: '400 (italic)' }
        return { value: v.replace('italic', 'i'), label: v.replace('italic', ' (italic)') }
      })
    },

    setFamily (family) {
      const value = {
        ...this.value
      }
      value.family = family

      const font = this.fonts.find(font => font.family.toLowerCase() === family.toLowerCase())
      const variants = this.getVariants(font)

      const curWeight = variants.find(v => v.value === '400') || variants.find(v => v.value === '300') || variants.find(v => v.value === '500')
      value.weight = curWeight ? curWeight.value : variants[0].value
      value.weights = value.weight

      this.search = family
      this.focused = false

      this.change(value)
    },

    setWeight (e) {
      const value = {
        ...this.value
      }
      value.weight = e.target.value
      this.change(value)
    },

    setWeights (e) {
      const value = {
        ...this.value
      }

      const font = this.fonts.find(font => font.family.toLowerCase() === this.value.family.toLowerCase())
      const variants = this.getVariants(font)

      const selected = [ ...e.target.selectedOptions ]
      if (!selected.length) {
        value.weights = variants.map(v => v.value).join(',')
        const curWeight = variants.find(v => v.value === '400') || variants.find(v => v.value === '300') || variants.find(v => v.value === '500')
        value.weight = curWeight ? curWeight.value : variants[0].value
      } else {
        value.weights = selected.map(el => el.value).join(',')
        const curWeight = selected.find(v => v.value === '400') || selected.find(v => v.value === '300') || selected.find(v => v.value === '500')
        value.weight = curWeight ? curWeight.value : selected[0].value
      }

      this.change(value)
    },

    // onChange (value) {
    //   clearTimeout(this.debounce)
    //   this.debounce = setTimeout(() => {
    //     this.change((this.$refs.input && this.$refs.input.value) || value)
    //   }, 200)
    // },

    familyFocus () {
      this.focused = true
    },

    familyBlur () {
      setTimeout(() => {
        this.focused = false
      }, 100)
    }
  }
}
</script>

<style lang="sass" scoped>
.field,
.dropdown,
.dropdown-menu,
.dropdown-trigger
  width: 100%

label
  display: block
  font-size: 13px
  text-transform: uppercase
  margin-bottom: 0.25rem
  letter-spacing: 1px
  opacity: 0.6

a.dropdown-item
  color: inherit
</style>
