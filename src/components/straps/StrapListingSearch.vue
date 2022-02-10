<template>
  <div class="strap-listing-search">

    <ListingSearch />

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
  name: 'StrapListingSearch',

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

// Delete this

.strap-listing-search
  padding: 5rem 2.5rem
  max-width: 1344px
  margin-left: auto
  margin-right: auto
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
