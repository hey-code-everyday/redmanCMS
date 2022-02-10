<template>
  <div class="strap-image-strip">
    <div class="strap-container container pad-small">
      <div class='strap-content content'>
        <editable-image-list
          tag="div"
          listKey="imageList"
          :list="strap_state.imageList"
          :onCreate="$strap_onListCreate"
          :onChange="$strap_onListChange"
          :onDelete="$strap_onListDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableImageList from '@/components/editable/EditableImageList'

import defaultImage from '@/store/defaults/components/image'

export default {
  name: 'StrapImageStrip',

  components: {
    EditableImageList
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      imageList: [defaultImage()]
    }
  }
}
</script>

<style scoped lang="sass">
.strap-image-strip
</style>
