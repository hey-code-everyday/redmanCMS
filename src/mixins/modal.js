export default {
  props: {
    modal: {
      type: [Object, false],
      required: true,
      default: false
    }
  },

  methods: {
    $modal_findLastKey (obj, key) {
      const keys = key.split('.')
      const lastKey = keys.pop()

      keys.forEach(k => {
        if (obj[k] !== undefined) {
          obj = obj[k]
        } else {
          obj[k] = {}
          obj = obj[k]
        }
      })

      return { obj, lastKey }
    }
  }
}
