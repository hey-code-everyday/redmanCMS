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
  }
}
</script>
