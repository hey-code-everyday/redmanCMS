<template>
  <span class="app-styles">
    <template v-for='s in styles'>{{s}}</template>
  </span>
</template>

<script>
let Stylex = null
if (process.browser) {
  Stylex = require('stylex-lib').default
}

// Utilities
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  name: 'AppStyles',

  props: {
    styles: {
      type: Object,
      required: true
    },

    schema: {
      type: Object,
      required: true
    }
  },

  methods: {
    updateStyles () {
      if (Stylex === null) return

      const { stylex } = this
      let { styles, schema } = this.$props

      for (let varname in schema) {
        const newStyle = {}
        const style = schema[varname]

        for (let key in style) {
          // prop: 'value'
          if (typeof style[key] === 'string') {
            newStyle[key] = styles[style[key]]
          }
          // prop: {}
          if (typeof style[key] === 'object') {
            newStyle[key] = clone(style[key])

            // nested: { props }
            if (typeof style[key].value === 'undefined') {
              for (let j in style[key]) {
                // nested: prop: 'value'
                if (typeof style[key][j] === 'string') {
                  newStyle[key][j] = styles[style[key][j]]

                // nested: prop: { value, literal }
                } else {
                  if (!style[key][j].literal) {
                    if (typeof style[key][j].value === 'function') {
                      newStyle[key][j].value = style[key][j].value(styles)
                    } else {
                      newStyle[key][j].value = styles[style[key][j].value]
                    }
                  }
                }
              }
            // prop: { value, literal }
            } else {
              if (!style[key].literal) {
                if (typeof style[key].value === 'function') {
                  newStyle[key].value = style[key].value(styles)
                } else {
                  newStyle[key].value = styles[style[key].value]
                }
              }
            }
          }
        }

        stylex.set(varname, newStyle)
      }
    }
  },

  created () {
    if (Stylex === null) return

    this.stylex = new Stylex()
    this.updateStyles()
  },

  updated () {
    if (Stylex === null) return

    this.updateStyles()
  }
}
</script>

<style lang="sass">
.app-styles
  visibility: hidden
  position: absolute
  top: -9000px
  left: -9000px
</style>
