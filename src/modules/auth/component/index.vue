<template>
  <div class="modal is-active gus-layer-panel gus-layer-panel--auth">
    <div class="modal-background layer-bg" @click="requestClose"></div>
    <div class="modal-content auth layer-fg">

      <div v-if="!hideClose" class="auth__close-wrapper">
        <button type="button" class="is-large auth__close delete" @click="requestClose"></button>
      </div>
      <component :is="view" @setView="setView" @login="onLogin" :config="config" :availableStyles="availableStyles">
        <div class="tabs is-centered var--gus-primary var--gus-border-primary">
          <ul>
            <li :class="{'is-active': view === 'Login'}"><a @click="() => { setView('Login') }">Login</a></li>
            <li :class="{'is-active': view === 'Signup'}"><a @click="() => { setView('Signup') }">Sign Up</a></li>
          </ul>
        </div>
      </component>

    </div>
  </div>
</template>

<script>
import Login from './Login'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'
import TermsAndConditions from './TermsAndConditions'

export default {
  name: 'authRouter',

  props: ['auth0Config', 'spaceID', 'primaryColor', 'hideClose', 'voucherUrl'],

  data: function () {
    return {
      view: 'Login' // can also be 'Signup', 'ForgotPassword' or 'TermsAndConditions'
    }
  },

  computed: {
    config: function () {
      return {
        spaceID: this.spaceID,
        auth0: this.auth0Config,
        primaryColor: this.primaryColor,
        voucherUrl: this.voucherUrl
      }
    },
    availableStyles: function () {
      const primaryColor = this.primaryColor
      return {
        primary: {color: primaryColor, borderColor: primaryColor},
        bgPrimary: {color: 'white', backgroundColor: primaryColor}
      }
    }
  },

  methods: {
    setView: function (view) {
      this.view = view
    },
    onLogin: function (token) {
      this.$emit('login', token)
    },
    requestClose: function () {
      this.$emit('requestClose')
    }
  },

  components: {
    Login,
    Signup,
    ForgotPassword,
    TermsAndConditions
  }
}
</script>

<style lang="sass">
@import '../../../assets/sass/variables'

.auth
  position: relative
  max-width: 400px
  background: white
  color: #131313
  // adjustments for mobile:
  @media (max-width: 768px)
    max-height: none
    height: 100vh
    width: 100%
    top: 0
    right: 0
    bottom: 0
    left: 0
    max-width: 100vw
    margin: 0
    position: absolute
    display: flex
    flex-direction: column
    justify-content: space-around
    @media (max-height: 600px)
      justify-content: flex-start


// Generic overrides

.gus-layer-panel--auth.gus-layer-panel--auth
  @media (max-width: 768px)
    z-index: 1051

.auth a
  text-decoration: underline

.auth .tabs
  margin-left: -2rem
  margin-right: -2rem
  .tabs ul
    border-bottom-color: inherit !important
  a
    text-decoration: none
    color: inherit !important
  .is-active a
    border-bottom: 2px solid

.field--terms
  margin: 2em 0

.auth__field
  border: 1px solid rgba(#000, 0.3)
  margin-top: -1px
  margin-bottom: 0

.auth__label
  font-size: 0.875rem
  color: #666
  font-weight: 400
  display: block
  padding: 0.5rem 1rem 0

.auth__input
  border: none
  outline: none
  background: transparent
  box-shadow: none
  font-size: 1rem
  padding: 0 1rem 0.75rem
  width: 100%
  color: inherit
  &:-webkit-autofill
    -webkit-box-shadow: 0 0 0 30px white inset

.auth__validation-msg
  padding: 0.25em 1em
  position: relative
  font-size: 0.75rem
  line-height: 1.1
  &::before
    content: ' '
    display: block
    height: 1.2em
    width: 1.2em
    position: absolute
    left: 80%
    top: -0.5em
    background: inherit
    transform: rotate(45deg)
    z-index: -1

// components

.auth__close-wrapper
  position: absolute
  right: 20px
  top: 20px

.auth-content
  padding: 2rem
  +mobile
    padding: 10px

.auth-content__title
  font-size: 1.75rem
  margin: 1em 0 0
  line-height: 1.1
  +mobile
    margin-top: 0.5em
    font-size: 1.25rem

.auth-content__instructions
  font-size: 0.875rem
  margin: 0.25em 0 1rem
  color: #666

.auth-content__forgot-password-wrapper
  font-size: 0.875rem
  margin: 0.5em 0
  line-height: 1.1
  text-align: right

.field--terms .control
  font-size: 0.875rem

.auth-content__actions
  margin: 3rem -10px 1rem
  display: flex

.auth-button
  flex-grow: 1
  margin: 0 10px
  padding: calc(0.65em - 1px) 0
  height: auto
</style>
