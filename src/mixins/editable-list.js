import EditableList from '@/components/editable/EditableList'

export default {
  components: {
    EditableList
  },

  props: {
    tag: {
      type: String,
      required: false,
      default: 'div'
    },

    list: {
      type: Array,
      required: true
    },

    listKey: {
      type: String,
      required: true
    },

    onCreate: {
      type: Function,
      required: true
    },

    onChange: {
      type: Function,
      required: true
    },

    onDelete: {
      type: Function,
      required: true
    }
  }
}
