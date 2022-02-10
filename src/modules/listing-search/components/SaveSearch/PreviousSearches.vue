<template>
  <div>
    <div class="box var--gus-box previous-searches gus-panel--mobile-up gus-layer-panel" :aria-hidden="!open">
      <div class="gus-list">
        <h3 class="gus-list__title">
          My Saved Searches
        </h3>
        <ul class="gus-list__items var--gus-primary">
          <li v-for="search in savedSearches">
            <a href="#" :data-id="search.id" @click="reqDelete" class="previous-search__delete delete"></a>
            <a href="#" :data-id="search.id" @click="openSavedSearch">{{search.name}}</a>
          </li>
        </ul>
        <p v-if="!haveSavedSearches" class="gus-list__noresults">You have no saved searches</p>
      </div>

      <div class="gus-list">
        <h3 class="gus-list__title">
          My Favourite Properties
        </h3>
        <ul class="gus-list__items var--gus-primary">
          <li v-for="fave in faves">
            <a :href="listingDetailsHref(listingDetailsHrefTemplate, fave.id)" class="var--gus-primary favorite-link">
              <template v-if="fave.listing && fave.listing.images && fave.listing.images[0]">
                <div class="thumbnail" :style="`background-image: url(${small(fave.listing.images[0])}`"></div>
              </template>
              {{fave.listing ? (fave.listing.address || fave.listing.publicId || 'SOLD') : fave.id}}
              <small v-if="fave.unavailable">(Deleted)</small>
            </a>
            <a v-if="fave.unavailable" href="#" :data-id="fave.id" @click="reqUnlike" class="previous-search__delete delete"></a>
          </li>
        </ul>
        <p v-if="!haveFaves" class="gus-list__noresults">You have no favourites</p>
      </div>
    </div>

    <DeleteConfirmation v-if="!!toDelete" :toDelete="toDelete" @close="reqDeleteDone" />
  </div>
</template>

<script>
import DeleteConfirmation from './DeleteConfirmation'
import { listingDetailsHref } from '../../helpers/formatting'
import { getSrcForSize } from '@/modules/listing-search/helpers/images'

export default {
  name: 'previousSearches',

  props: [ 'open' ],

  data: function () {
    return {
      toDelete: null,
      listingDetailsHref
    }
  },

  components: {
    DeleteConfirmation
  },

  computed: {
    faves: function () {
      return this.$store.state.gus.faves
    },

    haveFaves: function () {
      return this.faves && this.faves.length
    },

    savedSearches: function () {
      return this.$store.state.gus.saved
    },

    haveSavedSearches: function () {
      return this.savedSearches && this.savedSearches.length
    },

    listingDetailsHrefTemplate: function () {
      return this.$store.state.config.gus.listingDetailsHref
    }
  },

  methods: {
    small (src) {
      return getSrcForSize(src, 'small')
    },

    close: function () {
      this.$emit('requestClose')
    },

    openSavedSearch: function (e) {
      this.$store.dispatch('openSavedSearch', e.target.dataset.id).then(res => {
        this.$emit('requestClose')
      })
    },

    reqDelete: function (e) {
      const search = this.savedSearches.find(savedSearch => savedSearch.id === e.target.dataset.id)
      if (!search) throw new Error('Delete of non-existant search requested')
      this.toDelete = search
    },

    reqUnlike: function (e) {
      e.preventDefault()
      this.$store.dispatch('unfave', e.target.dataset.id)
    },

    reqDeleteDone: function (e) {
      this.toDelete = null
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../../../assets/sass/variables'

.previous-searches
  margin: 1rem
  padding: 0.5rem 0
  padding-bottom: 1rem
  max-height: 360px
  overflow-y: scroll
  max-width: unset
  min-width: 300px
  text-align: left
  +mobile
    margin: 0
    padding: 10px 0
    overflow: visible

li
  position: relative

.previous-search__delete
  float: right
  padding: 0
  margin: 0.5rem 0.25rem 0 0

.favorite-link
  display: flex !important
  align-items: center
  min-height: 100%
  height: 50px !important
  line-height: 50px !important
  + .delete
    position: absolute
    top: 5px
    right: 0

.thumbnail
  width: 60px
  height: 40px
  background-size: cover
  background-position: 50% 50%
  display: inline-block
  margin-right: 10px
  border-radius: 3px
</style>
