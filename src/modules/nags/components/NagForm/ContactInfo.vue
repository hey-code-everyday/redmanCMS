<template>
  <form>
    <header class="nagform__header">
      <h2 class="nagform__title var--gus-title">Additional Contact Info</h2>
      <p class="nagform__subtitle">Please provide us with some additional contact details</p>
      <hr class="nagform__hr" />
    </header>

    <main class="nagform__main">
      <div class="field">
        <label for="primaryPhone" class="label">Phone Number</label>
        <input :class="`input${error ? ' is-danger' : ''}`" type="tel" :value="primaryPhone" @blur="onChange" @change="onChange" @keyup="onChange" id="primaryPhone" />
        <p class="help is-danger">{{error}}</p>
      </div>
    </main>

    <footer class="nagform__footer">
      <button type="button" @click="cancel" class="nagform__cancel var--gus-border-primary var--gus-light-text">Cancel</button>
      <button type="submit" @click="submit" class="nagform__submit var--gus-bg-primary" :disabled="disabled || readyState !== 'ready'">Next</button>
    </footer>
  </form>
</template>

<script>

export default {
  name: 'nagformContactInfo',

  props: ['readyState'],

  data: function () {
    return {
      primaryPhone: '',
      error: '',
      disabled: true
    }
  },

  methods: {
    onChange: function (e) {
      const value = e.target.value
      if (!value || value.match(/[^0-9-()]/)) {
        this.error = 'Please enter a valid phone number'
      } else {
        this.error = ''
      }
      this.disabled = !!this.error
      this.primaryPhone = e.target.value
    },

    cancel: function () {
      this.$emit('cancel')
    },

    submit: function (e) {
      e.preventDefault()
      const primaryPhone = this.primaryPhone.replace(/[^0-9]/g, '')
      this.$store.dispatch('updateContactInfo', {
        primaryPhone
      }).then(() => {
        const nextCondition = this.$store.getters.nextCondition
        if (nextCondition && nextCondition.item === 'contactInfo') {
          this.error = 'There was a problem with your submission, please try again'
        }
      })
    }
  }
}

</script>
