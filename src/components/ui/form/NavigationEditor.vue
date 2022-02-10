<template>
  <div class="navigation-editor app-control control ws-ui">
    <div class="columns">
      <div class="column is-nav">

        <div v-sortable="{ onEnd: reorder }">
          <div
            v-for="(navItem, i) in nav" :key="i+navItem.label"
            :class="[
              'navbar-item',
              (navItem.dropdown ? 'has-dropdown' : false),
              (selectedParent === i && selectedDropdown === null ? 'is-selected' : false),
              (selectedParent === i ? 'is-active' : false)
            ]"
          >
            <div @click="select(i)" class="navbar-link">
              {{ navItem.label }}
            </div>

            <div class="navbar-dropdown">
              <div v-sortable="{ onEnd: reorderDropdown(i) }">
                <a
                  v-for="(dropdownItem, k) in navItem.dropdown" :key="k+dropdownItem.label"
                  @click="selectDropdown(i, k)"
                  :class="[ 'navbar-item', (selected === dropdownItem ? 'is-selected' : false) ]"
                >
                  {{ dropdownItem.label }}
                </a>
                <hr class="navbar-divider" v-if="navItem.dropdown.length > 0">
              </div>
              <a class="navbar-item is-new" @click="addDropdownItem(i)">
                <span class="icon"><i class="icon-plus"></i></span>
                <span>Add Item</span>
              </a>
            </div>
          </div>
        </div>

        <a class="is-new" style="display: block; margin-top: 2rem" @click="addItem">
          <span class="icon"><i class="icon-plus"></i></span>
          <span>Add Item</span>
        </a>

      </div>
      <div class="column is-form">
        <div v-if="selected">
          <dynamic-field
            v-for="(field, i) in schema"
            :key="i"
            :field="field"
            :state="selected"
            :formUpdated="formUpdated"
            :index="i"
          />
          <div class="field">
            <div class="control">
              <div class="button is-primary" @click="deleteItem">
                <span class="icon">
                  <i class="icon-trash2"></i>
                </span>
                <span>Remove</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import DynamicField from '../DynamicField'

Vue.directive('sortable', {
  inserted: function (el, binding) {
    /* eslint-disable */
    if (process.browser) {
      const Sortable = require('sortablejs')
      Sortable.default.create(el, binding.value || {})
    }
    /* eslint-enable */
  }
})

export default {
  name: 'NavigationEditor',

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
      selectedParent: null,
      selectedDropdown: null,
      nav: this.$store.state[this.props.where].nav
    }
  },

  computed: {
    schema () {
      return [
        {
          key: 'label',
          type: 'text',
          label: 'Text',
          default: ''
        },
        {
          key: 'href',
          type: 'text',
          label: 'Link URL',
          default: ''
        },
        {
          key: 'linkOut',
          type: 'checkbox',
          label: 'Link Out',
          text: 'Open link in a new tab.',
          default: false,
          onValue: true,
          offValue: false
        }
      ]
    },

    selected () {
      if (this.selectedParent === null) return null

      return this.selectedDropdown !== null
        ? this.nav[this.selectedParent].dropdown[this.selectedDropdown]
        : this.nav[this.selectedParent]
    }
  },

  methods: {
    formUpdated (value, keyName) {
      const item = this.selectedDropdown !== null
        ? this.nav[this.selectedParent].dropdown[this.selectedDropdown]
        : this.nav[this.selectedParent]

      item[keyName] = value

      const { action } = this.$props.props
      this.$store.dispatch(action, this.nav)
    },

    select (index) {
      if (this.selectedParent === index && this.selectedDropdown === null) {
        this.selectedParent = null
        return
      }

      this.selectedParent = index
      this.selectedDropdown = null
    },

    selectDropdown (index, dropdownIndex) {
      this.selectedParent = index
      this.selectedDropdown = dropdownIndex
    },

    reorder ({ oldIndex, newIndex }) {
      const nav = this.nav
      const movedItem = nav.splice(oldIndex, 1)[0]
      nav.splice(newIndex, 0, movedItem)

      const { action } = this.$props.props
      this.$store.dispatch(action, nav)
    },

    reorderDropdown (index) {
      return ({ oldIndex, newIndex }) => {
        const nav = this.nav
        const dropdown = nav[index].dropdown
        const movedItem = dropdown.splice(oldIndex, 1)[0]
        dropdown.splice(newIndex, 0, movedItem)

        const { action } = this.$props.props
        this.$store.dispatch(action, nav)
      }
    },

    deleteItem () {
      const nav = this.nav

      if (this.selectedDropdown !== null) {
        nav[this.selectedParent].dropdown.splice(this.selectedDropdown, 1)
      } else {
        nav.splice(this.selectedParent, 1)
      }

      const { action } = this.$props.props
      this.$store.dispatch(action, nav)

      if (this.selectedDropdown === null) this.selectedParent = null
      this.selectedDropdown = null
    },

    addItem () {
      const nav = this.nav

      nav.push({
        label: 'Item',
        href: '/',
        linkOut: false,
        dropdown: []
      })

      this.selectedParent = this.nav.length - 1

      const { action } = this.$props.props
      this.$store.dispatch(action, nav)
    },

    addDropdownItem (index) {
      const nav = this.nav
      const dropdown = nav[index].dropdown

      dropdown.push({
        label: 'Item',
        href: '/',
        linkOut: false
      })

      this.selectedDropdown = dropdown.length - 1

      const { action } = this.$props.props
      this.$store.dispatch(action, nav)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.navigation-editor
  width: 100%
  height: 100%

.column
  &.is-form
    display: flex
    align-items: center
    justify-content: flex-start

    > div
      width: 100%

.navbar-dropdown
  position: relative

  .navbar-item
    color: $wsText

    &.is-new
      color: $wsRed

    &.is-selected
      color: #fff
      background-color: $wsRed

div.navbar-item
  flex-direction: column
  align-items: flex-start
  user-select: none
  margin-bottom: 1rem

.navbar-link
  box-shadow: 0 3px 7px rgba(#000, 0.2)
  border-radius: 3px
  cursor: pointer

  &:after
    border-color: $wsIcon

.navbar-item
  &.is-active
    .navbar-link
      box-shadow: 0 2px 4px rgba(#000, 0.2) inset
      border-radius: 3px 3px 0 0

  &.is-selected
    .navbar-link
      box-shadow: none
      background-color: $wsRed
      color: #fff

      &:after
        border-color: #fff

.button
  margin-top: 1rem
</style>
