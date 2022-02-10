<template>
  <div class="strap-agent-search" ref="strap">
    <div :class="`custom-strap-container`">
      <div class="header-container container">
        <header class=' strap-header content'>
          <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
        </header>

        <!-- Search Bar and Filter -->
        <div class="toolbar level">
          <div class="filters has-text-left" style="width: 100%">
            <div class="search-bar">
              <span class="is-soft"> SEARCH AGENTS </span><br/>
              <div class="field level-left">
                <p class="control has-icons-left">
                  <input class="level-item input search-bar" type="text" id="searchInput" v-model="searchQuery" v-on:input="currentPage = 1" placeholder="Search by name, email or phone">
                  <span class="icon is-small is-left">
                    <i class="icon-magnifier"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="strap-agents__toolbar">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                    <div :class="[ 'dropdown', 'level-right', (toolbar.sortOpen ? 'is-active' : '') ]">
                      <div class="dropdown-trigger">
                        <span @click="toolbar.sortOpen = !toolbar.sortOpen">
                          <span>Sort by <strong>{{ toolbar.sortOptions[toolbar.filters.sort] }}</strong></span>
                          <span class="icon is-small">
                            <i class="icon-chevron-down"></i>
                          </span>
                        </span>
                      </div>
                      <div class="dropdown-menu">
                        <div class="dropdown-content">
                          <a v-for="(val, key) in toolbar.sortOptions" class="dropdown-item" @click="sortBy(key)">{{ val }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <br/><br/>

      <!-- Agent Cards -->
        <transition-group
          tag="div"
          name="fade"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
          class="columns is-multiline is-centered" id="rosterList"
          v-if="!error">
          {{$data}}
          <div v-for="(agent, index) in getRoster" v-if="getRoster.length > 0" :key="agent.truUser._id">
            <div class="column">
              <div class="agent-card">
                <a class="agent-card-link" :href="`/agent/${formatAgentUrl(agent.truUser.displayName)}`">
                  <!-- Agent Photo -->
                  <div class="agent-container">
                    <img v-if="!agent.truUser.photoURL || agent.truUser.photoURL === ' '" :alt="agent.truUser.displayName" class="agent-image" :src="getSrc"/>
                    <img v-if="agent.truUser.photoURL && agent.truUser.photoURL !== ' '" :alt="agent.truUser.displayName" class="agent-image" :src="agent.truUser.photoURL"/>
                  </div>
                  <!-- Agent Info -->
                  <div class="agent-information">

                    <div class="columns is-variable is-1">
                      <div class="column has-text-left" style="max-width: 90%;">
                        <span class="level-left tile-title displayName"> {{ agent.truUser.displayName }} </span><br class="is-hidden-desktop"/>
                        <span class="level-left subtitle is-soft info" v-if="agent.organization"> {{ agent.organization.name }} </span>
                      </div>

                      <!-- Social Media desktop -->
                      <div class="column is-narrow has-text-right is-hidden-mobile no-padding">
                        <span v-if="agent.extra_info" class="social-icons">
                          <a
                            v-for="(social, i) in agent.extra_info.profileLinks"
                            v-if="agent.extra_info.profileLinks"
                            target="_blank"
                            class="social-icon"
                            :href="social.url"
                            style="padding: 2px, width: 34px, height: 34px"
                          >
                            <span  v-if="social.type !== 'website'" class="icon">
                              <i :class="`socicon-${social.type}`"></i>
                            </span>
                            <span  v-if="social.type === 'website'" class="icon">
                              <i :class="`icon-desktop`"></i>
                            </span>
                          </a>
                        </span>
                      </div>
                    </div>

                    <!-- Agent Info -->
                    <div class="columns no-gap is-2 is-mobile mobile-agent-info">
                      <!-- Agent Info Non-Symbols Desktop -->
                      <div class="column is-narrow has-text-left is-hidden-mobile" >
                        <span v-if="agent.truUser.mobilePhones[0]" class="subtitle info is-soft">Phone</span><br/>
                        <span v-if="agent.truUser.email" class="subtitle info is-soft">Email</span><br/>
                        <span v-if="agent.extra_info">
                          <span v-if="agent.extra_info.speaks && agent.extra_info.speaks[0] !== ' '" class="subtitle info is-soft">Speaks</span><br/>
                        </span>
                      </div>
                      <!-- Agent Info Symbols Mobile -->
                      <div class="column is-narrow has-text-left is-hidden-desktop is-hidden-tablet" style="padding-right: 0px; padding-top: 15px">
                        <span v-if="agent.truUser.mobilePhones[0]" class="icon-telephone is-soft"></span><br/>
                        <span v-if="agent.truUser.email" class="icon-envelope-open is-soft"></span><br/>
                        <span v-if="agent.extra_info">
                          <span v-if="agent.extra_info.speaks && agent.extra_info.speaks[0] !== ' '" class="icon-bubble is-soft"></span><br/>
                        </span>
                      </div>
                      <!-- Agent Contact -->
                      <div class="column has-text-left">
                        <span v-if="agent.truUser.mobilePhones[0]" class="subtitle info">{{ agent.truUser.mobilePhones[0] }}</span> <br/>
                        <span v-if="agent.truUser.email" class="subtitle info">{{ agent.truUser.email }}</span> <br/>
                        <span v-if="agent.extra_info">
                          <span v-if="agent.extra_info.speaks && agent.extra_info.speaks[0] !== ' '" v-for="language in agent.extra_info.speaks" class="subtitle info">
                          {{language}}
                          </span>
                        </span>
                        <br/>
                      </div>
                    </div>

                    <!-- Social Media-->
                    <div class="column is-hidden-desktop is-hidden-tablet is-narrow is-soft has-text-left no-padding-left">
                      <span v-if="agent.extra_info" class="social-icons" style="font-size: 20px">
                        <a
                          v-for="(social, i) in agent.extra_info.profileLinks"
                          v-if="agent.extra_info.profileLinks"
                          target="_blank"
                          class="social-icon is-soft"
                          :href="social.url"
                          style="padding: 2px, width: 34px, height: 34px"
                        >
                          <span  v-if="social.type !== 'website'" class="icon">
                            <i :class="`socicon-${social.type}`"></i>
                          </span>
                          <span  v-if="social.type === 'website'" class="icon">
                            <i :class="`icon-desktop`"></i>
                          </span>
                        </a>
                      </span>
                    </div>
                  </div>
                </a>
            </div>
          </div>
        </div>
      </transition-group>

      <div class="strap-buttons" v-if="error || rosterTotal === 0">
        No Agents Found
        <br/>
      </div>

      <div class="strap-buttons" v-if="!error && getRosterLength > 1">
        <button class="inner-strap-button button" @click="goToPage(1)">
          <span class="icon-chevron-left"></span>
          <span class="icon-chevron-left"></span>
        </button>
        <button v-if="currentPage > 1"class="button is-primary" @click="goToPage(currentPage - 1)">
          <span class="icon-chevron-left"></span>
        </button>
        <span v-for="page in getEnumerationPages" :key="page">
          <button v-if="page !== currentPage" class="page-button button is-outlined" @click="goToPage(page)"> {{page }} </button>
          <button v-if="page == currentPage" class="page-button button is-primary"> {{page }} </button>
        </span>
        <span v-if="currentPage + 5 < getRosterLength">
          <div class="button">...</div>
        </span>
        <button v-if="currentPage < getRosterLength" class="button is-primary" @click="goToPage(currentPage + 1)">
          <span class="icon-chevron-right"></span>
        </button>
        <button v-if="currentPage < getRosterLength" class="inner-strap-button button" @click="goToPage(getRosterLength)">
          <span class="icon-chevron-right"></span>
          <span class="icon-chevron-right"></span>
        </button>
        <br/>
        <div class="button strap-button is-outlined" @click="scrollToTop">
          <span>Back to Top</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import EditableTitle from '@/components/editable/EditableTitle'
import defaultTitle from '@/store/defaults/components/title'
import { prefetch, afterPrefetch } from '@/helpers/agent-roster'

let Velocity = null
if (process.browser) Velocity = require('velocity-animate')

function hasPage (url) {
  var reg = /\/(page)/
  var page = reg.exec(url)

  return (!!page)
}

function getPageFromUrl (url) {
  var reg = /\/page\/(\d+)/
  var page = reg.exec(url)

  return (page ? page[1] : false)
}

function getQueryFromUrl (url) {
  var reg = /\/page\/\d+\?q=(.*)/
  var query = reg.exec(url)
  return (query ? query[1] : false)
}

export default {
  name: 'StrapAgentRoster',

  components: {
    EditableTitle
  },

  mixins: [mixinStrap],

  updated: function () {
    var url = `/agents/page/${this.currentPage}`
    if (this.searchQuery) url += `?q=${this.searchQuery}`
    window.history.pushState({}, '', url)
    return url
  },

  metaInfo () {
    const { website, config } = this.$store.state

    const ldJson = {
      '@context': 'http://schema.org',
      '@type': 'SearchResultsPage',
      'name': website.config.display.siteName,
      'url': config.requestUrl,
      'description': 'Page ' + this.currentPage + ' of ' + this.getRosterLength + ' showing the agents of ' + website.config.display.siteName
    }

    const meta = []
    const title = 'Find an Agent from ' + website.config.display.siteName
    const description = 'Page ' + this.currentPage + ' of ' + this.getRosterLength + ' showing the agents of ' + website.config.display.siteName

    // Facebook

    meta.push({
      vmid: 'og:type',
      property: 'og:type'
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
  },

  computed: {
    getRosterLength () {
      return Math.ceil(this.rosterTotal / this.strap_state.numResults)
    },

    getEnumerationPages () { // Reason for the #3 and #4: gets the next three page numbers
      var nextPages = []
      var totalLength = this.getRosterLength

      if (totalLength <= 4) {
        for (var i = 1; i <= totalLength; i++) {
          nextPages.push(i)
        }
      } else if ((this.currentPage + 3) > totalLength) {
        var start = 4 - (totalLength - this.currentPage)

        for (var i = this.currentPage - start; i <= totalLength; i++) {
          nextPages.push(i)
        }
      } else {
        for (var i = this.currentPage - 1; i < this.currentPage + 4; i++) {
          if (i > 0) {
            nextPages.push(i)
          }
        }
      }
      return nextPages
    },

    getSrc () {
      return this.strap_state.defaultPhotoURL
    },

    getRoster () {
      if (!this.agentRoster || this.agentRoster === {}) return {}

      var filteredResults = this.filterSearch()

      if (filteredResults) {
        var sortedRosterResults = this.sortRosterResults(filteredResults)

        return this.getPagedResults(sortedRosterResults)
      } else {
        return false
      }
    }
  },

  prefetch,

  afterPrefetch,

  data () {
    return {
      agentRoster: {},
      error: false,
      loading: false,
      moreResults: true,
      currentPage: 1,
      searchQuery: '',
      rosterTotal: 0,
      checkedPageUrl: false,
      checkQueryUrl: false,

      // Toolbar
      toolbar: {
        sortOpen: false,
        sortOptions: {
          name_des: 'Name A-Z',
          name_asc: 'Name Z-A'
        },
        filtersOpen: false,
        filters: {
          sort: 'name_des'
        }
      }
    }
  },

  methods: {
    scrollToTop () {
      const { strap } = this.$refs
      strap.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    },

    goToPage (page) {
      this.$set(this, 'currentPage', page)
      this.scrollToTop()
    },

    formatAgentUrl (agent) {
      // return agent.toLowerCase().replace(/[\W_]+/g, "_");
      return agent.toLowerCase().replace(/ - /g, '--').replace(/\//g, '_').replace(/ /g, '_')
    },

    sortBy (sort) {
      this.toolbar.filters.sort = sort
      this.toolbar.sortOpen = false
    },

    removeExtraChars (phoneNumber) {
      // regex: removes all characters that are not numbers
      if (phoneNumber) {
        return phoneNumber.replace(/[^0-9\.]+/g, '')
      }
    },

    checkPageQuery () {
      var currentUrl = this.$store.state.config.requestUrl
      var currentUrlQuery = getQueryFromUrl(currentUrl)
      this.checkedPageQuery = true

      if (currentUrlQuery) {
        this.$set(this, 'searchQuery', currentUrlQuery)
      }
    },

    filterSearch () {
      if (this.agentRoster.length) {
        if (!this.checkedPageQuery) this.checkPageQuery()

        return (this.agentRoster.filter(agent => {
          let mobile = this.removeExtraChars(agent.truUser.mobilePhones[0])

          return !this.searchQuery ||
            agent.truUser.displayName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 ||
            agent.truUser.email.toLowerCase().indexOf(String(this.searchQuery.toLowerCase())) > -1 ||
            (mobile && mobile.indexOf(String(this.searchQuery)) > -1)
            // agent.extra_info.speaks.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
        }))
      } else {
        return false
      }
    },

    sortRosterResults (filteredResults) {
      if (this.toolbar.filters.sort == 'name_des') {
        var sortedResults = filteredResults.sort(function (a, b) {
          if (a.truUser.displayName < b.truUser.displayName) return -1
          if (a.truUser.displayName > b.truUser.displayName) return 1
          return 0
        })
      } else {
        var sortedResults = filteredResults.sort(function (a, b) {
          if (a.truUser.displayName > b.truUser.displayName) return -1
          if (a.truUser.displayName < b.truUser.displayName) return 1
          return 0
        })
      }
      return sortedResults
    },

    checkPageUrl () {
      var pageNumberFromUrl = Number(getPageFromUrl(this.$store.state.config.requestUrl))

      if (pageNumberFromUrl) this.$set(this, 'currentPage', pageNumberFromUrl)
      if (!pageNumberFromUrl) this.$set(this, 'currentPage', 1)

      if (pageNumberFromUrl > this.getRosterLength || pageNumberFromUrl < 0) {
        this.error = true
      }

      this.checkedPageUrl = true
    },

    getPagedResults (sortedResults) {
      this.rosterTotal = sortedResults.length
      if (!this.checkedPageUrl) this.checkPageUrl()

      var firstIndex = ((this.currentPage - 1) * this.strap_state.numResults)
      var lastIndex = firstIndex + this.strap_state.numResults

      if (sortedResults < this.strap_state.numResults) {
        this.moreResults = false
        return sortedResults
      } else if (lastIndex > sortedResults.length) {
        firstIndex = this.strap_state.numResults * (this.currentPage - 1)
        lastIndex = sortedResults.length
        this.moreResults = false
      } else {
        this.moreResults = true
      }

      if (firstIndex < 0) firstIndex = 0
      return sortedResults.slice(firstIndex, lastIndex)
    },

    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(30px)'

      if (!process.browser) return

      Velocity(
        el,
        { opacity: 0, translateY: '30px' }
      )
    },

    enter: function (el, done) {
      if (!process.browser) return

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, translateY: '0px' },
          { complete: done, duration: '300ms' }
        )
      }, '500ms')
    },

    leave: function (el, done) {
      if (!process.browser) return

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, translateY: '30px' },
          { complete: done, duration: '300ms' }
        )
      }, '500ms')
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Agent Roster', size: 2 }),
      numResults: 12,
      defaultPhotoURL: '//cdnassets.rmcloud.com/images/missing_person.png'
    }
  },

  schema () {
    return [
      {
        title: 'Meet The Team',
        tabs: [
          {
            title: 'Results',
            initial: true,
            fields: [
              {
                key: 'state.numResults',
                type: 'number',
                label: 'Number of Results',
                default: 12,
                hint: 'Number of results per page. Between 5-30',
                minValue: 5,
                maxValue: 30,
                step: 1
              }
            ]
          },
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

.custom-strap-container
  max-width: 100%
  +desktop
    padding: 5em 0.5em 5em 0.5em
    margin-left: 1.25em
    margin-right: 1.25em
  +tablet
    padding: 5em 0.5em 5em 0.5em
  +mobile
    padding: .5em

.header-container
  width: auto

#rosterList
  margin-left: auto
  margin-right: auto

.agent-card
  +desktop
    margin: 3px 0px
    height: 560px
    width: 320px
    &:hover
      border: 2px solid rgba(0,0,0,0.15)
      margin: 0px
      border-radius: 2px
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1)

  +mobile
    height: 160px
    overflow: hidden

  .agent-card-link
    +mobile
      display: flex
      flex-direction: row

  .agent-container
    +desktop
      height: 400px
    +mobile
      width: 50%
      height: 100%
      flex: 1 0 0


  .agent-image
    +desktop
      border-radius: 2px
      box-shadow: 1px 1px 10px 2px rgba(0,0,0,.2)
      border-radius: 2px 2px 0px 0px
      height: 100%
      width: 100%
    +tablet
      border-radius: 2px
      box-shadow: 1px 1px 10px 2px rgba(0,0,0,.2)
      border-radius: 2px 2px 0px 0px
      height: 100%
      width: 100%
    +mobile
      height: 160px

.mobile-agent-info
  +mobile
    max-height: 75px

.agent-information
  +desktop
    margin: 7px 5px 5px 5px
  +mobile
    margin-left: 10px
    flex: 2 0 0
    width: 100%

  .columns
    margin-bottom: 0px

  .tile-title
    +desktop
      font-size: 1.35em

  .displayName
    max-width: 90%
    line-height: 100%

  .role
    +desktop
      font-size: 16px
    +mobile
      font-size: 15px

  .info
    +desktop
      font-size: 15px
      line-height: 120%
    +mobile
      font-size: 14px

.social-icons a
  color: var(--default-text)
  background-color: transparent
  font-size: 17px

.icon-desktop
  +tablet
    margin-right: 15px

.has-text-left
  text-align: left

.page-button
  margin-left: 2px

.inner-strap-button
  padding: 3px

//search-bar styles
.search-bar
  position: relative
  display: inline-block
  width: 100%
  margin 0px 5px 0px 5px

.input,
.field,
.control,
  +desktop
    width: 90%

.toolbar .filters
  +tablet
    width: 90%

.control
  .input
    height: 52px
    padding-left: 3.25em

    &:focus
      outline: none
      box-shadow: none

  .icon
    font-size: 24px
    &.is-left
      left: .125em
    &.is-right
      right: .125em

.search-bar
  input:focus

.search-bar.is-outlined
  .field
    position: relative
    &:after
      content: ''
      display: block
      position: absolute
      pointer-events: none
      top: 0
      left: 0
      width: 100%
      height: 100%
      border: solid 1px
      border-radius: 3px
      opacity: 0.25
  input
    box-shadow: none
    color: inherit
    &::placeholder
      color: inherit

.no-padding-left
  padding-left: 0px

</style>
