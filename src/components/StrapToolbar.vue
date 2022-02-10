<template>
  <div class="strap-toolbar">

    <!-- Main config -->
    <div class="strap-toolbar__inner ws-ui" :style="toolbarStyles">
      <div class="toolbar-button button is-primary" @click="openSettings">
        <span class="icon-hammer-wrench"></span>
      </div>
      <div class="toolbar-button is-secondary" @click="moveUp" v-if="strap.id !== 'hero' && strap.order !== 0">
        <span class="icon-arrow-up"></span>
      </div>
      <div class="toolbar-button is-secondary" @click="moveDown" v-if="strap.id !== 'hero' && strap.order !== $store.state.page.straps.length - 1">
        <span class="icon-arrow-down"></span>
      </div>
      <div class="toolbar-button is-secondary" @click="deleteStrap" v-if="strap.id !== 'hero'">
        <span class="icon-trash2"></span>
      </div>
      <div class="toolbar-button" @click="openInsertPanel" v-if="strap.id !== 'hero'">
        <span class="icon-plus"></span>
      </div>
    </div>

    <!-- Strap insert thing -->
    <div class="strap-insert-panel ws-ui" :style="panelStyles" v-if="strap.id !== 'hero'">
      <div class="field">
        <label class="label">Add a strap to the page</label>
        <p class="control app-control">
          <span class="select app-select" >
            <strap-dropdown @change="e => { selected = e }" />
          </span>
        </p>
        <p class="control submit-controls">
          <span :class="[ 'button', 'is-primary', (!selected ? 'is-disabled' : false)]" @click="doInsert">
            <span>Add It</span>
          </span>
          <span class="button" @click="cancelInsert">
            Nevermind
          </span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { kebabToCamel } from '@/util'
import StrapDropdown from '@/components/ui/StrapDropdown'
import strapConfigSchema from '../constants/schemas/strap-config'
import straps from '@/components/straps/straps'
import heroes from '@/components/heroes/heroes'
import createStrap from '@/store/defaults/strap'

export default {
  props: {
    strap: {
      type: Object,
      required: true
    }
  },

  components: {
    StrapDropdown
  },

  data () {
    return {
      open: false,
      selected: null
    }
  },

  computed: {
    straps () {
      return {
        original: this.reduceStraps('original')
      }
    },

    canMoveUp () {
      const order = this.$props.strap.order
      return order > 0
    },

    canMoveDown () {
      const numStraps = this.$store.state.page.straps.length
      const order = this.$props.strap.order
      return order < numStraps - 1
    },

    toolbarStyles () {
      let styles = {}

      if (this.open !== false) {
        styles = {
          transform: `translateX(-50%)`,
          opacity: 0,
          pointerEvents: 'none'
        }
      }

      return styles
    },

    panelStyles () {
      let styles

      if (this.open === false) {
        styles = {
          transform: `translateX(-50%)`,
          opacity: 0,
          pointerEvents: 'none'
        }
      } else {
        styles = {
          transform: `translateX(0%)`,
          opacity: 1,
          pointerEvents: 'auto'
        }
      }

      return styles
    }
  },

  methods: {
    insertFieldChanged (value) {
      this.insertWhat = value
    },

    openSettings () {
      const strap = this.$props.strap
      const name = kebabToCamel(strap.name)

      import(`./${strap.id === 'hero' ? 'heroes' : 'straps'}/${name}.vue`).then(component => {
        const schema = strapConfigSchema(strap)
        const additionalPanels = component.default.schema ? component.default.schema() : false

        if (additionalPanels) {
          schema.groups.push({
            key: 'strapAdditional',
            title: 'Additional Settings',
            panels: additionalPanels
          })
        }

        this.$store.commit('SHOW_STRAP_MODAL', { schema, strapId: strap.id })
      }).catch(e => {
        console.warn(e)
      })
    },

    moveUp () {
      const id = this.$props.strap.id
      this.$store.dispatch('moveStrapUp', id)
    },

    moveDown () {
      const id = this.$props.strap.id
      this.$store.dispatch('moveStrapDown', id)
    },

    deleteStrap () {
      const result = confirm('Are you sure you want to remove this strap?')
      if (!result) return

      const id = this.$props.strap.id
      this.$store.dispatch('deleteStrap', id)
    },

    openInsertPanel () {
      this.open = true
    },

    doInsert () {
      const name = this.selected
      const order = this.$props.strap.order + 1
      const palette = this.$store.getters.palette(this.strap.config.style.theme)
      const newStrap = createStrap(false, order, name, palette.uiPrimary.bgColor, palette.uiSecondary.bgColor)

      this.$store.dispatch('insertStrap', newStrap)

      this.open = false
    },

    cancelInsert () {
      this.open = false
    },

    reduceStraps (set) {
      const collection = this.strap.id === 'hero' ? heroes : straps

      const keys = Object.keys(collection)
      return keys.filter(k => {
        const s = collection[k]
        return !s.hidden && !s.hero && s.set === set
      }).reduce((obj, key) => {
        obj[key] = collection[key]
        return obj
      }, {})
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.strap-toolbar
  position: absolute
  z-index: 10

  width: 64px
  top: 0
  bottom: 0
  left: 0

.strap-toolbar__inner,
.strap-insert-panel
  transition: all 150ms ease-in-out

.strap-toolbar__inner
  position: absolute
  z-index: 9

  top: 20px
  left: 20px
  width: 64px

  background: $wsWhite

  border-radius: 3px
  box-shadow: 0 4px 17px rgba($wsTextLight, 0.4)

.strap-insert-panel
  position: absolute
  z-index: 10

  top: 20px
  left: 20px
  padding: 30px
  width: 300px

  background: $wsWhite

  border-radius: 3px
  box-shadow: 0 4px 17px rgba($wsTextLight, 0.4)

.toolbar-button
  text-align: center
  width: 100%
  height: 52px
  padding: 1rem 0
  user-select: none
  cursor: pointer
  border-bottom: solid 1px rgba($wsTextLight, 0.2)

  span
    display: block
    margin: 0 auto
    font-size: 24px
    color: $wsIcon

  &.is-primary
    border-radius: 3px 3px 0 0 !important
    background-color: $wsRed
    background-image: $wsUiGradient
    border-bottom: none
    box-shadow: none !important

    &:only-child
      border-radius: 3px !important

    span
      color: #fff

  &.is-secondary
    background-color: rgba($wsTextLight, 0.1)

  &:last-child
    border-bottom: none

.submit-controls
  margin-top: 12px
  display: flex

  .button
    margin-right: 6px
    width: auto
    flex: 1

    &.is-disabled
      opacity: 0.6
      pointer-events: none

    &:last-child
      margin-right: 0
</style>
