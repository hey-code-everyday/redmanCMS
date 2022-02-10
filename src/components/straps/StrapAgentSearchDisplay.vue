<template>
  <div class="strap-agent-profile" ref="strap">
    <div class="strap-container container pad-small">

      <div v-for="agent in filterRoster">
        <div class="columns">
          <div class="column">
            <!-- Agent Photo -->
            <div class="agent-container">
              <img v-if="!agent.truUser.photoURL || agent.truUser.photoURL === ' '" :alt="agent.truUser.displayName" class="agent-image" :src="getSrc"/>
              <img v-if="agent.truUser.photoURL && agent.truUser.photoURL != ' '" :alt="agent.truUser.displayName" class="agent-image" :src="agent.truUser.photoURL">
            </div>
          </div>

          <!-- Agent Info -->
          <div class="column agent-information is-two-thirds-desktop has-text-left">
            <span class="title"> {{ agent.truUser.displayName }}</span>

            <!-- Social Media Mobile -->
            <span class="is-hidden-desktop is-hidden-tablet has-text-right" style="margin-left: 15px">
              <span v-if="agent.extra_info" class="social-icons" style="font-size: 18px">
                <a
                  v-for="(social, i) in agent.extra_info.profileLinks"
                  v-if="agent.extra_info.profileLinks"
                  target="_blank"
                  class="social-icon"
                  :href="social.url"
                  style="padding: 2px, width: 34px, height: 34px"
                >
                  <span  v-if="social.type != 'website'" class="icon">
                    <i :class="`socicon-${social.type}`"></i>
                  </span>
                  <span  v-if="social.type === 'website'" class="icon">
                    <i :class="`icon-desktop`"></i>
                  </span>
                </a>
              </span>
            </span>

            <br/>

            <span class="subtitle is-soft" style="font-size: 16px" v-if="agent.organization"> {{ agent.organization.name }} </span> <br/><br/>

            <!-- Agent Info  -->
            <div class="columns is-mobile">
              <div class="column is-narrow has-text-left">
                <span v-if="agent.truUser.mobilePhones[0]" class="is-soft"> Phone</span> <br/>
                <span v-if="agent.truUser.email" class="is-soft"> Email</span><br/>
                <span v-if="agent.extra_info">
                  <span v-if="agent.extra_info.speaks && agent.extra_info.speaks[0] != ' ' " class="is-soft"> Speaks</span><br/>
                </span>
              </div>
              <div class="column has-text-left">
                <span v-if="agent.truUser.mobilePhones[0]"> {{ agent.truUser.mobilePhones[0] }} </span> <br/>
                <span v-if="agent.truUser.email"> {{ agent.truUser.email }}</span>  <br/>
                <span v-if="agent.extra_info">
                  <span v-if="agent.extra_info.speaks && agent.extra_info.speaks[0] != ' '" v-for="language in agent.extra_info.speaks">
                   {{language}}
                  </span>
                </span>
              </div>
            </div>

            <!-- Agent Bio -->
            <div v-if="agent.extra_info" >
              <div v-if="agent.extra_info.bio">
                <p class="bio" v-html="agent.extra_info.bio">
                </p>
                <br/>
                <br/>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-buttons">

          <a v-if="agent.truUser.email" :href="`mailto:${ agent.truUser.email }`">
            <button class="button strap-button is-primary">Email {{ agent.truUser.displayName.split(" ")[0] }}</button>
          </a>
          <a v-if="agent.truUser.mobilePhones[0]" :href="`tel:${ agent.truUser.mobilePhones[0] }`">
            <button class="button strap-button is-primary">Call {{ agent.truUser.displayName.split(" ")[0] }}</button>
          </a>

          <!-- Social Media Desktop -->
          <span class="is-hidden-mobile" style="margin-left: 15px">
            <span v-if="agent.extra_info" class="social-icons" style="font-size: 20px">
              <a
                v-for="(social, i) in agent.extra_info.profileLinks"
                v-if="agent.extra_info.profileLinks"
                target="_blank"
                class="social-icon"
                :href="social.url"
                style="padding: 2px, width: 34px, height: 34px"
              >
                <span  v-if="social.type != 'website'" class="icon">
                  <i :class="`socicon-${social.type}`"></i>
                </span>
                <span  v-if="social.type === 'website'" class="icon">
                  <i :class="`icon-desktop`"></i>
                </span>
              </a>
            </span>
          </span>
        </div>

        <br/>

        <!-- Agent Listings (referencced from Latest Listings Strap -->
        <hr v-if="filteredListings.length"/>
        <div :class="`custom-strap-container container`" v-if="filteredListings.length">
          <div class="listing-title has-text-left">
            <span class="title">{{ agent.truUser.displayName.split(" ")[0] }}'s Listings</span><br/>
          </div>
          <br/>

          <div class="agent-listings">
            <div class="strap-latest-listings__pagination" :class="isEREB ? 'is-ereb is-hidden-mobile' : ''" v-if="filteredListings.length">
              <div :class="[ 'strap-latest-listings__pagination-left', (first ? 'is-disabled' : false) ]">
                <div class="button is-primary" @click="previous">
                  <span class="icon"><i class="icon-chevron-left"></i></span>
                </div>
              </div>
              <div :class="[ 'strap-latest-listings__pagination-right', (last ? 'is-disabled' : false) ]">
                <div class="button is-primary" @click="next">
                  <span class="icon"><i class="icon-chevron-right"></i></span>
                </div>
              </div>
            </div>
            <div class="container custom-listing-container" style="padding-left: 0px" v-if="filteredListings.length">
              <div class="columns">
                <div class="column is-listings">
                  <ListingSlide :currentIndex="currentIndex" :error="error" :loading="loading" :listings="listings" :strapPalette="strap_palette" ></ListingSlide>
                </div>
                <div v-show="isEREB && filteredListings.length" class="column is-hidden-desktop is-hidden-tablet" style="padding: 0">
                  <div class="strap-latest-listings__pagination" :class="isEREB ? 'is-ereb' : ''" v-if="filteredListings.length">
                    <div :class="[ 'strap-latest-listings__pagination-left', (first ? 'is-disabled' : false) ]">
                      <div class="strap-button button is-primary" @click="previous">
                        <span class="icon"><i class="icon-chevron-left"></i></span>
                      </div>
                    </div>
                    <div :class="[ 'strap-latest-listings__pagination-right', (last ? 'is-disabled' : false) ]">
                      <div class="strap-button button is-primary" @click="next">
                        <span class="icon"><i class="icon-chevron-right"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { clamp } from '@/util'
import mixinStrap from '@/mixins/strap'
import ListingSlide from '@/components/ListingSlide.vue'
import EditableTitle from '@/components/editable/EditableTitle'
import defaultTitle from '@/store/defaults/components/title'
import { prefetch, afterPrefetch } from '@/helpers/agent-roster'
import {
  prefetchListings
} from '@/helpers/listings'

function getAgentFromUrl (url) {
  const agent = /\/agent\/(\w*)/.exec(url)
  if (!agent) return ''
  let agentReplaced = agent[1]
    .replace('https://', '')
    .replace('http://', '')
    .replace('//', '')
    .replace('localhost:8080', '')
    .replace('localhost:3000', '')
    .replace('localhost:8081', '')
    .replace('/agent/', '')
    .replace(/_/g, ' ')
    .split('-')

  return agentReplaced[0]
}

export default {
  name: 'StrapSearchDisplay',

  components: {
    EditableTitle,
    ListingSlide
  },

  mixins: [mixinStrap],

  metaInfo () {
    var agent = this.agent
    const { website, config } = this.$store.state

    if (agent && agent.truUser) {
      const ldJson = {
        '@context': 'http://schema.org',
        '@type': 'Person',
        'name': (agent ? agent.truUser.displayName : website.config.display.siteName),
        'url': config.requestUrl,
        'email': (agent.truUser.email ? agent.truUser.email : website.config.office.email),
        'telephone': (agent.truUser.mobilePhones !== '' ? agent.truUser.mobilePhones[0] : website.config.office.phone),
        'description': 'The profile of ' + (agent ? agent.truUser.displayName : website.config.display.siteName),
        'hasOccupation': (agent.truUser.role ? agent.truUser.role : 'employee')
      }

      const meta = []
      const title = (agent ? agent.truUser.displayName : website.config.display.siteName)
      const description = 'The profile of ' + (agent ? agent.truUser.displayName : website.config.display.siteName)

      // Facebook

      meta.push({
        vmid: 'og:type',
        property: 'og:type',
        content: 'profile'
      })
      meta.push({
        vmid: 'og:title',
        property: 'og:title',
        content: title
      })
      meta.push({
        vmid: 'og:description',
        property: 'og:description',
        content: description
      })

      // Twitter

      meta.push({ vmid: 'twitter:title', name: 'twitter:title', content: title })
      meta.push({ vmid: 'twitter:description', name: 'twitter:description', content: description })

      return {
        title,
        meta: [
          {
            name: 'description',
            content: description
          },
          ...meta
        ],
        script: [
          {
            innerHTML: JSON.stringify(ldJson),
            type: 'application/ld+json'
          }
        ]
      }
    }
  },

  computed: {
    filterRoster () {
      if (!this.agentRoster || this.agentRoster === {} || !this.agentRoster.length) return {}

      var agentFromUrl = getAgentFromUrl(this.$store.state.config.requestUrl)

      this.agent = this.agentRoster.find(agent => {
        return agent.truUser.displayName.toLowerCase().indexOf(agentFromUrl) > -1
      })

      return this.agentRoster.filter(agent => {
        return agent.truUser.displayName.toLowerCase().indexOf(agentFromUrl) > -1
      })
    },

    filteredListings () {
      if (!this.gotListings) {
        this.fetchListingData()
        this.gotListings = true
      }
      return this.listings.slice(this.currentIndex)
    },

    first () {
      return this.currentIndex === 0
    },

    last () {
      return this.currentIndex === this.listings.length - 1
    },
    getSrc () {
      return this.strap_state.defaultPhotoURL
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    }
  },

  watch: {
    strap_state () {
      this.fetchListingsData()
    }
  },

  prefetch,

  afterPrefetch,

  data () {
    return {
      agentRoster: {},
      agent: {},
      currentIndex: 0,
      gotListings: false,
      numListings: 50,
      error: false,
      loading: false,
      listings: [],
      search: [],
      preconfiguredSearch: [],
      // Animation
      delay: 150,
      lastDelay: 0
    }
  },

  methods: {
    fetchListingData () {
      var siteConfigBoard = this.$store.state.gus.config.sources[0]
      var agentId = this.agent.truUser.boardAgentIds[siteConfigBoard]

      new Promise((resolve, reject) => {
        const filters = {agent_id: agentId, size: 50}
        prefetchListings(resolve, reject, this.$store, this.strap_state, filters)
      }).then(result => {
        const listings = result.listings
        const search = result.search
        this.loading = false
        this.$set(this, 'error', false)
        this.$set(this, 'listings', listings)
        this.$set(this, 'preconfiguredSearch', search || {})
      }).catch(err => {
        console.warn(err)

        this.loading = false
        this.$set(this, 'error', err)
      })
    },

    next () {
      this.currentIndex = clamp(this.currentIndex + 1, 0, this.listings.length - 1)
    },

    previous () {
      this.currentIndex = clamp(this.currentIndex - 1, 0, this.listings.length - 1)
    },

    mounted () {
      if (this.listings.length === 0) this.fetchData()
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Meet The Team', size: 2 }),
      defaultPhotoURL: '//cdnassets.rmcloud.com/images/missing_person.png'
    }
  },

  schema () {
    return [
      {
        title: 'Meet The Team',
        tabs: [
          {
            title: 'Photo',
            initial: true,
            fields: [
              {
                key: 'state.defaultPhotoURL',
                type: 'text',
                label: 'Photo URL',
                default: '//cdnassets.rmcloud.com/images/missing_person.png',
                hint: 'Default picture if no agent photo fround'
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

$listingTransition: all 500ms
$listingTransform: translateX(calc(-100% - 2rem))

.strap-agent-profile
  hr
    margin: 2.5rem 0

.custom-strap-container
  +tablet
    padding-left: 0rem
    padding-right: 3rem
    padding-bottom: 3rem

  +mobile
    padding-left: 0px
    padding-right: 0px

.custom-listing-container
  +desktop
    padding: 1.25rem 1.25rem 1.25rem 10px

.agent-container
  +desktop
    text-align: right
    width: 320px
    margin-left: 50px

  +mobile
    text-align: center
    height: 400px

  .agent-image
    box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.3)
    +desktop
      width: 320px
    +mobile
      height: 400px

.agent-information
  line-height: 140%
  +mobile
    padding: 10px 10px 0 25px

  .columns
    margin-bottom: 0px!important

  .title
    +desktop
      font-size: 2em
    +mobile
      font-size: 1.5em

.contact-buttons
  +desktop
    display: flex
    justify-content: center
    align-items: center

.social-icons a
  color: var(--default-text)
  background-color: transparent
  font-size: 17px

.icon-desktop 
  +tablet
    margin-right: 15px

.strap-agent-listings
  position: relative
  min-height: 515px

.listing-title
  margin: 60px 0px 0px 0px

.agent-listings
  overflow: hidden

.columns
  position: relative
  z-index: 0

.strap-button
  min-width: 52px
  max-width: 95%
  padding-left: 50px
  padding-right: 50px
  transition: opacity 250ms ease-in-out

  +desktop
    margin: 20px
  +tablet
    margin: 20px
  +mobile
    margin: 10px

.strap-listing-button
  min-width: 52px
  max-width: 95%
  transition: opacity 250ms ease-in-out

  +desktop
    margin: 20px
  +tablet
    margin: 20px
  +mobile
    margin: 10px


.strap-latest-listings__pagination
  position: absolute
  z-index: 5
  display: flex
  pointer-events: none
  top: 50%
  right: 20px
  transform: translateY(-50%)
  justify-content: space-between

  +desktop
    &.is-ereb
      top: 95%
  +tablet
    &.is-ereb
      top: 95%

.strap-latest-listings__pagination-left
  margin-right: 1rem
  pointer-events: auto

.strap-latest-listings__pagination-right
  pointer-events: auto

.strap-button
  min-width: 52px
  transition: opacity 250ms ease-in-out

.is-disabled
  .strap-button
    pointer-events: none
    opacity: 0

  &.strap-latest-listings__pagination-right
    .strap-button
      opacity: 0.6

+mobile
  .strap-latest-listings__pagination
    left: 10px
    right: 10px
    top: 36%

    &.is-ereb
      position: relative
      margin: 25px 10px 0px -8px

      .strap-button
        min-width: 100px

    .strap-latest-listings__pagination-left
      justify-self: flex-start

    .strap-latest-listings__pagination-right
      justify-self: flex-end

</style>
