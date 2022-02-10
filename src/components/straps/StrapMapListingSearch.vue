<template>
  <div class="map-mode-listing-search">

    <ListingSearch :mapMode="true"/>

  </div>
</template>

<script>
import api from '@/api'
import mixinStrap from '@/mixins/strap'
import { mapListings } from '@/helpers/listings'
import CustomModalTest from '@/components/ui/modals/custom/CustomModalTest'
import ListingCard from '@/components/ListingCard'
import ListingSearch from '@/modules/listing-search/App'

export default {
  name: 'StrapMapListingSearch',

  components: {
    ListingCard,
    ListingSearch
  },

  mixins: [mixinStrap],

  // Internal strap state

  data () {
    return {
      error: false,
      listings: []
    }
  },

  methods: {
    showModal () {
      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          foo: this.strap_state.foo
        },
        // template: 'Hello, world',
        component: CustomModalTest,
        settings: {
          width: '400px',
          height: 'auto',
          padded: true,
          palette: this.strap_style.theme,
          canClose: false
        }
      })
    },

    showNotification () {
      this.$store.dispatch('showNotification', {
        message: `Hello, ${this.strap_state.foo.bar}!`,
        type: 'branded'
      })
    }
  },

  // Strap user configuration state and setup (saved to grandcentral)

  initialState (strap, state) {
    return {
      foo: { bar: 'baz' }
    }
  },

  schema () {
    return [
      {
        title: 'Example Configuration',
        tabs: [
          {
            title: 'Foo',
            fields: [
              {
                key: 'state.foo.bar',
                type: 'text',
                label: 'Bar Value',
                default: 'baz'
              }
            ]
          }
        ]
      }
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'
.map-mode-listing-search
  padding: 1rem 0rem 0rem 0rem
  text-align: left !important
  *
    text-align: left !important
  +mobile
    padding: 0

.listing-card
  width: 300px
  display: inline-block !important
  margin: 0 1rem 1rem 0
</style>
