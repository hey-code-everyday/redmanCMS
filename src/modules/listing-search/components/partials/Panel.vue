
<script>

export default {
  name: 'Panel',

  methods: {
    noop: function (e) {
      e.stopPropagation()
      return true
    }
  },

  mounted () {
    this.$refs[this.$options.name].addEventListener('click', this.noop)
    document.querySelector('body').addEventListener('click', this.noop)
  },

  beforeDestroy () {
    this.$refs[this.$options.name].removeEventListener('click', this.noop)
    document.querySelector('body').removeEventListener('click', this.noop)
  }
}

</script>
