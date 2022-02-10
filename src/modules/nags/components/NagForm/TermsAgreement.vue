<template>
  <div>
    <header class="nagform__header">
      <h2 class="nagform__title var--gus-title">Terms of Service</h2>
      <p class="nagform__subtitle">To continue you must agree to the following Terms of Service:</p>
      <hr class="nagform__hr" />
    </header>

    <main class="nagform__main">
      <p class="nagform__label var--gus-light-text">Terms of Service</p>
      <div class="terms-of-service">
        <div class="content">
          <markdown-renderer :markdown="terms"/>
        </div>
      </div>
    </main>

    <footer class="nagform__footer">
      <button type="button" @click="cancel" class="nagform__cancel var--gus-border-primary var--gus-light-text">Cancel</button>
      <button type="button" @click="submit" class="nagform__submit var--gus-bg-primary" :disabled="readyState !== 'ready'">Accept</button>
    </footer>
  </div>
</template>

<script>
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

export default {
  name: 'nagformTermsAgreement',

  props: ['readyState'],

  components: {
    MarkdownRenderer
  },

  computed: {
    terms: function () {
      let rawTerms = this.$store.getters.message('termsOfService')

      if (store.state.gus.config.termsAndConditionsDisplay) {
        let termsAndConditionName = store.state.gus.config.termsAndConditionsDisplay.termsAndConditionName
        let termsAndConditionDisplayLevel = store.state.gus.config.termsAndConditionsDisplay.termsAndConditionDisplayLevel

        if (termsAndConditionName && termsAndConditionDisplayLevel) {
          return rawTerms.replace(/{{termsAndConditionsName}}/g, termsAndConditionName).replace(/{{termsAndConditionDisplayLevel}}/g, termsAndConditionDisplayLevel)
        }
      }
      return rawTerms
    }
  },

  methods: {
    cancel: function () {
      this.$emit('cancel')
    },

    submit: function () {
      this.$store.dispatch('agreeToTerms')
    }
  }
}
</script>
