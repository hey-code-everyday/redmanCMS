<template>
  <div style="position: relative; text-align: center">
    <div
      v-show="dateCarouselPage > 0"
      class="prev-button arrow-button"
      @click="prevDatePage()"
    >
      <svg width="20" height="20" viewBox="0 0 8 12">
        <path
          style="fill: #424242"
          d="M1.214 11.921L.079 10.786a.268.268 0 010-.379L4.486 6 .079 1.593a.268.268 0 010-.38L1.214.08a.268.268 0 01.379 0L7.325 5.81a.268.268 0 010 .38L1.593 11.92a.268.268 0 01-.38 0"
          fill-rule="evenodd"
        ></path>
      </svg>
    </div>
    <component
      :is="browser ? 'carousel' : 'div'"
      :per-page="3"
      :mouse-drag="false"
      :navigationEnabled="false"
      :paginationEnabled="false"
      :value="dateCarouselPage"
    >
      <component :is="browser ? 'slide' : 'div'" v-for="(date, index) in availableTourDates" :key="index">
        <div
          :class="
            index === selectedDate ? 'selected-date' : 'slider-date-picker'
          "
          @click="setTourDate(date.time, index)"
        >
          <div class="slider-day">
            {{ days[date.dayOfWeek] }}
          </div>
          <div class="slider-date">
            {{ date.date }}
          </div>
          <div class="slider-month">
            {{ months[date.month] }}
          </div>
        </div>
      </component>
    </component>
    <div
      v-show="dateCarouselPage < 4"
      class="next-button arrow-button"
      @click="nextDatePage()"
    >
      <svg width="20" height="20" viewBox="0 0 8 12">
        <path
          style="fill: #424242"
          d="M1.214 11.921L.079 10.786a.268.268 0 010-.379L4.486 6 .079 1.593a.268.268 0 010-.38L1.214.08a.268.268 0 01.379 0L7.325 5.81a.268.268 0 010 .38L1.593 11.92a.268.268 0 01-.38 0"
          fill-rule="evenodd"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
let Carousel = {}
let Slide = {}
if (process.browser) {
  Carousel = require('vue-carousel').Carousel
  Slide = require('vue-carousel').Slide
}

export default {
  name: 'TourDateCarousel',

  components: {
    Carousel,
    Slide
  },

  data: () => ({
    selectedDate: null,
    availableTourDates: [],
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    dateCarouselPage: 0
  }),

  mounted() {
    let today = new Date().getTime()
    const oneDay = 24 * 60 * 60 * 1000
    this.selectedDate = 0
    for (let i = 0; i < 15; i++) {
      this.availableTourDates.push({
        month: new Date(today + oneDay * i).getMonth(),
        date: new Date(today + oneDay * i).getDate(),
        dayOfWeek: new Date(today + oneDay * i).getDay(),
        time: today + oneDay * i
      })
    }
  },

  computed: {
    browser () {
      return process.browser
    }
  },

  methods: {
    setTourDate(time, index) {
      this.selectedDate = index
      this.$emit('setTourDate', time)
    },

    prevDatePage() {
      this.dateCarouselPage = this.dateCarouselPage - 1
    },

    nextDatePage() {
      this.dateCarouselPage = this.dateCarouselPage + 1
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

.slider-date-picker
  border: solid 2px #80808085
  cursor: pointer
  margin: 3px
  &:hover
    border: solid 2px black
.selected-date
  border: solid 2px black
  cursor: pointer
  margin: 3px
.slider-date
  font-family: var(--fonts-title-family)
  font-size: 35px
.slider-day
  font-family: var(--default-text)
.slider-month
  font-family: var(--default-text)
.tour-type__container
  height: 55px
  margin-bottom: 0
  .button
    height: 36px
.btn-disabled
  cursor: not-allowed
.prev-button
  left: -15px
  transform: rotate(180deg)
.next-button
  right: -15px
.arrow-button
  top: 37px
  position: absolute
  border: 1px solid grey
  border-radius: 50%
  height: 40px
  width: 40px
  z-index: 3
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  background: white
</style>
