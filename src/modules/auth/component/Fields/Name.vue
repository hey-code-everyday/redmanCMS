

<script>
import Field from './Field'

export default {
  name: 'name',
  extends: Field,

  data: function () {
    return {
      label: 'Name',
      type: 'text',
      errorMessage: 'This field is required'
    }
  },

  methods: {
    validate: function (input) {
      return !!input.trim().length
    }
  }
}

</script>
