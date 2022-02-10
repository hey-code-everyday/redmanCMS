

<script>
import Field from './Field'

export default {
  name: 'password',
  extends: Field,

  data: function () {
    return {
      label: 'Password',
      type: 'password',
      errorMessage: 'Password must be at least 8 characters in length'
    }
  },

  methods: {
    validate: function (input) {
      return input.length >= 8
    }
  }
}

</script>
