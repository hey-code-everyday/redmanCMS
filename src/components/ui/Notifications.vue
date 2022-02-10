<template>
<transition-group name="notification-item" tag="div" class="notifications" :style="{ top: $store.getters.canEdit ? 'calc(52px + 1rem)' : '1rem' }">
  <Notification v-for="(notification, i) in notifications" :key="notification.id" :notification="notification" :index="i" :total="notifications.length" />
</transition-group>
</template>

<script>
import Notification from './Notification'

export default {
  name: 'Notifications',

  props: {
    notifications: {
      type: Array,
      required: true
    }
  },

  components: {
    Notification
  },

  data () {
    return {
      shouldTick: true
    }
  },

  created () {
    this.tick(Date.now())
  },

  destroyed () {
    this.shouldTick = false
  },

  methods: {
    tick (last) {
      const { dispatch } = this.$store
      if (!this.$store.getters.canEdit) return
      const now = Date.now()
      const dt = now - last

      if (this.notifications.length) {
        const notification = this.notifications[this.notifications.length - 1]

        if (notification.paused) return

        dispatch('tickNotification', { id: notification.id, amount: dt })

        const msPerChar = 1000 / ((200 / 60) * 5) // 200 - average reading speed in wpm, 60 - seconds, 5 - average word length
        const actionDelay = notification.action ? 2000 : 0 // add delay if there is an action
        const timeout = Math.max(msPerChar * notification.message.length, 1500) + actionDelay // minimum display time in ms
        if (notification.timeout > timeout) {
          dispatch('hideNotification', notification.id)
        }
      }

      if (this.shouldTick) {
        if (process.browser) {
          requestAnimationFrame(this.tick.bind(this, now))
        }
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.notifications
  position: fixed
  pointer-events: none
  z-index: 10000
  right: 1rem
  left: 1rem

  +mobile
    top: 0
    right: 0
    left: 0
</style>
