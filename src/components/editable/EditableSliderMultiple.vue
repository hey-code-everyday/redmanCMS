<template>
  <editable-component
    tag="div"
    :value="value"
    :keyName="keyName"
    :schema="schema"
    class="editable-slider-multiple"
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
        <span class="gus-range__label-min">{{minLabel}}</span>
        <span class="gus-range__label-max">{{maxLabel}}</span>
      </div>
    </div>
  </editable-component>
</template>

<script>
import Color from 'color'
import filters from '@/filters'
import EditableComponent from '@/components/EditableComponent'
import ClientOnly from '@/components/ClientOnly'
import mixinEditableComponent from '@/mixins/editable-component'

let VueSlider = { render (h) { return h('div') } }
if (process.browser) {
  VueSlider = require('vue-slider-component')
}

export default {
  name: 'EditableSliderMultiple',

  mixins: [mixinEditableComponent],

  props: {
    label: { type: String, default: '$1 - $2' },
    theme: { type: String, default: 'default' }
  },

  components: {
    VueSlider,
    EditableComponent,
    ClientOnly
  },

  data () {
    return {
      sliderValue: [ this.value.initialStart, this.value.initialEnd ]
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

    minLabel () {
      return '$' + filters.bigNumber(this.value.min)
    },

    maxLabel () {
      return '$' + filters.bigNumber(this.value.max) + '+'
    },

    labelText () {
      return this.label
        .replace('%1%', filters.bigNumber(this.sliderValue[0] ? this.sliderValue[0] : 200000))
        .replace('%2%', filters.bigNumber(this.sliderValue[1] ? this.sliderValue[1] : 600000))
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
            key: 'initialStart',
            type: 'number',
            label: 'Initial Start Value',
            default: 0,
            placeholder: '0',
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            step: 1
          },
          {
            key: 'initialEnd',
            type: 'number',
            label: 'Initial End Value',
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

.gus-range__label-max
  position: absolute
  right: 0
</style>
