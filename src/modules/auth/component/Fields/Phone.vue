<script>
import Field from './Field'

const validate = phone => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return (phoneRegex.test(phone))
}

export default {
  name: 'phone',
  extends: Field,

  data: function () {
    return {
      label: 'Phone Number (Used as password)',
      type: 'tel',
      errorMessage: 'Please enter a valid 10-digit phone number'
    }
  },

  methods: {
    validate: function (input) {
      return validate(input)
    }
  }
}

</script>
