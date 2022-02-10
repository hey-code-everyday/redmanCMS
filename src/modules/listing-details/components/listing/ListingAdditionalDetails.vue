<template>
  <div class="listing-additional-facts listing-container content">
      <div class="listing-additional-container" v-for="(additional, i) in allAdditional" v-show="allAdditional">
        <h3 class="title is-5 is-title" v-show="additionalDetailsCheck(additional)">{{additional.heading}}</h3>
        <div class="columns" v-show="additionalDetailsCheck(additional)">
          <div class="column">
            <ul class="additional-facts">

              <li v-for="(detail, k) in additional.details" v-show='!mobile && k % 2 === 0'>
                <span class="label is-label">
                  {{Object.keys(detail)[0]}}
                </span>
                <span class="value">
                  <div v-for="(item, j) in detail" class="value-item">
                    <div v-for="(single, i) in item.split(/,/g)">
                      {{single}}
                    </div>
                  </div>
                </span>
              </li>

              <!-- if mobile, don't split into columns (keeps alphabetized order) -->
              <li v-for="(detail, k) in additional.details" v-show='mobile'>
                <span class="label is-label">
                  {{Object.keys(detail)[0]}}
                </span>
                <span class="value">
                  <div v-for="(item, j) in detail" class="value-item">
                    {{item}}
                  </div>
                </span>
              </li>

            </ul>
          </div>
          <div class="column">
            <ul class="additional-facts">

              <li v-for="(detail, k) in additional.details" v-show='!mobile && k % 2 === 1'>
                <span class="label is-label">
                  {{Object.keys(detail)[0]}}
                </span>
                <span class="value">
                  <div v-for="(item, j) in detail" class="value-item">
                    <div v-for="(single, i) in item.split(/,/g)">
                      {{single}}
                    </div>
                  </div>
                </span>
              </li>

            </ul>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'ListingAdditionalDetails',

  props: {
    listing: { type: Object, required: true }
  },

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    },

    allAdditional () {
      return this.listing.additionalDetails
    }
  },

  methods: {
    additionalDetailsCheck (additional) {
      let propClass = additional.propertyClass

      if (!additional.details.length) return false

      if (propClass === 'all' || propClass === this.listing.building_types[0]) {
        return true
      } else return false
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-additional-facts
  li
    position: relative
    display: flex
    min-height: 34px
    line-height: 34px
    font-size: 0.9em
    padding: 5px 0
    &:after
      content: ''
      display: block
      position: absolute
      width: 100%
      height: 1px
      bottom: -1px
      left: 0
      box-shadow: 0 0 100px inset
      opacity: 0.2
    &:last-child
      &:after
        display: none
  .listing-additional-container
    margin-bottom: 2em

  .value,
  .label
    display: block
    width: 50%
  .label
    font-size: inherit
    font-weight: bolder
    margin-bottom: 0
    color: inherit
    line-height: 15px
    margin: 10px 0 10px 0
  .value
    align-items: center
    span
      display: inline-block

    .value-item
      line-height: 15px
      margin: 10px 0 10px 0
  +mobile
    li
      line-height: 28px
      min-height: 28px

.content
  ul
    margin: 0
  li
    margin-top: 0
</style>
