<template>
  <form class="auth-content" id="signup" @submit="submit">

    <h2 class="auth-content__title">Sign up</h2>
    <p class="auth-content__instructions">Fill out the form below to sign up.</p>

    <p class="auth-content__info">Get <strong>real-time information</strong> on properties that suit your needs! </p>
    
    <div class="welcome-icons">
      <div class="icon icon-home4"></div>
      <div class="icon icon-heart"></div>
      <div class="icon icon-bag-dollar"></div>
    </div>

    <p class="auth-content__info">We'll notify you daily of <strong>new listings and price changes</strong>.</p>

    <slot></slot>

    <Name id="signup-name"  @change="(value, isValid) => onChange('name', value, isValid)" :availableStyles="availableStyles" />
    <Email id="signup-email" @change="(value, isValid) => onChange('email', value, isValid)" :availableStyles="availableStyles">
      <p v-if="userExists || userFromDiffSite" class="auth__validation-msg var--gus-bg-primary">
        User already exists
        <a href="#forgot-password" @click="setView('ForgotPassword')" class="auth-content__forgot-password">Forgot your password?</a>
      </p>
    </Email>
    <Phone id="signup-phone"  @change="(value, isValid) => onChange('phone', value, isValid)" :availableStyles="availableStyles" />
 

    <div class="field field--terms">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" v-model="checked">
            I agree to the <a href='#terms-and-conditions' @click="setView('TermsAndConditions')">terms and conditions
            </a>
        </label>
      </div>
    </div>

    <footer class="auth-content__actions">
      <button type="submit" class="button auth-button" :class="isLoading ? 'is-loading' : ''" :disabled="disabled" :style="availableStyles.bgPrimary">Sign Up</button>
    </footer>

  </form>
</template>

<script>
import Vue from 'vue'
import Name from './Fields/Name'
import Email from './Fields/Email'
import Phone from './Fields/Phone'
import Cookies from 'js-cookie'
import Password from './Fields/SignupPassword'
import { signup } from '../utils'

export default {
  name: 'SignupForm',

  props: [
    'config',
    'availableStyles'
  ],

  components: {
    Name,
    Email,
    Phone,
    Password
  },

  data () {
    const initialValue = () => ({value: '', isValid: false})
    return {
      name: initialValue(),
      email: initialValue(),
      phone: initialValue(),
      password: '',
      checked: false,
      userExists: false,
      userFromDiffSite: false,
      isLoading: false
    }
  },

  computed: {
    termsHref () {
      const config = this.$store.state.config
      return `${config.termsUrl}?source=${config.sources[0]}`
    },

    disabled () {
      return !(this.name.isValid && this.email.isValid && this.phone.isValid &&   this.checked) ||
        this.userExists || this.userFromDiffSite || this.isLoading
    }
  },

  methods: {
    setView (view) {
      this.$emit('setView', view)
    },

    onChange (field, value, isValid) {
      this[field].value = value
      this[field].isValid = isValid

      if (field === 'email') {
        this.userExists = false
        this.userFromDiffSite = false
      }
    },

    submit (e) {
      this.$set(this, 'isLoading', true)
      e.preventDefault()

      const data = {
        name: this.name.value,
        email: this.email.value,
        phone: (this.phone.value).replace(/[^0-9\.]/g,""), //replaces if not a digit
        password: this.phone.value
      }

      signup(this.config, data)
      .then(profile => {
        const { id_token: idToken } = profile

        Cookies.set('idToken', idToken, { expires: Infinity })
        Vue.set(this.$store.state.config, 'clientIdToken', idToken)

        this.$set(this, 'isLoading', false)
        this.$emit('login', idToken)
      })
      .catch(err => {
        this.$set(this, 'isLoading', false)

        if (err && err.error) {
          if (err.error.toLowerCase() === 'forbidden'){
            this.userFromDiffSite = true
            return
          } else if (err.error.toLowerCase() === 'conflict') {
            this.userExists = true
            return
          } else {
            console.error(err)
          }
        }
        else {
          console.error(err)
        }
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
