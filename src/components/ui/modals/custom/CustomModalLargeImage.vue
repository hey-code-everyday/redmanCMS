<template>
<div class="">
  <div class="modal-box__content">

    <!-- Image View-->
    <div class="modal-content">

      <!-- Menu -->
      <nav class="level is-mobile">
        <!-- Left side -->
        <div class="level-left">
          <div class="heart-item level-item">
            <Heart :mls="listing.id || listing.publicId" :address="listing.address" isEDM="true" />
          </div>

          <div class="level-item" v-show="listing.location">
            <i class="icon modal-icon icon-map-marker" @click="showMap = !showMap"/>
          </div>

          <div class="level-item" @click="view = 'shareListing'">
            <i class="icon modal-icon icon-share2"/>
          </div>

          <div v-show="view != 'listing'" class="level-item button" @click="view = 'listing'">
            Back
          </div>

        </div>

        <!-- Right side -->
        <div v-show="view === 'listing'" class="level-right is-hidden-mobile">
          <div class="listing-info level-item courtesy-of" v-if="listing.agent && listing.agent.length">
            {{ getCourtesyOf }}
          </div>
        </div>
      </nav>

      <div class="view-container">
        <!-- Image View-->
        <img v-show="view === 'listing'" class="is-image is-hidden-mobile" :src="listing.images[currentIndex]">
        <img v-show="view === 'listing'" class="is-image is-hidden-tablet" v-for="(image, index) in listing.images":src="image">
        <div v-show="view === 'listing'" class="level-item is-hidden-desktop is-hidden-mobile">
          <div class="listing-info level-item courtesy-of" v-if="listing.agent && listing.agent.length">
            {{ getCourtesyOf }}
          </div>
        </div>

        <!-- Map View-->
        <div class="map-outer" :style="mapStyles" ref="map" v-show="showMap && listing.location && view === 'listing'">
          <google-map v-if="listing.location && listing.location.lat && listing.location.lon" :center="{ lat: listing.location.lat, lng: listing.location.lon }" />
        </div>

        <!-- Sharing View-->
        <div class="share-view" v-show="view === 'shareListing'" >
          <share-listing :listing="listing"></share-listing>
        </div>

        <!-- Form View-->
        <div v-if="formID" v-show="view === 'form'" class="form-view">
          <vue-redform :formID="formID" :extraData="extraData" :onSubmit="onSubmit" />
        </div>
      </div>
    </div>

    <!-- Button Desktop View-->
    <div v-show="view === 'listing' && !showMap" class="arrow-container right-arrow-container is-hidden-mobile">
      <div class="is-primary right-arrow-button" @click="increaseIndex">
        <i class="icon-chevron-right"/>
      </div>
    </div>
    <div v-show="view === 'listing' && !showMap" class="arrow-container left-arrow-container is-hidden-mobile">
      <div class="is-primary left-arrow-button" @click="decreaseIndex">
        <i class="icon-chevron-left"/>
      </div>
    </div>

  </div>

  <div v-show="view === 'listing'" class="modal-footer">
    <div class="listing-actions">
      <div class="button is-primary strap-button" @click="moreInfo">Get More Information</div>
      <div class="button is-outlined strap-button" @click="requestShowing">Request a Showing</div>
    </div>
  </div>

</div>
</template>

<script>
import mixinCustomModal from '@/mixins/custom-modal'
import favoriteListingMixin from '@/mixins/favorite-listing'
import {courtesyOf} from '@/helpers/listings'
import GoogleMap from '@/modules/listing-details/components/GoogleMap'
import Heart from '@/modules/listing-search/components/Results/Item/Heart'
import ShareListing from '@/components/ui/ShareListing'
import VueRedform from '@/components/VueRedform'
import ImageContainer from '@/modules/listing-search/components/Results/Item/ImageContainer'

// import CustomModalRedform from './CustomModalRedform'

export default {
  name: 'ModalCustomLargeImage',

  mixins: [mixinCustomModal],

  components: {
    GoogleMap,
    Heart,
    ShareListing,
    VueRedform,
    ImageContainer
  },

  data () {
    return {
      currentIndex: this.state.currentIndex,
      showMap: false,
      forms: this.state.forms,
      listing: this.state.listing,
      view: 'listing',
      formID: '',
      extraData: {
        listingID: this.state.listing.publicId || this.state.listing.id
      }
    }
  },

  computed: {
    mapStyles () {
      const y = this.showMap ? 7 : 100

      return {
        transform: `translateY(${y}%)`
      }
    },
    getCourtesyOf () {
      return courtesyOf(this.$store, this.listing)
    }
  },

  methods: {
    decreaseIndex () {
      // lowers map if arrows are clicked on
      if (this.showMap) this.$set(this, 'showMap', false)

      this.$set(this, 'currentIndex', this.currentIndex - 1)
      this.updateIndex()
    },

    increaseIndex () {
      // lowers map if arrows are clicked on
      if (this.showMap) this.$set(this, 'showMap', false)

      this.$set(this, 'currentIndex', this.currentIndex + 1)
      this.updateIndex()
    },

    updateIndex () {
      if (this.currentIndex < 0) {
        this.$emit('changeIndex', this.listing.images.length - 1)
        this.$set(this, 'currentIndex', this.listing.images.length - 1)
      } else if (this.currentIndex >= this.listing.images.length) {
        this.$emit('changeIndex', 0)
        this.$set(this, 'currentIndex', 0)
      } else {
        this.$emit('changeIndex', (this.currentIndex))
      }
    },

    onSubmit () {
      this.$emit('submit')
      this.view = 'listing'
    },

    moreInfo () {
      this.showMap = false
      this.formID = this.forms.moreInfo
      this.view = 'form'
    },

    requestShowing () {
      this.showMap = false
      this.formID = this.forms.requestShowing
      this.view = 'form'
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

$mapColor: #efebe2

.modal-background
  background-color: rgba(10,10,10,0.86)!important

.modal-custom
  justify-content: center
  +mobile
    width: 100% !important
    height: 100% !important

.modal-box__content
  display: flex
  justify-content: center
  align-items: center
  padding: 0
  background: transparent
  margin-top: -2.5em
  +touch
    display: block
    padding: 0px 50px
  +mobile
    padding: 0px

.modal-box__inner
  position: relative
  width: 100%

.level:not(:last-child)
  margin-bottom: 1rem

.field:not(:last-child)
  margin-bottom: 0.25rem

.modal-icon
  font-size: 1.5rem

.listing-info
  font-size: 1rem

.heart-item
  margin-right: 5px

  /deep/
  +mobile
    position: fixed
    top: 20px
    left: 20px
    z-index: 1
    .item__like.is-edm
      padding: 1px 0px 0px 0px

.map-outer
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 2
  background-color: $mapColor
  transition: transform 350ms ease-in-out
  +mobile
    margin-top: 10px

.arrow-container
  position: absolute
  font-size: 2rem
  +desktop
    top: 45%
  +touch
    top: 55%

.left-arrow-container
  text-align: left
  +desktop
    left: 50px
  +touch
    left: 5px

.right-arrow-container
  text-align: right
  +desktop
    right: 67px
  +touch
    right: 5px

.modal-footer
  margin-top: 5px
  width: 100%
  text-align: center
  position: absolute

.listing-actions
  bottom: 0

.modal-content
  text-align: center
  +desktop
    width: 50vw
  +touch
    height: 100%
    width: 100%
    margin-left: 0px!important
  +mobile
    margin-top: 0px
    max-height: calc(100vh - 76px)

.view-container
  +desktop
    max-height: 65vh
  +mobile
    max-width: 100%
    margin-left: auto
    margin-right: auto

.form-view
  text-align: left

.share-view
  transform: translateY(10%)
  +desktop
    min-height: 425px
  +touch
    min-height: 55vh

.is-image
  +desktop
    max-height: 64vh
    width: auto
    margin-left: -20px
  +mobile
    max-height: 60vh

.courtesy-of
  +mobile
    max-width: 100%

.listing-actions
  +mobile
    position: fixed
    background: white
    padding: 5px 0
    width: 100%
  .button
    +touch
      margin: 5px
      width: 90%
    +mobile
      width: 96%
  .button.is-primary
    color: var(--default-uiPrimary-text)
    background-color: var(--default-uiPrimary-bgColor)
    +desktop
      margin-right: 50px
  .button.is-outlined
    color: var(--default-uiPrimary-bgColor)

</style>
