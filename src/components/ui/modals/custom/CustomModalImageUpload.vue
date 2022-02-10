<template>
  <div class="custom-modal-image-upload">
    <file-upload
      mode="select"
      class="file-upload"
      :token="$store.state.config.idToken"
      :spaceID="$store.state.config.spaceID"
      :allowed-types="[ 'image' ]"
      @file-selected="imageSelected"
    >
    </file-upload>
  </div>
</template>

<script>
import mixinCustomModal from '@/mixins/custom-modal'


export default {
  name: 'ModalImageUpload',

  mixins: [mixinCustomModal],

  components: {
    FileUpload: () => import('vue-file-upload')
  },

  methods: {
    imageSelected (event) {
      this.state.updateValue(event)
      this.$customModal_close()
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-image-upload
</style>
