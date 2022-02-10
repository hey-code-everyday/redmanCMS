<template>
  <component
    :is="currentView"
    :payload="payload"
    class="dynamic-component"
  />
</template>

<script>
import Vue from 'vue'

Vue.component('empty-dynamic-view', {
  template: '<div></div>'
})

export default {
  name: 'DynamicComponent',

  props: {
    template: {
      type: String,
      required: true
    },

    payload: {
      type: [Object, Array, String, Number, Boolean],
      required: false,
      default: false
    },

    tag: {
      type: String,
      required: false,
      default: 'div'
    },

    components: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      currentView: 'empty-dynamic-view',
      lastTemplate: ''
    }
  },

  methods: {
    changeView () {
      const {
        tag,
        _uid,
        template,
        components,
        lastTemplate
      } = this

      if (template === lastTemplate) return

      const name = 'dynamic-component' + _uid + Date.now()
      const options = {
        props: {
          payload: {
            type: Object,
            required: true,
            default: null
          }
        },
        data () {
          const { payload } = this.$props
          const keys = Object.keys(payload)

          const data = {}
          keys.forEach(key => {
            data[key] = payload[key]
          })

          return data
        },
        components
      }

      Vue.component(name, {
        template: `<${tag}>${template}</${tag}>`,
        ...options
      })

      this.currentView = name
      this.lastTemplate = template
    }
  },

  mounted () {
    this.changeView()
  },

  updated () {
    this.changeView()
  },

  watch: {
    tag () {
      this.changeView()
    },

    template () {
      this.changeView()
    }
  }
}
</script>

<style scoped lang="sass">
</style>
