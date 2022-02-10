<template>
  <div class="notification-wrapper">
    <div v-if="message" class="notification is-warning" role="alert">
      {{message}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'toast',

  computed: {
    message: function () {
      return this.$store.state.gus.notifications.length &&
        this.$store.state.gus.notifications[0].message
    }
  }
}

</script>

<style scoped lang="sass">

.notification-wrapper
  position: fixed
  top: 0
  left: 10%
  right: 10%
  z-index: 1010
  display: flex
  flex-direction: column
  align-items: center

.notification
  display: inline
  text-align: center
  width: auto
  max-width: 100%

  border-top-left-radius: 0
  border-top-right-radius: 0
  font-size: 0.9rem
  padding: 1em
  opacity: 0.9


</style>
