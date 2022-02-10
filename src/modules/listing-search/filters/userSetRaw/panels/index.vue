<template>
  <component :is="component" :config="config" @change="onChange"></component>
</template>

<script>
import dropdown from './Dropdown'
import text from './Text'
import range from './Range'
import checkbox from './Checkbox'
import slider from './Slider'

export default {
  name: 'rawFieldPanel',

  props: ['config'],

  data () {
    const types = {
      text,
      dropdown,
      range,
      checkbox,
      slider
    }

    return {
      component: types[this.config.uiType]
    }
  },

  methods: {
    onChange: function (value) {
      const {config} = this
      if (value) {
        this.$store.commit('setRaw', [config.rawFieldName, value])
      } else {
        this.$store.commit('unsetRaw', config.rawFieldName)
      }
      this.$store.dispatch('submit')
    }
  }
}
</script>
