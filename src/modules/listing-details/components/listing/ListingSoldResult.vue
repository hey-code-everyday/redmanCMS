<template>
  <header class="listing-header">
    <template v-if="mobile">
        <h1 class="title is-5 var--gus-title">Asking: {{ listing.askingPrice | listingPrice }}</h1>
        <h1 class="title is-5 var--gus-title">{{ listing.soldDate | monthYearFormat }}</h1>
        <h1 class="title is-5 var--gus-title font-red">Sold: {{ listing.soldPrice | listingPrice }}</h1>
    </template>
    <template v-else>
      <div class="sold-result__row">
        <h1 class="title is-5 var--gus-title float-left">{{ listing.address }} | {{ listing.city }} {{ listing.province }}</h1>
        <h1 class="title is-5 var--gus-title float-right">{{ listing.soldDate | monthYearFormat }}</h1>
      </div>
      <div class="sold-result__row">
        <h1 class="title is-5 var--gus-title float-left">Asking: {{ listing.askingPrice | listingPrice }}</h1>
        <h1 class="title is-5 var--gus-title float-right font-red">Sold: {{ listing.soldPrice | listingPrice }}</h1>
      </div>
    </template>
  </header>
</template>

<script>

export default {
  name: 'ListingSoldResult',

  props: {
    listing: { type: Object, required: true },
    theme: { type: String, default: 'default' }
  },

  data() {
    return {
      showCalc: false
    }
  },

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

$listingTransition: all 500ms

.listing-header
  h1
    margin-top: 1rem
  +mobile
    position: sticky
    top: 50px
    z-index: 15
    margin: 10px 0 !important
    padding: 10px 0
    // &:after
    //   left: 0
    //   right: 0
    //   bottom: 0
    //   content: ''
    //   display: block
    //   position: absolute
    //   height: 10px
    //   background: red
    h1,
    .subtitle
      margin: 0
    h1
      font-size: 16px
    .subtitle
      font-size: 16px

.float-left
  float: left
  margin-bottom: 0
.float-right
  float: right
  margin-top: 0
.sold-result__row
  display: flex
  justify-content: space-between
.font-red
  color: $wsDarkRed

+with-palette
  .listing-header
    +mobile
      background: var(--#{$palette}-bgColor)
</style>
