<template>
  <editable-list
    tag="div"
    label="Link"
    class="strap-links"
    v-if="$store.state.editing || list.length > 0"
    @create="onCreate(listKey, defaultLink)">
    <editable-link
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
import defaultLink from '@/store/defaults/components/link'
import EditableLink from '@/components/editable/EditableLink'
import mixinEditableList from '@/mixins/editable-list'

export default {
  name: 'EditableLinkList',

  mixins: [mixinEditableList],

  props: {
    isTags: {
      type: [Boolean, String],
      required: false,
      default: false
    }
  },

  components: {
    EditableLink
  },

  computed: {
    defaultLink () {
      const link = defaultLink
      if (this.isTags) link.type = 'tag'
      return link
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
