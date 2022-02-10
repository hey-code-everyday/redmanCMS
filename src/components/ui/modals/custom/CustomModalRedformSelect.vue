<template>
  <div class="custom-modal-redform">
    <div class="select-tour" v-if="showinfo == 1">
      <div class="content">
        <div class="columns">
          <div class="column">
            <h4 class="title is-5 is-title">Schedule Tour</h4>
            <p>
              Which type of property tour would you prefer? Reach out and we'll
              finalize a time that works best.
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <a
              class="button is-fullwidth"
              v-on:click="selectTour('Person Tour')"
              :class="{'is-primary': tourType == 'Person Tour'}"
              >In person Tour</a
            >
          </div>
          <div class="column">
            <a
              class="button is-fullwidth"
              v-on:click="selectTour('Video Tour')"
              :class="{'is-primary': tourType == 'Video Tour'}"
              >Video Tour</a
            >
          </div>
        </div>

        <h4 class="title is-5 is-title">Select a Date</h4>
        <div>
          <tour-date-carousel @setTourDate="setTourDate" />
        </div>

        <!-- <div class="columns">
								<div class="column">
									<div class="field">
										<div class="control">
											<input type="date" name="" id="" class="input" v-model="tourDate" />
										</div>
									</div>
								</div>
						</div> -->
        <div class="columns">
          <div class="column">
            <button
              class="button is-medium is-fullwidth is-primary"
              title="Request a Tour"
              v-bind:disabled="tour == 0"
              v-on:click="hideInfo()"
            >
              Request a Tour
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showinfo == 0">
      <h4 class="title is-4 is-title">Request a Tour</h4>
      <hr />
      <p>{{ tourInfo }} &nbsp; | &nbsp; <a v-on:click="editTour()">Edit</a></p>

      <br />
      <vue-redform
        :default-msg="tourInfo"
        :formID="state.formID"
        :extraData="state.extraData"
        :onSubmit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import VueRedform from '@/components/VueRedform'
import mixinCustomModal from '@/mixins/custom-modal'
import TourDateCarousel from '@/modules/listing-details/components/listing/TourDateCarousel'

export default {
  name: 'ModalCustomRedform',

  mixins: [mixinCustomModal],

  components: {
    VueRedform,
    TourDateCarousel
  },
  data: function () {
    return {
      showinfo: 1,
      tourType: '',
      tour: 0,
      tourDate: '',
      tourInfo: ''
    }
  },
  mounted() {
    showinfo: 1
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
        this.tourType +
        ' on ' +
        this.convertDate(this.tourDate) +
        ' '
      this.showinfo = 0
    },
    editTour() {
      this.tourInfo = ''
      this.showinfo = 1
    },
    selectTour(t) {
      this.tourType = t
    },
    convertDate(d) {
      var from = d.split('-')
      var f = new Date(from[0], from[1] - 1, from[2])
      return f.toDateString()
    },
    setTourDate(time) {
      const selectedDate = new Date(time)
      this.tourDate = `${selectedDate.getFullYear()}-${
        selectedDate.getMonth() + 1
      }-${selectedDate.getDate()}`
    }
  },

  watch: {
    tourDate: function () {
      if (this.tourType != '' && this.tourDate != '') {
        this.tour = 1
      }
    },
    tourType: function () {
      if (this.tourType != '' && this.tourDate != '') {
        this.tour = 1
      }
    }
  }
}
</script>
<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'
</style>
