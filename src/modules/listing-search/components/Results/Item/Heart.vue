<template>
  <button v-if="state" type="button" :class="[ 'item__like', dark && 'is-dark', isEDM && 'is-edm' ]" @click="reqToggle" :disabled="waiting">
    <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
      <path :class="state" stroke-width="2" d="M 13.112 3.967 C 11.123 -1.432 1.112 -0.63 1.112 7.535 C 1.112 11.603 4.172 17.016 13.112 22.532 C 22.052 17.016 25.112 11.603 25.112 7.535 C 25.112 -0.583 15.112 -1.464 13.112 3.967 Z"/>
    </svg>
  </button>
</template>

<script>
import loginActionStorage from '@/helpers/loginActionStorage'

export default {
  name: 'itemLike',

  props: ['mls', 'address', 'dark', 'isEDM'],

  data: function () {
    return {
      waiting: false
    }
  },

  computed: {
    state: function () {
      const userLoadState = this.$store.state.gus.userLoadState
      if (userLoadState < 1) return 'notliked'
      else if (userLoadState === 1) return null
      return this.$store.state.gus.faves.find(fave => this.mls === fave.id) ? 'liked' : 'notliked'
    }
  },

  methods: {
    reqToggle: function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.waiting = true
      if (this.state === 'notliked') {
        loginActionStorage.deferUntilLogin(this.$store, 'fave', [this.mls, this.address]).then(() => {
          this.waiting = false
        })
      } else {
        this.$store.dispatch('unfave', this.mls).then(() => {
          this.waiting = false
        })
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../../../../assets/sass/variables'

// Fix svg lazy rendering in Safari
svg
  overflow: visible

.item__like
  float: right
  font-size: 1.5rem
  height: 1.1em
  color: white
  background: transparent
  border: none
  cursor: pointer
  transition: 0.1s ease-in-out transform
  pointer-events: all
  &:disabled
    cursor: initial
    transform: scale(0.9)

  &:focus 
    outline: 0

.notliked
  stroke: white
  fill: transparent

.liked
  stroke: white
  fill: white

.is-dark
  .notliked
    stroke: rgba(128,128,128,0.5)
    fill: transparent

+with-palette
  .is-dark
    .liked
      stroke: var(--#{$palette}-uiPrimary-bgColor)
      fill: var(--#{$palette}-uiPrimary-bgColor)

.is-edm
  .notliked
    stroke: var(--default-text)
    fill: transparent

  .liked
    stroke: var(--default-text)
    fill: var(--default-text)

  .is-dark
    .notliked
      stroke: var(--default-text)
      fill: transparent

  +with-palette
    .is-dark
      .liked
        stroke: var(--#{$palette}-uiPrimary-bgColor)
        fill: var(--#{$palette}-uiPrimary-bgColor)

</style>
