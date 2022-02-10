<template>
  <form class="auth-content" id="forgot-password" @submit="onSubmit">

    <h2 class="auth-content__title">Forgot password</h2>
    <p class="auth-content__instructions">Please enter your email address. We will send you an email to reset your password.</p>

    <Email id="forgot-password-email" @change="onChange" :availableStyles="availableStyles" />

    <p class="help var--gus-primary">{{message}}</p>

    <footer class="auth-content__actions">
      <button type="submit" class="button auth-button" :disabled="!emailValid" :style="availableStyles.bgPrimary">Reset</button>
      <button type="button" class="button auth-button" @click="() => setView('Login')" :style="availableStyles.primary">Back</button>
    </footer>

  </form>
</template>

<script>
import Email from './Fields/Email'
import {forgotPassword} from '../utils'

export default {
  name: 'ForgotPassword',

  props: ['config', 'availableStyles'],

  data: function () {
    return {
      emailValue: '',
      emailValid: false,
      message: ''
    }
  },

  methods: {
    setView: function (view) {
      this.$emit('setView', view)
    },

    onChange: function (value, valid) {
      this.emailValue = value
      this.emailValid = valid
    },

    onSubmit: function (e) {
      e.preventDefault()
      forgotPassword(this.config, this.emailValue).then(res => {
        this.message = res
      }).catch(err => {
        console.error(err)
      })
      return false
    }
  },

  components: {
    Email
  }
}

</script>
