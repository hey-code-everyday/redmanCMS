<template>
  <div class="field">
    <label class="label" v-if="field.label">{{ field.label }}</label>

    <!-- HR -->
    <hr v-if="field.type === 'hr'" />

    <template v-if="!isHidden">

      <!-- Checkbox -->
      <template v-if="field.type === 'checkbox'">
        <Checkbox :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Dropdown -->
      <template v-if="field.type === 'dropdown'">
        <Dropdown :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Text input -->
      <template v-if="field.type === 'text'">
        <TextInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Multi-text input -->
      <template v-if="field.type === 'multiText'">
        <MultiTextInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Image input -->
      <template v-if="field.type === 'image'">
        <ImageInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Color input -->
      <template v-if="field.type === 'color'">
        <ColorInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Font input -->
      <template v-if="field.type === 'font'">
        <FontInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Number input -->
      <template v-if="field.type === 'number'">
        <NumberInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Read-only text -->
      <template v-if="field.type === 'readOnlyText'">
        <TextReadOnly :field="field" :value="fieldState(field.key)" :tabIndex="index" />
      </template>

      <!-- Gradient input -->
      <template v-if="field.type === 'gradient'">
        <GradientInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Background video -->
      <template v-if="field.type === 'backgroundVideo'">
        <BackgroundVideo :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Background image -->
      <template v-if="field.type === 'backgroundImage'">
        <BackgroundImage :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Background images -->
      <template v-if="field.type === 'backgroundImages'">
        <BackgroundImages :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- String list -->
      <template v-if="field.type === 'stringList'">
        <StringList :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" />
      </template>

      <!-- Button -->
      <template v-if="field.type === 'button'">
        <span class="button is-primary" @click="field.action($store)" :tabIndex="index">{{ field.text }}</span>
      </template>

      <!-- Javascript input -->
      <template v-if="field.type === 'javascript'">
        <CodeInput :field="field" :value="fieldState(field.key)" @change="formUpdated" :tabIndex="index" lang="javascript" />
      </template>

    </template>

    <template v-else>
      <div @click="isHidden = false" class="advanced-input">Advanced setting: Click to edit</div>
    </template>

    <p v-if="field.hint" class="help">{{ field.hint }}</p>
  </div>
</template>

<script>
import Checkbox from './form/Checkbox'
import Dropdown from './form/Dropdown'
import TextInput from './form/TextInput'
import FontInput from './form/FontInput'
import ColorInput from './form/ColorInput'
import ImageInput from './form/ImageInput'
import StringList from './form/StringList'
import NumberInput from './form/NumberInput'
import TextReadOnly from './form/TextReadOnly'
import GradientInput from './form/GradientInput'
import MultiTextInput from './form/MultiTextInput'
import BackgroundVideo from './form/BackgroundVideo'
import BackgroundImage from './form/BackgroundImage'
import BackgroundImages from './form/BackgroundImages'
import CodeInput from './form/CodeInput'

export default {
  name: 'DynamicField',

  props: {
    state: {
      type: Object,
      required: true
    },

    field: {
      type: Object,
      required: true
    },

    formUpdated: {
      type: Function
    },

    index: {
      type: Number,
      required: false,
      default: 0
    }
  },

  components: {
    Checkbox,
    Dropdown,
    TextInput,
    FontInput,
    ColorInput,
    ImageInput,
    StringList,
    NumberInput,
    TextReadOnly,
    GradientInput,
    MultiTextInput,
    BackgroundVideo,
    BackgroundImage,
    BackgroundImages,
    CodeInput
  },

  data () {
    return {
      isHidden: this.field.hidden ? this.field.hidden : false
    }
  },

  methods: {
    fieldState (str) {
      let state = this.$props.state

      const keys = str.split('.')
      keys.forEach(key => {
        if (state[key] !== undefined) {
          state = state[key]
        }
      })

      return state
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.field
  width: 100%

hr
  margin: 3rem 0

.advanced-input
  height: 36px
  line-height: 36px
  border: solid 1px rgba($wsTextLight, 0.6)
  padding: 0 10px
  font-size: 13px
  text-transform: uppercase
  text-align: center
  cursor: pointer
  color: $wsTextLight
  &:hover
    border-color: rgba($wsTextLight, 1)
    color: $wsText
</style>
