<template>
<div class="action-card-container">

  <!-- Desktop card -->
  <div class="action-card-outer">
    <div :class="[ 'card', 'action-card', 'content', 'var--gus-box' ]">

      <div class="action-card-header">
        <div class="title" style="text-align: center">
          {{getMonthlyLoan}}
        </div>
        <div class="subtitle">
          Est. Monthly Payment
        </div>
      </div>

      <div class="columns is-gapless is-multiline is-mobile">
        <div class="column is-half">
          <label class="label is-small">Price</label>
          <div class="field" style="margin: 0 5px 10px 0">
            <div class="control has-icons-left">
              <input v-model="price" class="input is-primary" type="text" placeholder="Price">
              <span class="icon is-left">
                $
              </span>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <label class="label is-small">Down Payment</label>
          <div class="field">
            <div class="control has-icons-left">
              <input v-model="downPayment" class="input is-primary" type="text" placeholder="Down Payment">
              <span class="icon is-left">
                $
              </span>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <label class="label is-small">Amortization</label>
          <div class="field" style="margin: 0 5px 10px 0">
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="length">
                  <option>5 Years</option>
                  <option>10 Years</option>
                  <option>15 Years</option>
                  <option selected>20 Years</option>
                  <option>25 Years</option>
                  <option>30 Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <label class="label is-small">Rate</label>
          <div class="field">
            <div class="control has-icons-right">
              <input v-model="rate" class="input is-primary" type="text" placeholder="Rate">
              <span class="icon is-right">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Calls to action -->
      <div class="listing-actions">
        <div class="button is-primary" @click="moreInfo">Learn More</div>
      </div>

      <div v-if="isEREB" class="mortgage-disclaimer is-soft">
        <br/>
        <small>
          Mortgage values are calculated by Redman Technologies Inc based on values provided in the REALTOR® Association of Edmonton listing data feed.
        </small>
      </div>

    </div>

  </div>

</div>
</template>

<script>

import CustomModalRedform from '@/components/ui/modals/custom/CustomModalRedform'

export default {
  name: 'ListingMortgageCard',

  props: {
    forms: { type: Object, required: true },
    theme: { type: String, default: 'default' },
    listing: { type: Object, required: true }
  },

  data () {
    return {
      price: this.listing.price || 300000,
      length: '20 Years',
      rate: 3.29,
      downPayment: this.getDownPayment(),
      monthlyPayment: 0
    }
  },

  watch: {
    price (newPrice) {
      if (typeof newPrice == 'string') newPrice = newPrice.replace(/[^0-9\.]/g,"")
      this.$set(this, 'price', Number(newPrice))
    },
    downPayment (newDownPayment) {
      if (typeof newDownPayment === 'string') newDownPayment = newDownPayment.replace(/[^0-9\.]/g,"")
      this.$set(this, 'downPayment', newDownPayment)
    },
    rate (newRate) {
      if (typeof newRate === 'string') newRate = newRate.replace(/[^0-9\.]/g,"")
      this.$set(this, 'rate', newRate)
    }
  },

  computed: {
    palette () {
      return this.$store.getters.palette(this.theme)
    },

    getMonthlyLoan () {
      let loanLength = Number(this.length.split(" ")[0])

      let annualInterestRate = this.rate/100
      let monthlyInterestRate = annualInterestRate/12
      let financingPrice = this.price - this.downPayment

      let monthly = (financingPrice * monthlyInterestRate)/(1-Math.pow((1+monthlyInterestRate),-(loanLength*12)));

      if (monthly) {
        return '$' + Math.ceil(monthly) + '/month'
      } else {
        return 'Incorrect Input'
      }
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  methods: {
    getDownPayment () {
      if (this.listing.price){
        return Math.ceil(this.listing.price * 0.2)
      } else {
        return 60000
      }
    },

    showForm (formID) {
      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          formID,
          extraData: {
            listingID: this.listing.publicId || this.listing.id
          }
        },
        component: CustomModalRedform,
        settings: {
          width: '600px',
          height: 'auto',
          padded: true,
          palette: this.theme
        }
      })
    },

    moreInfo () {
      this.showForm(this.forms.moreInfo)
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

.action-card-container
  top: 22rem
  z-index: 1
  position: sticky

.action-card-outer
  width: 100%
  position: relative

  +mobile
    z-index: 10
    left: 0
    right: 0
    bottom: 0

.action-card
  padding: 20px
  margin-bottom: 0
  margin-top: 20px
  text-align: center
  transition: opacity 250ms ease-in-out, transform 250ms ease-in-out
  border-radius: 3px

  .label
    text-align: left
    margin-bottom: 0px

    .is-small
      font-size: 0.8em

  .select
    margin-right: 3em

  .title
    font-size: 1.5rem

  .button
    height: 35px

.action-card-header
  position: relative
  .subtitle
    text-align: center
    font-size: .8rem
    margin-bottom: .5em

.listing-actions
  +mobile
    margin: 0 -20px 0 -20px


+with-palette
  .action-card-container
    .card
      color: var(--#{$palette}-text)
      background: var(--#{$palette}-bgColor)

.rm-dark-website
  .action-card-container
    .card
      border: solid 1px

.mortgage-disclaimer
  font-size: 12px
</style>
