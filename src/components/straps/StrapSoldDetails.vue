<template>
  <div :class="outerClass">
    <!-- Nag -->
    <nag-bar v-if="!isCompleteVow && isDDF" />

    <div v-if="!hideResults && !hideListingResults">
      <template v-if="error">
        <div class="strap-container container">
          <listing-no-results :mls="mls" />
        </div>
      </template>

      <template v-else>
        <!-- Gallery -->
        <div :class="galleryClass" style="position: relative">
          <div v-if="loading">Loading...</div>
          <simple-gallery
            v-if="$store.getters.isIE11"
            :listing="listing"
            :strap="strap"
          />
          <listing-gallery
            v-else-if="!isLarge"
            :listing="listing"
            :strap="strap"
          />
          <large-listing-gallery
            v-else
            :forms="{
              moreInfo: strap_state.formMoreInfo.formID,
              requestShowing: strap_state.formRequestShowing.formID
            }"
            :listing="listing"
            :strap="strap"
          />
        </div>

        <!-- Navigation -->
        <div v-if="loading">Loading...</div>
        <listing-nav
          v-else-if="listing.breadcrumbs"
          :breadcrumbs="listing.breadcrumbs"
        />

        <div
          :class="
            `strap-container container pad-${isLarge ? 'small' : 'medium'}`
          "
        >
          <div v-if="loading" class="strap-listing-details__loading">
            Loading...
          </div>

          <div v-else class="strap-listing-details__details">
            <div class="columns">
              <div class="column">
                <!-- Nag Bar -->
                <!-- <NagBar v-if="process.browser" /> -->

                <!-- Header -->

                <p
                  v-if="listing.agent && listing.agent.length"
                  style="line-height:1.1"
                >
                  <span v-if="isEREB">
                    {{ getCourtesyOf }}
                  </span>
                  <span v-else>
                    <small class="is-soft var--gus-text-soft">
                      {{ getCourtesyOf }}
                    </small>
                  </span>
                </p>
                <listing-header
                  :listing="listing"
                  :forms="{
                    moreInfo: strap_state.formMoreInfo.formID,
                    requestShowing: strap_state.formRequestShowing.formID
                  }"
                  :theme="strap_style.theme"
                  class="listing-container"
                />
                <listing-sold-result
                  :listing="listing"
                  :theme="strap_style.theme"
                  class="listing-container"
                />

                <!-- Bed, bath, size -->
                <listing-icons :listing="listing" class="listing-container" />

                <!-- Ammenities SHOULD BE REMOVED IN THE FUTURE -->
                <listing-amenities
                  v-if="
                    listing.facts && listing.facts.length && !listing.amenities
                  "
                  :listing="listing"
                  class="listing-container"
                />

                <!-- Updated Ammenities Tags 6/11/19, not found in all boards -->
                <listing-amenities-update
                  v-if="
                    (!listing.facts || !listing.facts.length) &&
                      listing.amenities &&
                      listing.amenities.length
                  "
                  :listing="listing"
                  class="listing-container"
                />

                <!-- Description -->
                <listing-description
                  v-if="listing.description"
                  :listing="listing"
                  class="listing-container"
                />

                <!-- Key details -->
                <listing-table
                  v-if="listing.facts && listing.facts.length"
                  :listing="listing"
                  class="listing-container"
                />

                <listing-additional-details
                  v-if="hasAdditionalDetails"
                  :listing="listing"
                  class="listing-container"
                />

                <!-- Vow facts -->
                <listing-vow-facts
                  v-if="hasVow"
                  :listing="listing"
                  class="listing-container"
                />

                <div
                  class="mls-realtor-logo-container"
                  v-if="!isDarkTheme && isDDF"
                >
                  <img
                    class="mls-realtor-logo"
                    style="margin-right: 15px;"
                    src="//cdnassets.rmcloud.com/shared-images/general/MLS_BW.png"
                  />
                  <img
                    class="mls-realtor-logo"
                    style="margin-left: 10px;"
                    src="//cdnassets.rmcloud.com/shared-images/general/REALTOR_BW.png"
                  />
                </div>
                <div
                  class="mls-realtor-logo-container"
                  v-if="isDarkTheme && isDDF"
                >
                  <img
                    class="mls-realtor-logo"
                    src="//cdnassets.rmcloud.com/shared-images/general/MLS_W.png"
                  />
                  <img
                    class="mls-realtor-logo"
                    style="margin-left: 10px;"
                    src="//cdnassets.rmcloud.com/shared-images/general/REALTOR_W.png"
                  />
                </div>

                <!-- Disclaimer -->
                <!-- <p class="disclaimer" v-if="state.nag && state.nag.remoteProfile && state.nag.remoteProfile.listingDetails && state.nag.remoteProfile.listingDetails.listingDetailsDisclaimer">
                  {{ state.nag.remoteProfile.listingDetails.listingDetailsDisclaimer }}
                </p> -->
              </div>
              <div class="column is-one-third">
                <!-- Side panel -->
                <listing-action-card
                  :listing="listing"
                  :forms="{
                    moreInfo: strap_state.formMoreInfo.formID,
                    requestShowing: strap_state.formRequestShowing.formID
                  }"
                  :theme="strap_style.theme"
                  @submit="formSubmitted"
                />

                <listing-mortgage-card
                  :listing="listing"
                  :forms="{
                    moreInfo: strap_state.formMoreInfo.formID,
                    requestShowing: strap_state.formRequestShowing.formID
                  }"
                  :theme="strap_style.theme"
                  v-show="!isMobile"
                  @submit="formSubmitted"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {getAvailableForms} from '@/helpers/redforms'
import {
  mapListings,
  decodeSearch,
  courtesyOf,
  encodeDetailsUrl,
  changeSoldResponseJsonStructure
} from '@/helpers/listings'

import api from '@/api'
import mixinStrap from '@/mixins/strap'
import ListingNav from 'listing-details@/components/listing/ListingNav'
import ListingIcons from 'listing-details@/components/listing/ListingIcons'
import ListingTable from 'listing-details@/components/listing/ListingTable'
import ListingHeader from 'listing-details@/components/listing/ListingHeader'
import defaultRedform from '@/store/defaults/components/vue-redform'
import LargeListingGallery from 'listing-details@/components/gallery/LargeGallery'
import ListingGallery from 'listing-details@/components/gallery/Gallery'
import SimpleGallery from 'listing-details@/components/gallery/SimpleGallery'
import ListingVowFacts from 'listing-details@/components/listing/ListingVowFacts'
import ListingAdditionalDetails from 'listing-details@/components/listing/ListingAdditionalDetails'
import ListingAmenities from 'listing-details@/components/listing/ListingAmenities'
import ListingAmenitiesUpdate from 'listing-details@/components/listing/ListingAmenitiesUpdate'
import ListingNoResults from 'listing-details@/components/NoResults'
import ListingActionCard from 'listing-details@/components/listing/ListingActionCard'
import ListingMortgageCard from 'listing-details@/components/listing/ListingMortgageCard'
import ListingDescription from 'listing-details@/components/listing/ListingDescription'
import ListingSoldResult from 'listing-details@/components/listing/ListingSoldResult'

function fetchSoldDetails(store, mls, done, error) {
  const getBreadcrumbs = listing => {
    if (listing.location) {
      api
        .getHierarchiesByLatLon(store.state, listing.location)
        .then(response => {
          if (response.status === 200 && response.body)
            listing.breadcrumbs = response.body
          done(listing)
        })
        .catch(err => {
          console.warn(err)
          done(listing)
        })
    } else {
      done(listing)
    }
  }

  api
    .getSoldDetail(store.state, mls)
    .then(response => {
      if (response.body.ok) {
        const listing = changeSoldResponseJsonStructure(response.body.listing)

        listing.breadcrumbs = undefined

        listing.publicInfo = {
          additionalMedia: []
        }
        getBreadcrumbs(listing)
      } else {
        error(new Error(`No listings found. ${mls}. ${response}`))
      }
    })
    .catch(err => {
      error(err)
    })
}

function mlsFromUrl(url) {
  if (url.indexOf('/sold/') === -1) {
    return false
  } else {
    return [url.split('--').slice(-1)[0]]
  }
}

export default {
  name: 'StrapSoldDetails',

  components: {
    ListingNav,
    ListingIcons,
    ListingTable,
    ListingHeader,
    SimpleGallery,
    LargeListingGallery,
    ListingGallery,
    ListingVowFacts,
    ListingAdditionalDetails,
    ListingAmenities,
    ListingAmenitiesUpdate,
    ListingNoResults,
    ListingActionCard,
    ListingMortgageCard,
    ListingDescription,
    ListingSoldResult,
    NagBar: () =>
      import(
        /* webpackChunkName: "nag-bar" */ '@/modules/nags/components/NagBar.vue'
      )
  },

  mixins: [mixinStrap],

  metaInfo() {
    const l = this.$data.listing
    const config = this.$store.state.config

    if (!l || l.empty !== undefined) {
      return {
        title: 'Listing Not Found',
        htmlAttrs: {
          statusCode: 404
        }
      }
    }

    let title = []
    if (l.address) title.push(l.address)
    if (l.city) title.push(l.city)
    if (l.province) title.push(l.province)
    title = title.join(', ') + ` | MLS® # ${l.publicId}`

    let link = []
    const protocol = this.$store.state.config.websiteProtocol || 'https'
    const hostname = this.$store.state.config.websiteDomain
    const canonicalUrl = `${protocol}://${hostname}${encodeDetailsUrl(l)}`
    if (this.$store.state.config.requestUrl !== canonicalUrl) {
      link.push({rel: 'canonical', href: canonicalUrl})
    }

    const meta = [
      {vmid: 'description', name: 'description', content: l.description},
      {vmid: 'canonical', rel: 'canonical', href: canonicalUrl},

      // Facebook
      {vmid: 'og:title', property: 'og:title', content: title},
      {
        vmid: 'og:description',
        property: 'og:description',
        content: l.description
      },
      {vmid: 'og:url', property: 'og:url', content: canonicalUrl},

      // Twitter
      {
        vmid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {vmid: 'twitter:title', name: 'twitter:title', content: title},
      {
        vmid: 'twitter:description',
        name: 'twitter:description',
        content: l.description
      },
      {vmid: 'twitter:url', name: 'twitter:url', content: canonicalUrl}
    ]

    if (l.images && l.images.length > 0) {
      meta.push({vmid: 'og:image', property: 'og:image', content: l.images[0]})
      meta.push({
        vmid: 'og:image:height',
        property: 'og:image:height',
        content: '800'
      })
      meta.push({
        vmid: 'og:image:width',
        property: 'og:image:width',
        content: '1200'
      })
      meta.push({
        vmid: 'og:image:alt',
        property: 'og:image:alt',
        content: title
      })
      meta.push({
        vmid: 'twitter:image',
        name: 'twitter:image',
        content: l.images[0]
      })
    }

    const ldJson = {
      '@context': 'http://schema.org',
      '@type': 'Product',
      name: title,
      description: l.description,
      offers: {
        price: l.price,
        priceCurrency: 'CAN',
        availability: 'http://schema.org/InStock',
        url: canonicalUrl
      }
    }
    if (l.images && l.images.length > 0) ldJson.image = l.images[0]

    let residenceSchemaType = 'Place'
    l.building_types.forEach(t => {
      if (t === 'house') residenceSchemaType = 'SingleFamilyResidence'
      if (t === 'condo') residenceSchemaType = 'SingleFamilyResidence'
      if (t === 'townhouse') residenceSchemaType = 'SingleFamilyResidence'
    })

    const residenceSchema = {
      '@context': 'http://schema.org',
      '@type': residenceSchemaType,
      address: {
        '@context': 'http://schema.org',
        '@type': 'PostalAddress',
        streetAddress: l.address,
        addressLocality: l.city,
        addressRegion: l.province
      }
    }
    if (l.location && l.location.lat) {
      residenceSchema.geo = {
        '@context': 'http://schema.org',
        '@type': 'GeoCoordinates',
        latitude: l.location.lat,
        longitude: l.location.lon
      }
    }

    return {
      title,
      meta,
      link,
      script: [
        {
          innerHTML: JSON.stringify(ldJson),
          type: 'application/ld+json'
        },
        {
          innerHTML: JSON.stringify(residenceSchema),
          type: 'application/ld+json'
        }
      ]
    }
  },

  prefetch(resolve, reject, store, state) {
    const mls = mlsFromUrl(store.state.config.requestUrl)

    const done = listing => {
      store.commit('SET_HEADER_META', {
        mls: listing.id,
        title: listing.address || 'Listing'
      })
      store.commit('SET_FOOTER_META', {
        state: state.state,
        listing
      })

      resolve(listing)
    }

    fetchSoldDetails(store, mls, done, reject)
  },

  afterPrefetch(err, result) {
    if (err) {
      this.loading = false
      this.$set(this, 'error', err)

      console.warn(err)
      return
    }

    const mls = mlsFromUrl(this.$store.state.config.requestUrl)
    const listing = result

    this.mls = mls

    if (!mls || !listing) {
      err = new Error('No listings found.')

      this.loading = false
      this.$set(this, 'error', err)
      console.warn(err)

      return
    }

    this.loading = false
    this.$set(this, 'listing', listing)
  },

  data() {
    return {
      mls: '',
      error: false,
      loading: true,
      listing: {empty: true},
      hideResults: false,
      isVow: false
    }
  },

  watch: {
    isVow(nextIsVow) {
      this.toHideResults()
    }
  },

  computed: {
    hasVow() {
      return (
        this.listing.vow_facts && Object.keys(this.listing.vow_facts).length
      )
    },

    isDDF() {
      return this.$store.state.config.sources[0] === 'idx-ddf-v5'
    },

    isDarkTheme() {
      return this.$store.state.website.theme.dark
    },

    isMobile() {
      return this.$store.getters.isMobile
    },

    hasAdditionalDetails() {
      return (
        this.listing.additionalDetails &&
        Object.keys(this.listing.additionalDetails).length
      )
    },

    isOwnListing() {
      var listingAgents = this.listing.agent
      var siteAgent = this.$store.state.website.config.setup.agentID
      var foundAgent = false

      for (var i = 0; i < listingAgents.length; i++) {
        if (listingAgents[i].id.toLowerCase() === siteAgent.toLowerCase()) {
          foundAgent = true
        }
      }

      return foundAgent
    },

    isCompleteVow() {
      this.$set(this, 'isVow', this.$store.getters.isVow)
      return this.$store.getters.isVow
    },

    hideListingResults() {
      return this.toHideResults()
    },

    isLarge() {
      return true
      // const viewPicker = this.strap_state.viewPicker || ''
      //
      // return (viewPicker === 'useLargeListingDetails')
      //   || (viewPicker === 'useLargeListingDetailsForOwn' && this.isOwnListing)
    },

    outerClass() {
      return (this.isLarge ? 'large-' : '') + 'strap-listing-details'
    },

    galleryClass() {
      return (this.isLarge ? 'large-' : '') + 'strap-listing-details__gallery'
    },

    getCourtesyOf: function() {
      return courtesyOf(this.$store, this.listing)
    },
    isEREB() {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  created() {
    this.toHideResults()
    if (this.hideResults) this.$store.dispatch('attemptVow')
  },

  methods: {
    openMap() {
      this.mapLoaded = true
      this.$store.commit('setAnchor', 'map')
    },

    toHideResults() {
      //first condition checks for VOW; second condition checks for DDF acceptance
      let toHide =
        (this.$store.getters.message('hideAllListingsUntilUserVow') &&
          !this.isCompleteVow) ||
        (this.$store.state.config.sources[0] === 'idx-ddf-v5' &&
          !this.isCompleteVow)

      this.$set(this, 'hideResults', toHide)
    },

    formSubmitted() {
      console.log('did it')
    }
  },

  initialState(strap, state) {
    return {
      formMoreInfo: defaultRedform({formID: 'gus-details-more-info'}),
      formRequestShowing: defaultRedform({
        formID: 'gus-details-request-showing'
      })
    }
  },

  schema() {
    return [
      {
        title: 'Forms',
        tabs: [
          {
            title: 'Forms',
            initial: true,
            fields: [
              {
                key: 'state.formMoreInfo.formID',
                type: 'dropdown',
                label: 'More Info Form',
                options() {
                  return getAvailableForms.call(this, this.$store.state, true)
                },
                default: 'gus-details-more-info',
                hint:
                  "The name of the form you'd to use for the More Info modal."
              },
              {
                key: 'state.formRequestShowing.formID',
                type: 'dropdown',
                label: 'Request Showing Form',
                options: [
                  {
                    value: 'gus-details-request-showing',
                    text: 'Request Showing'
                  }
                ],
                default: 'gus-details-request-showing',
                hint:
                  "The name of the form you'd to use for the Request Showing modal."
              }
            ]
          }
        ]
      }
      // {
      //   title: 'Display',
      //   tabs: [
      //     {
      //       title: 'Display',
      //       fields: [
      //         {
      //           key: 'state.viewPicker',
      //           type: 'dropdown',
      //           label: 'Listing Display Type',
      //           default: 'useStandardView',
      //           options: [
      //             { text: 'Standard View', value: 'useStandardView' },
      //             { text: 'Large View', value: 'useLargeListingDetails' },
      //             { text: 'Large View on Personal Listings only', value: 'useLargeListingDetailsForOwn' }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'
@import '../../assets/sass/variables'

.large-strap-listing-details
  max-width: 100vw

.large-strap-listing-details__gallery
  +mobile
    height: 40vh
  +tablet
    height: 50vh
  +desktop
    height: 50vh
  +widescreen
    height: 70vh

.strap-listing-details
  max-width: 100vw


.mls-realtor-logo
  width: auto
  height: 50px
  background-size: contain!important
  background-repeat: no-repeat!important

/deep/
  .listing-container
    margin-bottom: 2.5rem !important
    +mobile
      margin-bottom: 20px !important
      h2.title
        font-size: 16px !important
        margin-bottom: 10px
</style>
