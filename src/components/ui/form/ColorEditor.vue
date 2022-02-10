<template>
  <div class="color-editor app-control control ws-ui">

    <!-- Palette dropdown -->

    <div class="field">
      <div class="app-control control">
        <div class="app-select select">
          <select v-model="selectedPalette" @change="fields = []">
            <option value="header">Header</option>
            <option value="default">Default Strap</option>
            <option value="alternate">Alternate Strap</option>
            <option value="feature">Feature Strap</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Header Color -->

    <div v-if="selectedPalette === 'header'" class="field">
      <div class="app-control control header-color-editor">
        <div class="mock-header" :style="{ background: currentPalette.bgColor, color: currentPalette.text }">
          <div class="mock-strap-background is-editable" @click="edit([ 'bgColor' ])"></div>
          <div class="mock-header-inner">
            <div class="mock-masthead is-editable" :style="{ color: currentPalette.text }" @click="edit([ 'text' ])">Website Title</div>
            <div class="mock-nav">
              <div class="mock-nav-item is-editable" :style="{ color: currentPalette.linkText }" @click="edit([ 'linkText' ])">Dropdown <i class="icon-chevron-down"></i></div>
              <div class="mock-nav-item is-active is-editable" :style="{ background: currentPalette.brandBgColor, color: currentPalette.brandText }" @click="edit([ 'brandText', 'brandBgColor', 'brandBgColor2' ])">Dropdown Hover <i class="icon-chevron-down"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Strap Color -->

    <div v-else class="field">
      <div class="app-control control strap-color-editor">
        <div class="mock-strap" :style="{ background: currentPalette.bgColor }">
          <div class="mock-strap-background is-editable" @click="edit([ 'bgColor' ])"></div>
          <div class="mock-strap-inner">
            <div class="mock-strap-header">
              <div class="mock-title is-editable" :style="{ color: currentPalette.titleText }" @click="edit([ 'titleText' ])">Section Title</div>
              <div class="mock-accent is-editable" @click="edit([ 'accentColor' ])">
                <i :style="{ background: currentPalette.accentColor }"></i>
              </div>
            </div>
            <p class="mock-text is-editable" :style="{ color: currentPalette.text }" @click="edit([ 'text' ])">The quick brown fox jumps over the lazy dog.</p>
            <div class="mock-strap-footer">
              <div class="mock-button is-editable" :style="{ background: currentPalette.uiPrimary.bgColor, color: currentPalette.uiPrimary.text }" @click="edit([ 'uiPrimary.text', 'uiPrimary.bgColor' ])">Primary</div>
              <div class="mock-button is-editable" :style="{ background: currentPalette.uiSecondary.bgColor, color: currentPalette.uiSecondary.text }" @click="edit([ 'uiSecondary.text', 'uiSecondary.bgColor' ])">Secondary</div>
              <a class="mock-link is-editable" :style="{ color: currentPalette.linkText }" @click="edit([ 'linkText' ])">Link</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Picker UI -->

    <div class="picker-popover" v-if="fields.length">
      <div class="picker-popover__inner">
        <h4 class="title is-6" style="margin-bottom:1rem">Color Picker</h4>
        <div class="field is-grouped" v-for="(field, i) in fields" :key="field.key">
          <div class="control">
            <color-input v-if="field.type === 'color'" :field="field" :value="getValue(field)" @change="valueChanged($event, field)" />
          </div>
          <div class="control is-label">
            {{ field.label }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ColorInput from '@/components/ui/form/ColorInput'

export default {
  name: 'ColorEditor',

  components: {
    ColorInput
  },

  props: {
    props: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      fieldSets: {
        header: {
          bgColor: {
            type: 'color',
            label: 'Background'
          },
          text: {
            type: 'color',
            label: 'Text'
          },
          linkText: {
            type: 'color',
            label: 'Links'
          },
          brandText: {
            type: 'color',
            label: 'Dropdown text'
          },
          brandBgColor: {
            type: 'color',
            label: 'Dropdown background'
          },
          brandBgColor2: {
            type: 'color',
            label: 'Mobile nav gradient'
          }
        },
        strap: {
          text: {
            type: 'color',
            label: 'Text'
          },
          titleText: {
            type: 'color',
            label: 'Title'
          },
          linkText: {
            type: 'color',
            label: 'Links'
          },
          bgColor: {
            type: 'color',
            label: 'Background'
          },
          accentColor: {
            type: 'color',
            label: 'Accent'
          },
          'uiPrimary.text': {
            type: 'color',
            label: 'Primary text'
          },
          'uiPrimary.bgColor': {
            type: 'color',
            label: 'Primary background'
          },
          'uiSecondary.text': {
            type: 'color',
            label: 'Secondary text'
          },
          'uiSecondary.bgColor': {
            type: 'color',
            label: 'Secondary background'
          }
        }
      },
      fields: [],
      selectedPalette: 'header'
    }
  },

  computed: {
    currentPalette () {
      return this.$store.getters.palette(this.selectedPalette)
    },

    currentFieldset () {
      return this.selectedPalette === 'header' ? this.fieldSets.header : this.fieldSets.strap
    }
  },

  methods: {
    edit (keys) {
      const fieldSet = this.currentFieldset
      const fields = keys.map(key => {
        return {
          key,
          ...fieldSet[key]
        }
      })

      this.$set(this.$data, 'fields', fields)
    },

    valueChanged (newValue, field) {
      this.setValue(field, newValue)
    },

    getValue (field) {
      if (field.key.includes('.')) {
        const parts = field.key.split('.')
        const key = parts[1]
        const parent = parts[0]

        return this.currentPalette[parent][key]
      }

      return this.currentPalette[field.key]
    },

    setValue (field, value) {
      if (field.key.includes('.')) {
        const parts = field.key.split('.')
        const key = parts[1]
        const parent = parts[0]

        this.currentPalette[parent][key] = value
      } else {
        this.currentPalette[field.key] = value
      }

      this.$store.dispatch('setTheme', {
        palette: this.selectedPalette,
        theme: this.currentPalette
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.color-editor
  width: 100%
  height: 100%

.is-editable
  position: relative
  user-select: none
  &:after
    content: ''
    position: absolute
    z-index: 1
    cursor: pointer
    top: 0
    left: 0
    width: 100%
    height: 100%
    border: dotted 1px rgba($wsRed, 0)
    box-shadow: 0 0 0 3px rgba($wsRed, 0)
    border-radius: 2px
    transition: all 150ms ease-in-out
  &:hover:after
    border: dotted 1px $wsRed
    box-shadow: 0 0 0 3px rgba($wsRed, 0.2)

.mock-header
  padding: 0 1rem
  height: 60px
  border: solid 1px $wsBorder
  box-shadow: 0 4px 17px rgba($wsBorder, 0.2)
  border-radius: 3px
  display: flex
  align-items: center

.mock-header-inner
  position: relative
  z-index: 2
  display: flex
  align-items: center
  width: 100%
  pointer-events: none
  > *
    pointer-events: auto

.mock-nav,
.mock-masthead
  height: 36px
  line-height: 36px

.mock-nav
  margin-left: auto
  display: flex
  align-items: center

.mock-nav-item
  font-size: 16px
  padding: 0 0.75rem
  margin-left: 0.5rem
  i
    font-size: 12px
    margin: 4px 0 4px 4px
    opacity: 0.4
  &.is-active
    background: #dfdfdf
    border-radius: 2px
    i
      opacity: 0.6

.mock-masthead
  font-weight: bold
  font-size: 18px

.mock-strap
  display: block
  border: solid 1px $wsBorder
  box-shadow: 0 4px 17px rgba($wsBorder, 0.2)
  border-radius: 3px
  padding: 3rem 2rem
  font-size: 16px

.mock-strap-background
  position: absolute
  z-index: 1
  top: 0
  left: 0
  width: 100%
  height: 100%

.mock-strap-inner
  position: relative
  z-index: 2

.mock-strap-header
  display: flex

.mock-accent
  width: 27px
  height: 27px
  display: flex
  margin-left: 0.3rem
  i
    display: block
    width: 10px
    height: 10px
    background: #dfdfdf
    margin: auto
    border-radius: 100px

.mock-title
  font-size: 18px
  font-weight: bold

.mock-text
  margin-top: 0.5rem

.mock-strap-footer
  display: flex
  align-items: center
  margin-top: 1rem

.mock-button
  padding: 0 1rem
  height: 36px
  line-height: 36px
  background: #dfdfdf
  margin-right: 0.5rem
  border-radius: 2px

.mock-link
  text-decoration: underline
  padding: 0 0.5rem

.picker-popover
  position: relative
  border: solid 1px $wsBorder
  box-shadow: 0 4px 17px rgba($wsBorder, 0.2)
  border-radius: 3px
  &:before
    content: ''
    display: block
    position: absolute
    top: -.25rem
    left: 50%
    width: 2rem
    height: 2rem
    background: #fff
    transform: rotate(45deg)
    border-radius: 3px
    box-shadow: 2px 2px 9px rgba($wsBorder, 0.2)
    border: solid 1px $wsBorder

.picker-popover__inner
  width: 100%
  height: 100%
  padding: 1rem
  z-index: 1
  position: relative
  background: #fff
  border-radius: 3px
  .field.is-grouped
  .control.is-label
    color: $wsTextLight
    line-height: 36px
</style>
