<template>
  <div class="action-card-container">
    <!-- Desktop card -->
    <div v-show="!isMobile" class="action-card-outer">
      <div :class="['card', 'action-card', 'content', 'var--gus-box']">
        <div class="action-card-header">
          <template>
            <p v-if="listing.price" class="title is-4 var--gus-title text-align-left">
              <strong>{{ listing.price | listingPrice }}</strong>
            </p>
            <p class="subtitle var--gus-text-soft" style="white-space: nowrap">
              <small v-if="listing.address">{{ listing.address }}</small>
            </p>
          </template>

          <!-- Favorite buttons -->
          <div class="listing-favorite">
            <a
              v-if="isFavorite"
              class="fav-icon"
              href="javascript:void(0)"
              @click="toggleFavorite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  :style="{fill: primaryColor}"
                  d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
                />
              </svg>
            </a>
            <a
              v-else
              class="fav-icon"
              href="javascript:void(0)"
              @click="toggleFavorite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  :style="{fill: primaryColor}"
                  d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z"
                />
              </svg>
            </a>
          </div>
        </div>
        
        <client-only>
          <tour-date-carousel @setTourDate="setTourDate" />
        </client-only>

        <div class="columns tour-type__container">
          <div class="column" style="padding: 0.75rem 0 0.75rem 0.75rem">
            <a
              class="button is-fullwidth"
              @click="selectTour('Person Tour')"
              :class="{'is-primary': tourType == 'Person Tour'}"
            >
              In person Tour
            </a>
          </div>
          <div class="column" style="padding: 0.75rem 0.75rem 0.75rem 0">
            <a
              class="button is-fullwidth"
              @click="selectTour('Video Tour')"
              :class="{'is-primary': tourType == 'Video Tour'}"
            >
              Video Tour
            </a>
          </div>
        </div>

        <!-- Calls to action -->
        <div class="listing-actions">
          <div class="button is-outlined strap-button" @click="requestShowing">
            Schedule Tour
          </div>
          <div class="button is-primary strap-button" @click="moreInfo">
            Contact Agent
          </div>
        </div>

        <!-- Share listing -->
        <p>
          <a
            class="share-listing var--gus-link-soft"
            href=""
            @click.prevent.stop="shareListing"
          >
            <i class="icon-share2"></i>
            <span>Share this listing</span>
          </a>
        </p>
      </div>

      <!-- Social share box -->
      <!-- <ShareBox @close="closeShareBox" :class="[ (!isSharing ? 'is-closed' : '') ]" /> -->
    </div>
  </div>
</template>

<script>
import favoriteListingMixin from '@/mixins/favorite-listing'
import CustomModalRedform from '@/components/ui/modals/custom/CustomModalRedform'
import CustomModalRedformSelect from '@/components/ui/modals/custom/CustomModalRedformSelect'
import CustomModalScheduleTourInfo from '@/components/ui/modals/custom/CustomModalScheduleTourInfo'
import CustomModalShareListing from '@/components/ui/modals/custom/CustomModalShareListing'
import ClientOnly from '@/components/ClientOnly'
import TourDateCarousel from './TourDateCarousel'

export default {
  name: 'ListingActionCard',

  components: {
    TourDateCarousel,
    ClientOnly,
  },

  data: () => ({
    tourDate: null,
    tourType: 'Person Tour'
  }),

  mixins: [favoriteListingMixin],

  props: {
    forms: {type: Object, required: true},
    theme: {type: String, default: 'default'},
    listing: {type: Object, required: true}
  },

  computed: {
    palette() {
      return this.$store.getters.palette(this.theme)
    },

    primaryColor() {
      return this.palette.uiPrimary.bgColor
    },

    isMobile() {
      return this.$store.getters.isMobile
    },

    selectedTourInfo() {
      if (this.tourType === '' || !this.tourDate) return false
      return true
    }
  },

  methods: {
    shareListing() {
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

    showForm(formID) {
      const selectedDate = new Date(this.tourDate)
      if (this.selectedTourInfo) {
        this.$store.commit('SHOW_CUSTOM_MODAL', {
          state: {
            formID,
            extraData: {
              listingID: this.listing.publicId || this.listing.id
            },
            tourDate: `${selectedDate.getFullYear()}-${
              selectedDate.getMonth() + 1
            }-${selectedDate.getDate()}`,
            tourType: this.tourType,
            onSubmit: () => {
              this.$emit('submit')
            }
          },
          component: CustomModalScheduleTourInfo,
          settings: {
            width: '600px',
            height: 'auto',
            padded: true,
            palette: this.theme
          }
        })
      } else {
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
      }
    },
    showFormSelect(formID) {
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

    moreInfo() {
      this.showFormSelect(this.forms.moreInfo)
    },

    requestShowing() {
      this.showForm(this.forms.requestShowing)
    },

    setTourDate(time) {
      this.tourDate = time
    },

    selectTour(type) {
      this.tourType = type
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../../../assets/sass/variables'

.action-card-container
  top: 5.25rem
  margin-bottom: -13px
  z-index: 2
  position: sticky

.action-card-outer
  width: 100%
  position: relative

  +mobile
    position: fixed
    z-index: 10
    left: 0
    right: 0
    bottom: 0

.action-card
  padding: 20px
  margin-bottom: 0
  text-align: center
  transition: opacity 250ms ease-in-out, transform 250ms ease-in-out
  border-radius: 3px

  &.is-closed
    opacity: 0
    transform: translateX(20%)
    pointer-events: none

  +mobile
    padding-bottom: 0

  h3,
  .subtitle
    text-align: left

  h3
    display: flex
    align-items: center
    white-space: nowrap

    span
      font-weight: inherit
      display: inline-block
      margin-right: 6px

  .subtitle
    font-size: 1rem

  .button
    width: 100%
    height: 48px
    margin-bottom: 0.6em

    +mobile
      margin-bottom: 0
      border-radius: 0

.action-card-header
  position: relative
  padding-right: 3rem

  .title.var--gus-title
    font-size: 1.8rem

.price-reduction
  font-size: 0.8rem
  font-style: normal
  font-weight: bolder

.listing-favorite
  position: absolute
  top: 50%
  right: 0
  transform: translateY(-50%)

  a
    font-size: 28px

.listing-actions
  margin-bottom: 0.4em

  +mobile
    margin: 0 -20px 0 -20px

.share-listing
  display: inline-block
  text-decoration: none

  i
    display: inline-block
    margin-right: 2px

  span
    text-decoration: underline

.fav-icon
  display: flex
  padding: 5px
  margin: -0.4em 0
  text-align: center
  width: 42px
  height: 42px

.share-box
  position: absolute
  z-index: 3
  top: 50%
  right: 0
  transform: translateY(-50%)
  transition: opacity 250ms ease-in-out, transform 250ms ease-in-out

  &.is-closed
    opacity: 0
    transform: translateY(-50%) translateX(50%)
    pointer-events: none

.subtitle
  min-height: 1rem

+with-palette
  .action-card-container
    .card
      color: var(--#{$palette}-text)
      background: var(--#{$palette}-bgColor)

.rm-dark-website
  .action-card-container
    .card
      border: solid 1px

.slider-date-picker
  border: solid 2px #80808085
  cursor: pointer
  margin: 3px
  &:hover
    border: solid 2px black
.selected-date
  border: solid 2px black
  cursor: pointer
  margin: 3px
.slider-date
  font-family: var(--fonts-title-family)
  font-size: 35px
.slider-day
  font-family: var(--default-text)
.slider-month
  font-family: var(--default-text)
.tour-type__container
  height: 55px
  margin-bottom: 0
  .button
    height: 36px
.btn-disabled
  cursor: not-allowed
.prev-button
  left: -15px
  transform: rotate(180deg)
.next-button
  right: -15px
.arrow-button
  top: 37px
  position: absolute
  border: 1px solid grey
  border-radius: 50%
  height: 40px
  width: 40px
  z-index: 3
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  background: white
.text-align-left
  text-align: left
</style>
