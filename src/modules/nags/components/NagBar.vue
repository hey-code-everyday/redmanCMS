<template>
  <div>
    <div v-if="nag" class="nagbar-wrapper">
      <div class="nagbar var--gus-border-primary">
        <div class="nagbar__icon">
          <i class="icon-eye-crossed"></i>
        </div>
        <div class="nagbar__message var--gus-light-text">
          Hey! We need a little bit more information from you before we can show you everything on this page.
        </div>
        <button type="button" class="nagbar__button var--gus-bg-primary" @click="attemptVow">
          Sign up
        </button>
      </div>
    </div>
    <NagForm intention="intention" />
  </div>
</template>

<script>
import NagForm from './NagForm'

export default {
  name: 'nagbar',

  components: {
    NagForm
  },

  computed: {
    nag () {
      return (
        this.$store.getters.message('nagUserToCompleteVow') &&
        !this.$store.getters.isVow
      )
    },

    intention () {
      return this.$store.state.nag.intention
    }
  },

  methods: {
    attemptVow () {
      this.$store.dispatch('attemptVow', 'SHOW_AUTH')
    }
  }
}
</script>

<style lang="sass">
.nagbar
  display: flex
  margin-bottom: 2rem
  border: 1px solid
  align-items: center
  flex-wrap: wrap
  overflow: hidden
  @media (min-width: 769px)
    flex-wrap: nowrap
    margin-right: 1rem

.nagbar__icon
  padding: 0 1rem
  font-size: 24px
  opacity: 0.6

.nagbar__message
  padding: 1rem 1rem 1rem 0
  max-width: 80%

.nagbar__button
  padding: 1rem
  font-size: 1rem
  border: none
  align-self: stretch
  flex: 1 0 auto

.nagform
  width: 100%
  border-radius: 1rem
  margin: 0 20px
  @media (min-width: 769px)
    &>.columns
      flex-direction: row-reverse
  @media (min-width: 1024px)
    width: 960px
  @media (min-width: 1216px)
    width: 1152px
  @media (min-width: 1408px)
    width: 1344px

.nagform__left
  padding: 3rem
  display: flex
  flex-direction: column

.nagform__left
  justify-content: space-between

.nagform__title
  font-size: 2rem
  font-weight: 700

.nagform__subtitle
  font-size: 1.1rem
  margin: 0.5em 0

.nagform__hr
  max-width: 5rem

.nagform__main
  margin: 3rem 0

.nagform__error-msg
  margin: 1em 0

.nagform__footer
  display: flex
  flex-direction: row
  justify-content: space-between

.nagform__cancel,
.nagform__submit
  padding: 0.25em 0.75em
  font-size: 1.5rem
  &:disabled
    cursor: not-allowed
    opacity: 0.7

.nagform__cancel
  background: transparent

.nagform__submit
  border: none

.terms-of-service
  max-height: 5rem
  overflow-y: scroll
  margin: 1em 0
  border: 1px solid #dedede
  padding: 1em

.auth0-lock.auth0-lock .auth0-lock-close-button
  display: block !important
</style>
