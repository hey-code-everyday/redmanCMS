<template>
  <editable-list
    tag="div"
    label="Image"
    class="strap-images"
    v-if="$store.state.editing || list.length > 0"
    @create="onCreate(listKey, defaultImage)">
    <editable-image
      v-for="(item, i) in list"
      :key="i"
      :keyName="i"
      :value="item"
      @change="e => { onChange(listKey, e) }"
      @delete="onDelete(listKey, i)"
    />
  </editable-list>
</template>

<script>
import defaultImage from '@/store/defaults/components/image'
import EditableImage from '@/components/editable/EditableImage'
import mixinEditableList from '@/mixins/editable-list'

export default {
  name: 'EditableImageList',

  mixins: [mixinEditableList],

  components: {
    EditableImage
  },

  computed: {
    defaultImage () {
      return defaultImage
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
