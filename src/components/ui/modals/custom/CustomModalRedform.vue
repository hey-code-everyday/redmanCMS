<template>
  <div class="custom-modal-redform">
    <vue-redform :formID="state.formID" :extraData="state.extraData" :onSubmit="onSubmit" />
  </div>
</template>

<script>
import VueRedform from '@/components/VueRedform'
import mixinCustomModal from '@/mixins/custom-modal'

export default {
  name: 'ModalCustomRedform',

  mixins: [ mixinCustomModal ],

  components: {
    VueRedform
  },

  methods: {
    onSubmit () {
      if (this.state.onSubmit) {
        this.state.onSubmit()
      }

      this.$customModal_close()
    }
  }
}
</script>
