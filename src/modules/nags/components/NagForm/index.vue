<template>
  <div v-if="!!task" class="modal is-active gus-layer-panel">
    <div class="modal-background layer-bg" @click="cancel"></div>
    <div class="modal-content nagform var--gus-reset-colors layer-fg">
      <div class="column nagform__left">
        <component :is="task" :readyState="readyState" @cancel="cancel" />
      </div>

    </div>
  </div>
</template>

<script>
import TermsAgreement from './TermsAgreement'
import EmailVerify from './EmailVerify'
import ContactInfo from './ContactInfo'

export default {
  name: 'nagform',

  components: {
    termsAgreement: TermsAgreement,
    email_verified: EmailVerify,
    contactInfo: ContactInfo
  },

  computed: {
    task: function () {
      const intention = this.$store.state.nag.intention

      // these are the tasks handled by this component:
      const task = ['termsAgreement', 'email_verified', 'contactInfo'].find(i =>
        intention && (intention.item === i)
      )
      return task
    },

    readyState: function () {
      const readyState = this.$store.state.nag.readyState
      return readyState
    }
  },

  methods: {
    cancel: function () {
      this.$store.dispatch('cancelVow')
    }
  }
}
</script>

<style scoped lang="sass">
.nagform
  background-color: white
  text-align: left
</style>
