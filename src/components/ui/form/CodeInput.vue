<template>
<div class="app-control control">
  <textarea
    :class="`textarea app-input ${field.code ? 'is-code' : ''}`"
    type="text"
    :placeholder="field.placeholder"
    :value="value"
    :tabIndex="tabIndex"
    ref="input"
    @blur="onChange($event.target.value)"
    @keyup="onChange($event.target.value)"
    @change="onChange($event.target.value)"
  >
  </textarea>
</div>
</template>

<script>
import mixinField from '@/mixins/field'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: String,
      required: true
    },

    lang: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      debounce: null
    }
  },

  methods: {
    onChange (value) {
      const { lang } = this

      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        const newValue = (this.$refs.input && this.$refs.input.value) || value

        let valid = false
        let error = 'Invalid code.'

        if (lang === 'javascript') {
          try {
            eval(newValue)
            valid = true
          } catch (e) {
            error = e.message
          }
        }

        if (valid) this.change(newValue)
        else {
          this.$store.dispatch('showNotification', { type: 'error', message: error })
        }
      }, 200)
    }
  }
}
</script>

<style lang="sass" scoped>
textarea
  &.is-code
    font-family: monospace !important
    font-size: 14px
    letter-spacing: -1px
</style>
