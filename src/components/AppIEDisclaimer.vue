<template>
  <div id="hide-ie" v-show="showPopup" class="notification is-info">
    <button @click="hideIEPopUp" class="delete"></button>
    A modern browser is required for security, reliability, and performance. To get the most out of using this website we suggest one of our supported browsers: <a href="https://www.google.com/chrome/"rel="noreferrer" > Google Chrome </a> or <a href="https://www.mozilla.org/en-US/firefox/new/" rel="noreferrer"> Mozilla Firefox</a>.
  </div>

</template>

<script>
export default {
  name: 'AppHeader',

  data () {
    return {
      showPopup: true
    }
  },

  computed: {
    isMobile () {
      return this.$store.getters.isMobile
    }
  },

  methods: {
    hideIEPopUp () {
      this.$set(this, 'showPopup', false)
    }
  }
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

#hide-ie
  position: fixed
  bottom: 0px
  z-index: 9999
  width: 800px
  left: 50%
  margin-left: -400px
  background-color: #eee
  color: black
  border-radius: 10px

#hide-ie .delete
  margin: 7px

</style>
