<template>
  <editable-list
    tag="div"
    label="Gallery"
    class="strap-gallery-tiles"
    v-if="$store.state.editing || list.length > 0"
    @create="onCreate(listKey, defaultGalleryTile)">
    <div class="columns is-multiline tiles-container">
      <editable-gallery-tile
        v-for="(item, i) in list"
        :key="i"
        :keyName="i"
        :value="item"
        @change="e => { onChange(listKey, e) }"
        @delete="onDelete(listKey, i)"
      />
    </div>
  </editable-list>
</template>

<script>
import defaultGalleryTile from '@/store/defaults/components/galleryTile'
import defaultTextShadow from '@/store/defaults/components/textShadow'
import mixinEditableList from '@/mixins/editable-list'
import EditableGalleryTile from '@/components/editable/EditableGalleryTile'

export default {
  name: 'EditableGalleryList',

  mixins: [mixinEditableList],

  components: {
    EditableGalleryTile
  },

  computed: {
    defaultGalleryTile () {
      return defaultGalleryTile
    }
  }
}
</script>

<style lang="sass" scoped>
.strap-gallery-tiles
  .tiles-container
    display: flex
    flex-direction: row-reverse
    flex-wrap: wrap-reverse !important
    margin: 0 !important
</style>
