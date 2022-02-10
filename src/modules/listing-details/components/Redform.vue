<template>
<div class="redform">
  <div class="redform__inner" ref="form">
    <div class="loader" ref="loader"></div>
  </div>
</div>
</template>

<script>
import constants from 'listing-details@/config/constants'
const postscribe = process.browser ? require('postscribe') : false

export default {
  props: ['formID', 'spaceID', 'extraData'],

  mounted () {
    this.postscribe()
  },

  updated () {
    this.postscribe()
  },

  computed: {
    embedCode () {
      const { formID, spaceID, extraData } = this.$props
      const formUrl = constants.config.api.redforms.url
      const elID = formID.includes('stock/') ? formID.substring(6) : formID

      if (extraData) {
        const data = JSON.stringify(extraData)
        /*eslint-disable */
        return `<script src='${formUrl}${spaceID}/embed/${formID}.js' onload='redformsAPI.ajaxify("#redforms-${elID}");redformsAPI.extra_data(${data})'><\/script>`
        /*eslint-enable */
      }

      /*eslint-disable */
      return `<script src='${formUrl}${spaceID}/embed/${formID}.js' onload='redformsAPI.ajaxify("#redforms-${elID}")'><\/script>`
      /*eslint-enable */
    }
  },

  methods: {
    postscribe () {
      if (process.browser) postscribe(this.$refs.form, this.embedCode, this.ready)
    },

    ready () {
      const { form, loader } = this.$refs

      loader.style.display = 'none'

      const submit = form.querySelector('button[type=submit]')
      submit.classList.add('button', 'is-primary', 'var--gus-button')

      const labels = form.querySelectorAll('label')
      labels.forEach(el => el.classList.add('form-label', 'var--gus-text-soft'))

      const inputs = form.querySelectorAll('input, textarea, select')
      inputs.forEach(el => el.classList.add('form-input', 'var--gus-input'))
    }
  }
}
</script>

<style lang="sass">
.redform
  padding: 0
  box-shadow: none
  background-color: transparent

  .form-group
    margin: 0 0 1rem 0
    padding: 0

  .form-label
    display: inline-block
    font-size: 14px
    margin-bottom: 0.25rem

  .form-input
    &:focus
      outline: none

  form
    background-color: transparent
    padding: 0
    border: none
    color: inherit

  input,
  select,
  button,
  textarea
    background: transparent
    border-radius: inherit
    text-shadow: none
    box-shadow: none !important
    width: 100% !important

    &:focus
      box-shadow: none !important

  input,
  select
    height: 46px
    line-height: 46px
    width: 100%
    border: solid 1px
    font-size: 16px
    padding: 0 0.75rem
    background-image: none

  textarea
    width: 100%
    min-height: 6 * 1.4rem
    font-size: 16px
    padding: 0.5rem
    background-image: none

  img[src*="powered_by_redman.png"]
    display: none

  .controls
    text-align: right

    button
      padding: 0 1.5rem
      height: 46px
      background: red
      border: none
      font-size: 16px
      font-family: inherit

  .loader
    margin: 50px auto

</style>
