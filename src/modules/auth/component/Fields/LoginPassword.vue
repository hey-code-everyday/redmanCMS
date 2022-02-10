
<script>
import Field from './Field'

export default {
  name: 'email',
  extends: Field,

  data: function () {
    return {
      label: 'Password (Your Phone)',
      type: 'password'
    }
  }
}

</script>
