<template>
  <form class="auth-content" id="login" @submit="submit">

    <h2 class="auth-content__title">Welcome</h2>
    <p class="auth-content__instructions">Please login or sign up.</p>
    <p class="auth-content__info">Get <strong>real-time information</strong> on properties that suit your needs! </p>

    <div class="welcome-icons">
      <div class="icon is-soft icon-home4"></div>
      <div class="icon is-soft icon-heart"></div>
      <div class="icon is-soft icon-bag-dollar"></div>
    </div>

    <p class="auth-content__info">We'll notify you daily of <strong>new listings and price changes</strong>.</p>

    <slot></slot>

    <Email id="login-email" @change="emailChange" :availableStyles="availableStyles" />

    <LoginPassword id="login-password" @change="passwordChange" :passwordWrong="passwordWrong" :availableStyles="availableStyles">
      <p v-if="passwordWrong" class="auth__validation-msg var--gus-bg-primary">Incorrect password</p>
    </LoginPassword>

    <p class="auth-content__forgot-password-wrapper">
      <a href="#forgot-password" @click="setView('ForgotPassword')" class="auth-content__forgot-password">Forgot your password?</a>
    </p>

    <footer class="auth-content__actions">
      <button type="submit" class="button auth-button" :class="isLoading ? 'is-loading': '' " :disabled="disabled" :style="availableStyles.bgPrimary">Login</button>
    </footer>

  </form>
</template>

<script>
import Vue from 'vue'
import Email from './Fields/Email'
import Cookies from 'js-cookie'
import LoginPassword from './Fields/LoginPassword'
import { login } from '../utils'

export default {
  name: 'loginForm',

  props: [
    'config',
    'availableStyles'
  ],

  components: {
    Email,
    LoginPassword
  },

  data () {
    return {
      email: '',
      emailValid: false,
      password: '',
      passwordWrong: false,
      isLoading: false
    }
  },

  computed: {
    disabled () {
      return !(this.emailValid && this.password.length) || this.isLoading
    }
  },

  methods: {
    setView (view) {
      this.$emit('setView', view)
    },

    emailChange (newValue, valid) {
      this.email = newValue
      this.emailValid = valid
    },

    passwordChange (newValue) {
      this.password = newValue
      this.passwordWrong = false
    },

    submit (e) {
      this.$set(this, 'isLoading', true)
      e.preventDefault()

      login(this.config, this.email, this.password)
      .then(profile => {
        const { id_token: idToken } = profile

        Cookies.set('idToken', idToken, { expires: Infinity })
        Vue.set(this.$store.state.config, 'clientIdToken', idToken)

        this.$set(this, 'isLoading', false)
        this.$emit('login', idToken)
      })
      .catch(() => {
        this.$set(this, 'isLoading', false)
        this.passwordWrong = true
      })

      return false
    }
  }
}
</script>

<style scoped lang="sass">
.auth-content__info
  font-size: 0.875rem
  margin-top: 0.5em

.welcome-icons
  text-align: center
  font-size: 1.5em

  .icon
    margin: 0 5px 0 5px

</style>
