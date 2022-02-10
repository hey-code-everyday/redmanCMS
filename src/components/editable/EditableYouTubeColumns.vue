<template>
  <editable-list
    tag="div"
    label="Video"
    class="columns"
    v-if="$store.state.editing || list.length > 0"
    @create="onCreate(listKey, defaultYouTube)"
  >
    <div v-if="list.length === 1" class="column"></div>
    <div v-if="list.length === 2" class="column is-2"></div>
    <div
      class="column"
      v-for="(item, i) in list"
      :key="i"
    >
      <editable-you-tube-video
        :keyName="offset + i"
        :value="item"
        @change="e => { onChange(listKey, e) }"
        @delete="onDelete(listKey, offset + i)"
      />
    </div>
    <div v-if="list.length === 1" class="column"></div>
    <div v-if="list.length === 2" class="column is-2"></div>
  </editable-list>
</template>

<script>
import defaultYouTube from '@/store/defaults/components/youtubeVideo'
import EditableYouTubeVideo from '@/components/editable/EditableYouTubeVideo'
import mixinEditableList from '@/mixins/editable-list'

export default {
  name: 'EditableYouTubeColumns',

  mixins: [mixinEditableList],

  props: {
    row: {
      type: Number,
      default: 0
    },
    rowLength: {
      type: Number,
      default: 1
    }
  },

  components: {
    EditableYouTubeVideo
  },

  computed: {
    defaultYouTube () {
      return defaultYouTube
    },

    offset () {
      return this.row * this.rowLength
    }
  }
}
</script>

<style lang="sass" scoped>
.columns
  position: relative
</style>
