

<script>
const validate = require('email-validator').validate
import Field from './Field'

export default {
  name: 'email',
  extends: Field,

  data: function () {
    return {
      label: 'Email',
      type: 'email',
      errorMessage: 'Please enter a valid email address'
    }
  },

  methods: {
    validate: function (input) {
      return validate(input)
    }
  }
}

</script>
