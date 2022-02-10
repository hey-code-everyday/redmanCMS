<template>
  <div :class="`search-bar ${searchBarClass}`">
    <div class="dropdown is-active">
      <div class="dropdown-trigger">
        <div class="field">
          <p :class="`control has-icons-left has-icons-right ${(loading ? 'is-loading' : '')}`">
            <input
              ref="search"
              class="input"
              type="text"
              @keyup="doSearch"
              @change="doSearch"
              :style="{ backgroundColor }"
            >
            <span class="control__placeholder" v-if="!(curValue)">
              {{ placeholder }}
            </span>
            <span class="icon is-small is-left">
              <i class="icon-magnifier"></i>
            </span>
            <span v-if="$refs.search && $refs.search.value" class="icon is-small is-right" style="pointer-events:auto" @click="clearSearch">
              <button class="delete"></button>
            </span>
          </p>
        </div>
      </div>
      <div class="dropdown-menu" role="menu" v-if="list.length">
        <div class="dropdown-content">
          <template v-for="(category, i) in list">
            <div v-if="category.title" class="dropdown-item">
              <h5>{{ category.title }}</h5>
            </div>
            <a
              v-for="(item, k) in category.items"
              :href="item.href || false"
              class="dropdown-item"
              @click="onItemClicked(item)"
            >
              {{ item.label }}
              <template v-if="item.subtitle">
                <br/><small>Neighboorhood</small>
              </template>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    },

    background: {
      type: String,
      default: 'light'
    },

    onSearch: {
      type: Function,
      default (query, done) {
        done([
          {
            title: 'Title',
            items: [
              { label: 'Label', subtitle: 'Subtitle', foo: 'bar' }
            ]
          }
        ])
      }
    }
  },

  data () {
    return {
      loading: false,
      lastValue: '',
      curValue: '',
      list: []
    }
  },

  computed: {
    searchBarClass () {
      const background = this.background

      if (background === 'outlined') return 'is-outlined'
      return false
    },

    backgroundColor () {
      const background = this.background

      if (background === 'light') return '#f1f1f1'
      if (background === 'dark') return '#ffffff'
      if (background === 'outlined') return 'transparent'
    }
  },

  methods: {
    doSearch (e) {
      const value = e.target.value

      this.curValue = value

      if (!value) {
        this.clearSearch()
        return
      }

      if (value.length < 3) {
        return
      }

      if (value === this.lastValue) {
        return
      }

      this.loading = true
      this.lastValue = value

      this.onSearch(value, (list, err) => {
        if (err) {
          console.warn(err)
        } else {
          this.$set(this.$data, 'list', list)
        }

        this.loading = false
      })
    },

    clearSearch () {
      this.curValue = ''
      this.$refs.search.value = ''
      this.$set(this.$data, 'list', [])
      this.$emit('onSearchCleared')
    },

    onItemClicked (item) {
      this.$emit('onItemClicked', item)
      this.$refs.search.value = item.label
      this.$set(this.$data, 'list', [])
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.search-bar
  position: relative
  width: 100%

.input,
.field,
.control,
.dropdown,
.dropdown-menu,
.dropdown-trigger
  width: 100%

.control
  .input
    height: 52px
    padding-left: 3.25em
    padding-right: 3.25em
    border: none

    &:focus
      outline: none
      box-shadow: none

  .icon
    font-size: 24px
    &.is-left
      left: .125em
    &.is-right
      right: .125em

  &.is-loading
    &:after
      width: 2em
      height: 2em
    .icon
      &.is-right
        display: none

.dropdown-content
  background-color: transparent

.dropdown-item
  text-align: left
  line-height: 1.1

  h5
    font-weight: bold
    margin-bottom: 0.25em
    margin-top: 1em

  &:first-child
    h5
      margin-top: 0

  small
    opacity: 0.6

.control__placeholder
  position: absolute
  pointer-events: none
  top: 0
  left: 0
  width: 100%
  height: 100%
  font-size: 18px
  padding: 0 3.25rem
  line-height: 52px
  opacity: 0.6
  color: #333
  white-space: nowrap
  text-overflow: ellipsis
  overflow: hidden

  +tablet
    white-space: inherit
    text-overflow: inherit
    overflow: visible

.search-bar
  input:focus
    + .control__placeholder
        display: none

.search-bar.is-outlined
  .control__placeholder
    color: inherit
  .field
    position: relative
    &:after
      content: ''
      display: block
      position: absolute
      pointer-events: none
      top: 0
      left: 0
      width: 100%
      height: 100%
      border: solid 1px
      border-radius: 3px
      opacity: 0.25
  input
    box-shadow: none
    color: inherit
    &::placeholder
      color: inherit

.input
  color: var(--default-text)

.dropdown-content
  color: var(--default-text)
  background-color: var(--default-bgColor)

a.dropdown-item
  color: var(--default-text)
  &:hover
    color: var(--default-uiPrimary-text)
    background-color: var(--default-uiPrimary-bgColor)
</style>
