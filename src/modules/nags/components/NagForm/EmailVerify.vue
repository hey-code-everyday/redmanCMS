<template>
  <div>
    <header class="nagform__header">
      <h2 class="nagform__title var--gus-title">Verify Email Address</h2>
      <p class="nagform__subtitle">Please check your email.</p>
      <hr class="nagform__hr" />
    </header>

    <main class="nagform__main">
      <button type="button" @click="resend" class="nagform__submit var--gus-bg-primary" :disabled="readyState !== 'ready'">Resend Verification Email</button>
      <p class="nagform__error-msg is-danger">{{error}}</p>
    </main>

    <footer class="nagform__footer">
      <button type="button" @click="cancel" class="nagform__cancel var--gus-border-primary var--gus-light-text">Cancel</button>
      <button type="button" @click="done" class="nagform__submit var--gus-bg-primary" :disabled="readyState !== 'ready'">Next</button>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'nagformEmailVerify',

  props: ['readyState'],

  data: function () {
    return {
      error: ''
    }
  },

  methods: {
    resend: function () {
      this.$store.dispatch('sendEmailVerification')
    },

    done: function () {
      this.$store.dispatch('attemptVow').then(intention => {
        this.error = 'We have not recieved your confirmation. Please try again.'
      })
    },

    cancel: function () {
      this.$emit('cancel')
    }
  }
}

</script>
