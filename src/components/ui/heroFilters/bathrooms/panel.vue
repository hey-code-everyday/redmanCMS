<script>
import bedrooms from '../bedrooms/panel.vue'

export default {
  extends: bedrooms,

  name: 'bathroomsPanel',

  data: function () {
    return {
      filterName: 'bathrooms',
      label: 'Bathrooms'
    }
  },
  methods: {
    onChange: function (newValue) {
      this.$emit('onChange', {
        type: this.filterName,
        value: newValue
      })
    },
    panelText (bedrooms) {
      const raw = this.toText(bedrooms)
      return raw ? `At least ${raw}` : 'Any amount'
    },
    toText (bedrooms) {
      if (!bedrooms) return false
      const match = bedrooms && bedrooms.match(/(\d+)p/)
      if (!bedrooms || bedrooms === '1p') {
        return false
      } else if (match) {
        return match[1]
      } else {
        throw new Error('Invalid value for bedrooms')
      }
    }
  }
}
</script>
