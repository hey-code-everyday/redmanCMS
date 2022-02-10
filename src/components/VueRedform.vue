<template>
  <div class="vue-redform">
    <div class="vue-redform-inner"  ref="form">
      <div v-if="loading" class="loading">
        <div class="loader" ref="loader"></div>
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else class="fields" >
        <form ref="form" @submit="submit" >

          <div class="field" v-for="(field, i) in fields" :key="'field'+i">

            <div class="control bottom-space" >
              <!-- text -->
              <input v-if="field.label == 'Phone'" :placeholder="field.label"  class="input" type="phone" :name="field.id" :required="field.required" pattern="^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$">
              <input v-else="field.type === fieldType.text" :placeholder="field.label"  class="input" type="text" :name="field.id" :required="field.required" :pattern="field.regex">

              <!-- text area -->
              <textarea style="min-height:4rem; max-height:8rem;" class="textarea" :placeholder="field.label" v-else-if="field.type === fieldType.textarea" :name="field.id" :id="field.id" :required="field.required" :pattern="field.regex">{{ defaultMsg }}</textarea>

              <!-- select -->
              <div v-else-if="field.type === fieldType.select">
                <label class="label">{{ field.label }}</label>
                <div class="select">
                  <select :name="field.id" :required="field.required">
                    <option v-for="(opt, i) in field.options" :key="'opt'+i" :value="opt" :disabled="opt === '--Select--'">
                      {{ opt }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="field" v-if="captchaUrl">
            <div class="field has-addons">
              <p class="control full-width">
                <input ref="captcha" class="input" type="text" placeholder="Are you human? Enter the numbers">
              </p>
              <p class="control">
                <a class="button is-static">
                  <img :src="captchaUrl" alt="Captcha" />
                </a>
              </p>
            </div>
          </div>

          <br />
          <div class="field">
            <div class="control">
              <button class="full-width" :disabled="submitting" :class="{ 'button': true, 'is-primary': true, 'is-loading': submitting }">
                Send
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '@/api'
import Cookies from 'js-cookie'

export default {
  name: 'VueRedform',

  props: {
    formID: {
      type: String,
      required: true
    },
     defaultMsg: {
      type: String,
      required: false
    },


    extraData: {
      type: Object
    },

    onSubmit: {
      type: Function
    }
  },

  data () {
    return {
      error: undefined,
      fields: [],
      viewID: undefined,
      captchaUrl: undefined,
      loading: true,
      submitting: false 
    
    }
  },

  computed: {
    fieldType () {
      return {
        text: 'Text Input',
        textarea: 'Text Area',
        select: 'Select Basic'
      }
    },

    safeFormID () {
      return this.formID.replace('stock/', '')
    }
  },

  methods: {
    fetchForm () {
      api
        .getFormFields(this.$store.state, this.safeFormID)
        .then(res => {
          this.$set(this, 'fields', res.body.fields)
          this.$set(this, 'viewID', res.body.viewId)

          if (res.body.hasCaptcha) {
            this.$set(this, 'captchaUrl', res.body.captchaUrl)
          }

          this.loading = false
        })
        .catch(err => {
          this.error = err
        })
    },

    submit (evt) {
      evt.preventDefault()

      const formData = new FormData(this.$refs.form)
      const formObj = {}
      for (const [ key, value ] of formData.entries()) {
        formObj[key] = value
      }
      if (process.browser) {
        if (window && window.location && window.location.href) formObj.page = window.location.href
      }
      const payload = {
        submission: formObj,
        extra_data: this.extraData,
        viewId: this.viewID
      }

      if (this.captchaUrl) {
        payload.captcha = this.$refs.captcha.value
      }

      this.submitting = true

      api
        .submitForm(this.$store.state, this.safeFormID, payload)
        .then(res => {
          Cookies.set('idToken', res.body.id_token, { expires: Infinity })

          this.$store.commit('SET_CLIENT_ID_TOKEN', res.body.id_token)
          Vue.set(this.$store.state.gus, 'idToken', res.body.id_token)

          this.$store.dispatch('showNotification', { message: 'Thank you! Your message has been sent.', type: 'branded' })

          api
            .getFavorites(this.$store.state, { extra: 'address' })
            .then(res => {
              Vue.set(this.$store.state.gus, 'faves', res.body)
              Vue.set(this.$store.state.gus, 'userLoadState', 2)

              if (this.onSubmit) this.onSubmit()

              this.submitting = false
            })
            .catch(err => {
              this.error = err
              this.submitting = false
            })
        })
        .catch(err => {
          this.error = err
          this.submitting = false
        })
    }
  },

  created () {
    this.fetchForm()
  }
}
</script>

<style lang="sass">
@import '../assets/sass/variables'

.vue-redform
  +mobile
    padding: 50px 10px 0 10px

.loading
  display: flex
  .loader
    margin: auto

.bottom-space
  margin-bottom: 2rem

.label-color
  font-color: #424242

.full-width
  width: 100%

</style>
