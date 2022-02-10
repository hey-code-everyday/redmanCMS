<template>
  <div class="custom-modal-image">
    <img :src="state.url" />
  </div>
</template>

<script>
import mixinCustomModal from '@/mixins/custom-modal'

export default {
  name: 'ModalCustomImage',
  mixins: [mixinCustomModal]
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-image
  font-size: 0
  max-width: calc(100vw - 2rem)
  +mobile
    display: flex
    justify-content: center
    align-items: center
    height: 100vh

img
  width: 100%
</style>
