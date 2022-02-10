<template>
  <div class="address-auto-complete__container">
    <gmap-autocomplete
      class="address-auto-complete"
      @place_changed="getAddress"
      placeholder="Type in your address."
      :options="options"
    />
  </div>
</template>

<script>
export default {
  name: 'AddressAutoComplete',

  data: () => ({
    options: {
      componentRestrictions: { country: 'CA' }
    }
  }),

  methods: {
    getAddress(place) {
      if (place['formatted_address']) {
        this.$store.commit('SET_ESTIMATE_ADDRESS', place['formatted_address'])
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.address-auto-complete__container
  border: 1px solid #e0e0e0
  border-radius: 3px
  width: 100%
  height: 52px
  background: none
.address-auto-complete
  color: grey
  background: none
  border-radius: 3px
  height: 100%
  width: 100%
  font-size: 20px
  padding: 0 20px
  border: none
  outline: none
  &::placeholder
    color: grey
    opacity: 1
</style>
