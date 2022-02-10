<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-slider"
    @change="$editableComponent_change"
  >
    <div class="field">
      <!-- <label class="label">Area</label> -->
      <div class="control slider__outer">
        <div class="slider__label">{{ labelText }}</div>
        <client-only>
          <vue-slider
            ref="slider"
            v-model="sliderValue"
            tooltip="false"
            :dotSize="20"
            :min="value.min"
            :max="value.max"
            :interval="value.interval"
            :bgStyle="{ backgroundColor: bgColor }"
            :processStyle="{ backgroundColor: palette.uiPrimary.bgColor }"
          ></vue-slider>
        </client-only>
      </div>
    </div>
  </editable-component>
</template>

<script>
import Color from 'color'
import filters from '@/filters'
import ClientOnly from '@/components/ClientOnly'
import EditableComponent from '@/components/EditableComponent'
import mixinEditableComponent from '@/mixins/editable-component'

let VueSlider = { render (h) { return h('div') } }
if (process.browser) {
  VueSlider = require('vue-slider-component')
}

export default {
  name: 'EditableSlider',

  mixins: [mixinEditableComponent],

  props: {
    label: { type: String, default: '$1' },
    theme: { type: String, default: 'default' }
  },

  components: {
    ClientOnly,
    VueSlider,
    EditableComponent
  },

  data () {
    return {
      sliderValue: this.value.initial
    }
  },

  watch: {
    sliderValue (newValue){
      this.$emit('onValueChanged', newValue)
    }
  },

  computed: {
    palette () {
      return this.$store.getters.palette(this.theme)
    },

    bgColor () {
      return Color(this.palette.text).alpha(0.25).string()
    },

    schema () {
      return {
        title: 'Slider',
        canDelete: false,
        fields: [
          {
            key: 'min',
            type: 'number',
            label: 'Minimum',
            default: 0,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'max',
            type: 'number',
            label: 'Maximum',
            default: 100,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'initial',
            type: 'number',
            label: 'Initial Value',
            default: 0,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'interval',
            type: 'number',
            label: 'Increment Amount',
            default: 1,
            placeholder: '0',
            minValue: 1,
            maxValue: Number.MAX_VALUE,
            step: 1
          }
        ]
      }
    },

    labelText () {
      const value = this.sliderValue
      return this.label.replace('%1%', filters.bigNumber(value))
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.field
  width: 100%

.slider__outer
  margin: 0 -8px

.slider__label
  padding: 2px 8px 0 8px
  margin: 0
  text-align: center
  font-size: 15px
</style>
