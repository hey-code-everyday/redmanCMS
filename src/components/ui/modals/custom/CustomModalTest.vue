<template>
<div class="custom-modal-test">
  <template v-if="countdown > 0">
    Unlocking close in {{ countdown }}...
  </template>
  <template v-else>
    Hello, world!
  </template>
  <hr />

  <pre>{{ state }}</pre>
  <hr />

  <pre>{{ settings }}</pre>
  <hr />

  <div class="button strap-button is-primary is-small" @click="$customModal_close">Close Modal</div>
</div>
</template>

<script>
import mixinCustomModal from '@/mixins/custom-modal'

export default {
  name: 'ModalCustom',

  mixins: [mixinCustomModal],

  data () {
    return {
      countdown: 4
    }
  },

  methods: {
    tickCounter () {
      this.countdown--

      if (this.countdown === 0) {
        this.$store.commit('UNLOCK_MODAL_CLOSE')
      }

      if (this.countdown <= 0) return

      setTimeout(() => {
        this.tickCounter()
      }, 1000)
    }
  },

  mounted () {
    this.tickCounter()
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-test
</style>
