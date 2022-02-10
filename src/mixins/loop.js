export default {
  props: {
    loopEnabled: {
      type: [ String, Boolean ],
      default: true
    }
  },

  data () {
    const mixin = {

      // Data

      enabled: this.loopEnabled,

      // Methods

      _loop: () => {
        if (!this.mixinLoop.enabled) return

        this.mixinLoop._update()
        if (process.browser) window.requestAnimationFrame(this.mixinLoop._loop.bind(this))
      },

      _update: () => {
        this.mixinLoop.update()
      },

      enable: (value) => {
        this.mixinLoop.enabled = value
        this.mixinLoop._loop()
      },

      update: () => {}
    }

    return {
      mixinLoop: mixin
    }
  },

  computed: {
    $loop () {
      return this.$data.mixinLoop
    }
  },

  watch: {
    loopEnabled (newValue) {
      this.$loop.enable(newValue)
    }
  },

  created () {
    this.$loop._loop()
  },

  destroyed () {
    this.$loop.enabled = false
  }
}
