import loginActionStorage from '@/helpers/loginActionStorage'

export default {
  data () {
    return {
      favorites: this.$store.state.gus.faves,
      isFavorite: this.checkIfFavorite()
    }
  },

  computed: {
    gus () {
      return this.$store.state.gus
    }
  },

  methods: {
    toggleFavorite () {
      let listingId = this.listing.id || this.listing.publicId

      if (this.isFavorite) {
        this.$store.dispatch('unfave', listingId)
      } else {
        loginActionStorage.deferUntilLogin(this.$store, 'fave', [listingId, this.listing.address])
      }

    },

    checkIfFavorite () {
      const userLoadState = this.$store.state.gus.userLoadState
      if (userLoadState < 2) return false

      if (!this.favorites) return false

      if (this.listing.id) return this.favorites.find(fave => this.listing.id === fave.id)
      return this.favorites.find(fave => this.listing.publicId === fave.id)
    }
  },

  watch: {
    gus: {
      deep: true,
      handler (state) {
        if (state.faves) this.$set(this, 'favorites', state.faves)
        if (this.favorites) this.$set(this, 'isFavorite', this.checkIfFavorite())
      }
    }
  }
}
