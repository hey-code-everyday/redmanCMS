<template>
<div class="details-contact-card">
  <div class="details-contact-card-left">
    <div v-if="listing.price || listing.address">
      <h3 v-if="listing.price" class="title is-4 var--gus-title">
        <strong>{{ listing.price | listingPrice }}</strong>
      </h3>
      <p v-if="listing.address" class="subtitle var--gus-text-soft" style="white-space:nowrap">
        <small>{{ listing.address }}</small>
      </p>
    </div>

    <!-- Favorite buttons -->
    <div class="details-contact-card-favorite">
      <a v-if="isFavorite"
      class="fav-icon"
      href="javascript:void(0)"
      @click="toggleFavorite">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path :style="{ fill: primaryColor }" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg>
      </a>
      <a v-else
      class="fav-icon"
      href="javascript:void(0)"
      @click="toggleFavorite">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path :style="{ fill: primaryColor }" d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z"/></svg>
      </a>
    </div>

    <!-- Share listing -->
    <p>
      <a class="share-listing var--gus-link-soft" href="" @click.prevent.stop="shareListing">
        <i class="icon-share2"></i>
        <span>Share this listing</span>
      </a>
    </p>
  </div>

  <!-- Calls to action -->
  <div class="details-contact-card-actions">
    <div class="button is-primary strap-button" @click="moreInfo">Contact Agent</div>
    <div class="button is-outlined strap-button" @click="requestShowing">Schedule Tour</div>
  </div>
</div>
</template>

<script>
import favoriteListingMixin from '@/mixins/favorite-listing'
import CustomModalRedform from '@/components/ui/modals/custom/CustomModalRedform'
import CustomModalRedformSelect from '@/components/ui/modals/custom/CustomModalRedformSelect'
import CustomModalShareListing from '@/components/ui/modals/custom/CustomModalShareListing'

export default {
  name: 'ListingActionCard',

  mixins: [favoriteListingMixin],

  props: {
    forms: { type: Object, required: true },
    theme: { type: String, default: 'default' },
    listing: { type: Object, required: true }
  },

  computed: {
    palette () {
      return this.$store.getters.palette(this.theme)
    },

    primaryColor () {
      return this.palette.uiPrimary.bgColor
    },

    mobile () {
      return this.$store.getters.isMobile
    }
  },

  methods: {
    shareListing () {
      this.$store.commit('HIDE_ALL_MODALS')
      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          listing: this.listing,
          onSubmit: () => {
            this.$emit('submit')
          }
        },
        component: CustomModalShareListing,
        settings: {
          width: '600px',
          height: 'auto',
          padded: true,
          palette: this.theme
        }
      })
    },

    showForm (formID) {
      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          formID,
          extraData: {
            listingID: this.listing.publicId || this.listing.id
          },
          onSubmit: () => {
            this.$emit('submit')
          }
        },
        component: CustomModalRedformSelect,
        settings: {
          width: '600px',
          height: 'auto',
          padded: true,
          palette: this.theme
        }
      })
    },
    showFormSelect (formID) {
      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          formID,
          extraData: {
            listingID: this.listing.publicId || this.listing.id
          },
          onSubmit: () => {
            this.$emit('submit')
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
      this.$store.commit('HIDE_ALL_MODALS')
      this.showFormSelect(this.forms.moreInfo)
    },

    requestShowing () {
      this.$store.commit('HIDE_ALL_MODALS')
      this.showForm(this.forms.requestShowing)
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

.details-contact-card
  position: absolute
  width: 80vw
  bottom: 1rem
  display: flex
  background: white
  box-shadow: #00000026 0px 6px 12px 0px
  padding: 1rem 2rem
  border-radius: 1rem
  max-width: 65rem
  z-index: 1
  h3
    color: var(--default-titleText) !important
  @media (max-width: 1024px)
    width: 95vw

.details-contact-card-left
  width: 50%
  display: flex
  align-items: center
  border-right: 1px solid #b7c1d2
  +mobile
    display: none

.details-contact-card-favorite
  a
    font-size: 28px

.fav-icon
  display: flex
  padding: 5px
  margin: -0.4em 0
  text-align: center
  width: 42px
  height: 42px

.subtitle
  min-height: 1rem

.details-contact-card-actions
  display: flex
  justify-content: space-around
  align-items: center
  width: 50%
  +mobile
    width: 100%
    display: flex
    div
      margin: 0 .3rem
      min-width: 8rem !important

.is-primary
  color: var(--default-uiPrimary-text)
  background-color: var(--default-uiPrimary-bgColor)
.is-outlined
  color: var(--default-uiPrimary-bgColor)
  border-color: var(--default-uiPrimary-bgColor)
</style>
