<template>
  <editable-list
    tag="div"
    label="Button"
    class="strap-buttons"
    v-if="$store.state.editing || list.length > 0"
    @create="onCreate(listKey, defaultButton)">
    <editable-button
      v-for="(item, i) in list"
      :key="i"
      :keyName="i"
      :value="item"
      :small="small"
      @change="e => { onChange(listKey, e) }"
      @delete="onDelete(listKey, i)"
    />
  </editable-list>
</template>

<script>
import defaultButton from '@/store/defaults/components/button'
import EditableButton from '@/components/editable/EditableButton'
import mixinEditableList from '@/mixins/editable-list'

export default {
  name: 'EditableButtonList',

  mixins: [mixinEditableList],

  props: {
    small: {
      type: [String, Boolean],
      required: false,
      default: false
    }
  },

  components: {
    EditableButton
  },

  computed: {
    defaultButton () {
      return defaultButton
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
