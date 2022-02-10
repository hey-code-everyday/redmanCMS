<template>
<div class="redform" :class="`is-${size}`">
  <div class="redform__inner" ref="form">
    <div class="loader" ref="loader"></div>
  </div>
</div>
</template>

<script>
import constants from '@/constants'
const postscribe = process.browser ? require('postscribe') : false

export default {
  name: 'Redform',

  props: {
    size: { type: String, default: 'small' },
    formID: { type: String, required: true },
    spaceID: { type: String, required: true },
    extraData: { type: Object },
    onSubmit: { type: Function },
    messagePlaceholder: { type: String },
    subject: { type: String }
  },

  computed: {
    embedCode () {
      const { formID, spaceID, extraData } = this.$props
      const formUrl = constants.redformsUrl
      const elID = formID.includes('stock/') ? formID.substring(6) : formID

      const fn = `function () { var event = new Event("${this.eventName}"); window.dispatchEvent(event); }`

      /*eslint-disable */
      if (extraData) {
        const data = JSON.stringify(extraData)
        return `<script src='${formUrl}${spaceID}/embed/${formID}.js' onload='redformsAPI.ajaxify("#redforms-${elID}", ${fn});redformsAPI.extra_data(${data})'><\/script>`
      } else {
        return `<script src='${formUrl}${spaceID}/embed/${formID}.js' onload='redformsAPI.ajaxify("#redforms-${elID}", ${fn})'><\/script>`
      }
      /*eslint-enable */
    },

    eventName () {
      return 'formClosed_' + this.$props.formID
    }
  },

  methods: {
    postscribe () {
      if (process.browser) {
        this.$refs.form.innerHTML = ''
        postscribe(this.$refs.form, this.embedCode, this.ready)
      }
    },

    ready () {
      const { form, loader } = this.$refs

      loader.style.display = 'none'

      const submit = form.querySelector('button[type=submit]')
      submit.classList.add('strap-button', 'button', 'is-primary')

      const labels = Array(form.querySelectorAll('label'))
      labels.forEach(el => (el.className += ' form-label is-soft'))

      const inputs = Array(form.querySelectorAll('input, textarea, select'))
      inputs.forEach(el => (el.className += ' form-input'))

      if (this.messagePlaceholder)
        form.querySelector('#message').value = this.messagePlaceholder
      if (this.subject)
        form.querySelector('#subject').value = this.subject
    },

    onFormSubmit () {
      if (this.onSubmit) this.onSubmit()
    }
  },

  created () {
    if (!process.browser) return
    window.addEventListener(this.eventName, this.onFormSubmit)
  },

  destroyed () {
    if (!process.browser) return
    window.removeEventListener(this.eventName, this.onFormSubmit)
  },

  mounted () {
    this.postscribe()
  },

  updated () {
    this.postscribe()
  },

  watch: {
    formID () {
      this.postscribe()
    }
  }
}
</script>

<style lang="sass">
@import '../assets/sass/variables'

.redform
  padding: 0
  box-shadow: none
  background-color: transparent
  .type-checkboxConsent
    input
      float: left
      width: auto !important
      height: auto !important
      margin-top: 0.25rem
    p
      margin-left: 1.25rem
  .form-group
    margin: 0 0 2rem 0
    padding: 0
    &.type-submit
      margin: 0
    &.type-radioMultiple
    &.type-checkboxMultiple
      > .form-label
        font-weight: bold
        margin-bottom: 0.5rem
  .form-label,
  .form-group > label
    display: inline-block
    font-size: 16px
    margin-bottom: 0.25rem
    opacity: 1 !important
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
      border: none
      font-size: 16px
      font-family: inherit
  .loader
    margin: 50px auto
  h3
    font-weight: bold
    font-size: 120%
    margin-bottom: 0.5rem
  .help-block
    font-size: 12px
    margin-top: 0.2rem
    opacity: 0.6
  .radio,
  .checkbox
    width: 100%
    + .radio,
    + .checkbox
      margin-left: 0
    label.radio,
    label.checkbox,
    .form-label.radio,
    .form-label.checkbox
      line-height: 36px
      height: 36px
      input[type="radio"],
      input[type="checkbox"]
        width: auto !important
        height: auto !important
        margin-right: 0.2rem
        display: inline-block
        line-height: 36px
        height: 36px
  .form-input.type-checkboxConsent
    width: 100%
    .form-label.checkbox
      display: flex
      flex-direction: row
      line-height: 36px
      p
        line-height: 1.4
        margin-top: -0.3rem
      input[type="checkbox"]
        width: auto !important
        height: auto !important
        margin-right: 0.4rem
        display: inline-block
        line-height: 36px
        height: 36px
  .type-captcha
    position: relative
    .control-label
      position: absolute
      pointer-events: none
      top: 6px
      left: 10px
    input
      padding-left: 110px
  .page-progress
    position: relative
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    margin-bottom: 2rem
    &:before
      position: absolute
      content: ''
      z-index: 0
      top: 50%
      left: 0
      right: 0
      height: 1px
      box-shadow: 0 0 0 4px inset
      opacity: 0.2
    .progress-step
      position: relative
      z-index: 1
      display: flex
      justify-content: center
      align-items: center
      flex: 1
      display: inline-flex
      .progress-label
        padding: 2px 10px
        border-radius: 50px
        border: solid 1px
        font-size: 14px
        text-transform: uppercase
        letter-spacing: 1px
  .btn.navigation
    position: relative
    text-transform: capitalize
    border-color: inherit
    font-color: inherit
    margin-bottom: 1rem
    font-size: 14px
  .title-wrap
    margin-bottom: 1rem
    font-weight: bold

+with-palette
  .redform
    input,
    select,
    textarea
      border-color: RGBA(var(--#{$palette}-text-rgb), 0.5)
    .page-progress
      .progress-step
        .progress-label
          color: var(--#{$palette}-text)
          background: var(--#{$palette}-bgColor)
        &.active
          .progress-label
            color: var(--#{$palette}-uiPrimary-text)
            background: var(--#{$palette}-uiPrimary-bgColor)

.var--app-feature
  .type-captcha
    filter: brightness(0) invert(1)

.redform.is-small
  .form-group
    margin-bottom: 1rem
  .form-label,
  .form-group > label
    font-size: 14px
  input,
  select
    height: 36px
    line-height: 36px
    font-size 16px
</style>
