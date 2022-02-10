<template>
  <div class="custom-modal-redform">
    <h4 class="title is-4 is-title">Request a Tour</h4>
    <hr />
    <p>{{ tourInfo }}</p>

    <br />
    <vue-redform
      :default-msg="tourInfo"
      :formID="state.formID"
      :extraData="state.extraData"
      :onSubmit="onSubmit"
    />
  </div>
</template>

<script>
import VueRedform from '@/components/VueRedform'
import mixinCustomModal from '@/mixins/custom-modal'

export default {
  name: 'CustomModalScheduleTourInfo',

  mixins: [mixinCustomModal],

  components: {
    VueRedform
  },
  data: function () {
    return {
      tourInfo: ''
    }
  },

  mounted() {
    this.hideInfo()
  },

  methods: {
    onSubmit() {
      if (this.state.onSubmit) {
        this.state.onSubmit()
      }
      this.$customModal_close()
    },
    hideInfo() {
      this.tourInfo =
        'You request a ' +
        this.state.tourType +
        ' on ' +
        this.convertDate(this.state.tourDate) +
        ' '
    },
    convertDate(d) {
      var from = d.split('-')
      var f = new Date(from[0], from[1] - 1, from[2])
      return f.toDateString()
    }
  }
}
</script>
<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'
</style>
