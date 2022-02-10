<template>
<div class="notification-item">
  <div :class="`notification is-${typeClass}`" @mousemove="resetTimeout" @click="dismiss" :style="style">
    <button class="delete" @click="dismiss"></button>
    {{ notification.message }}
    <template v-if="notification.action">
      <br />
      <nuxt-link v-if="notification.action.url" :to="notification.action.url">{{ notification.action.text }}</nuxt-link>
    </template>
  </div>
</div>
</template>

<script>
export default {
  name: 'Notification',

  props: {
    notification: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },

  methods: {
    resetTimeout () {
      this.$store.dispatch('resetNotification', this.notification.id)
    },

    dismiss () {
      this.$store.dispatch('hideNotification', this.notification.id)
    }
  },

  computed: {
    style () {
      const top = this.stackPos * 20

      let opacity = 1 - (this.stackPos * 0.33)
      if (opacity < 0) opacity = 0

      const style = {
        transform: `translateY(${top}px)`,
        filter: `grayscale(${(1 - opacity) * 100}%)`,
        opacity
      }

      if (this.notification.type === 'branded') {
        style.color = this.$store.getters.palette('default').uiPrimary.text + ' !important'
        style.background = this.$store.getters.palette('default').uiPrimary.bgColor + ' !important'
      }

      if (this.stackPos !== 0) {
        style.boxShadow = 'none'
      }

      return style
    },

    stackPos () {
      return (this.total - 1) - this.index
    },

    typeClass () {
      switch (this.notification.type) {
        case 'notice':
          return 'primary'
        case 'warning':
          return 'danger'
        case 'error':
          return 'danger'
        case 'branded':
          return 'branded'
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.notification-item
  position: absolute
  top: 0
  right: 0

  +mobile
    left: 0

.notification
  position: relative
  pointer-events: auto
  max-width: 500px
  transition: all 350ms
  box-shadow: 0 0 0 1px rgba(#000, 0.1)
  border-radius: 2px

  +mobile
    max-width: 100%
    width: 100%
    border-radius: 0
    text-align: center

  &.is-primary
    background-color: $wsBlue
    box-shadow: 0 0 0 1px rgba(#000, 0.1), 0 3px 13px rgba($wsBlue, 0.4)

  &.is-danger
    background-color: $wsRed
    box-shadow: 0 0 0 1px rgba(#000, 0.1), 0 3px 13px rgba($wsRed, 0.4)

  &.is-branded
    box-shadow: 0 0 0 1px rgba(#000, 0.1), 0 3px 13px rgba(#000, 0.2)

  +mobile
    top: 0
    right: 0
    left: 0

  a,
  a:link,
  a:href,
  a:visited
    color: #fff
    text-decoration: underline

.notification-item-enter-active,
.notification-item-leave-active
  transition: all 350ms

.notification-item-enter
  opacity: 0
  transform: translateX(0) scale(0.8)

.notification-item-leave-to
  opacity: 0
  transform: translateX(33%) scale(1)

.delete
  top: 8px
  right: 8px

</style>
