<template>
  <!-- Bed, bath, size -->
  <div class="listing-icons" v-if="listing.bedrooms || listing.bathrooms || listing.area || listing.list_date">

    <div class="level" v-show="!mobile">
      <div class="level-left">
        <div class="level-item" v-if="listing.bedrooms">
          <p><i class="icon-bed var--gus-icon"></i></p>
          <p><strong>{{ listing.bedrooms }} bedrooms</strong></p>
        </div>
        <div class="level-item" v-if="listing.bathrooms">
          <p><i class="icon-bathtub var--gus-icon"></i></p>
          <p><strong>{{ listing.bathrooms }} bathrooms</strong></p>
        </div>
        <div class="level-item" v-if="listing.area">
          <p><i class="icon-rulers var--gus-icon"></i></p>
          <p><strong>{{ Math.floor(listing.area) | bigNumber }} sqft</strong></p>
        </div>
        <div class="level-item" v-if="listing.list_date && loggedIn && !isWrongDate">
          <p><i class="icon-calendar-empty var--gus-icon"></i></p>
          <p><strong>{{ daysOnMarket }} Day<span v-if="multipleDays">s</span> on Market</strong></p>
        </div>
        <div class="level-item days-on-market" v-if="listing.list_date && !loggedIn && !isWrongDate">
          <p class="days-on-market-icon"><i class="icon-calendar-empty var--gus-icon"></i></p>
          <div class="icon-info is-hidden-touch">
            <p><strong><a @click="login" class="border-right">Sign up to View</a></strong></p>
            <p><strong>Days on Market</strong></p>
          </div>
        </div>
      </div>
    </div>

    <div v-show="mobile" class="icons">
      <span>
        <i class="icon-bed var--gus-icon" v-if="listing.bedrooms"></i>
        <strong>{{ listing.bedrooms }} bed</strong>
      </span>
      <span>
        <i class="icon-bathtub var--gus-icon" v-if="listing.bathrooms"></i>
        <strong>{{ listing.bathrooms }} bath</strong>
      </span>
      <span>
        <i class="icon-rulers var--gus-icon" v-if="listing.area"></i>
        <strong>{{ Math.floor(listing.area) | bigNumber }} sf</strong>
      </span>
    </div>

    <div class="icons" v-show="mobile && listing.list_date  && !isWrongDate">
      <p v-show="loggedIn">
        <i class="icon-calendar-empty var--gus-icon"></i>
        <strong>{{ daysOnMarket }} Days on Market</strong>
      </p>
      <p v-show="!loggedIn">
        <i class="icon-calendar-empty var--gus-icon"></i>
        <strong class="days-on-market">
          <a @click="login" class="border-right">Sign up to View</a>
          <br/>
          Days on Market
        </strong>
      </p>
    </div>

  </div>
</template>

<script>

import dayjs from 'dayjs'

export default {
  name: 'ListingIcons',

  props: {
    listing: { type: Object, required: true }
  },

  data () {
    return {
      multipleDays: false,
      isWrongDate: false,
    }
  },

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    },
    daysOnMarket () {
      //listing date is in EPOCH time
      let start = dayjs.unix(this.listing.list_date / 1000)
      let today = dayjs()

      let days = today.diff(start, 'day')
      if (days !== 1) this.$set(this, 'multipleDays', true)
      if (days < 0) this.$set(this, 'isWrongDate', true)

      return days
    },
    loggedIn () {
      return this.$store.getters.clientAuthenticated
    }
  },
  methods: {
    login () {
      this.$store.commit('SHOW_AUTH')
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-icons
  +mobile
  .level-item
    padding-right: 1rem
    flex-direction: column
    align-items: start
    text-align: left
    i
      font-size: 34px
    strong
      font-size: 1em
  .icons
    display: flex
    text-align: center
    span, p
      display: inline-flex
      width: auto
      flex: 1
      font-size: 16px
      i
        display: inline-block
        margin: 1px
        margin-right: 7px
        font-size: 20px
    +mobile
      margin-bottom: 15px
  .days-on-market
    line-height: 1
    +desktop
      margin-top: 10px
  .days-on-market-icon
    margin-bottom: 10px

</style>
