<template>
  <div class="auth-content" id="terms-and-conditions">
    <header >
      <h2 class="auth-content__title">Terms of Service</h2>
      <p class="auth-content__instructions">To continue you must agree to the following Terms of Service:</p>
      <hr class="nagform__hr" />
    </header>

    <main class="auth-content__info">
      <div class="content">
        <markdown-renderer :markdown="terms"/>
      </div>
    </main>

    <footer class="auth-content__actions">
      <button class="button auth-button" :style="availableStyles.bgPrimary" @click="setView('Signup')">Back</button>
    </footer>
  </div>
</template>

<script>
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import Signup from './Signup'

export default {
  name: 'TermsAndConditions',

  props: [
    'config',
    'availableStyles'
  ],

  components: {
    MarkdownRenderer,
    Signup
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
    setView (view) {
      this.$emit('setView', view)
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../../assets/sass/variables'

#terms-and-conditions
  .auth-content__info
    .terms-of-service
      +mobile
        max-height: 15rem

</style>
