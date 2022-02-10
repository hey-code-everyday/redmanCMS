<template>
  <div class="strap-agent-rotator" ref="strap">
    <div class="custom-strap-container pad-medium">

      <div class='strap-content'>
        <header class='strap-header content'>
          <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
        </header>
        <div id="rosterList">
          <template v-if="agentRoster.length">

            <transition-group tag="div"
              name="fade"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave">
              <div v-for="agent in randomRoster" :key="agent.truUser._id">
                <div class="inner-strap-content columns is-centered">
                  <div class="column agent-contact-info">
                    <div class="agent-container">

                      <!-- Agent Photo -->
                      <img v-if="!agent.truUser.photoURL || agent.truUser.photoURL === ' '" class="agent-image" :src="getSrc"/>
                      <img v-if="agent.truUser.photoURL && agent.truUser.photoURL != ' '" class="agent-image" :src="agent.truUser.photoURL">
                    </div>
                    <br/>
                     <!-- Agent Info Desktop -->
                    <div class="contact-info-wrapper is-hidden-mobile">
                      <div class="contact-info columns is-hidden-mobile">
                        <div class="column is-narrow has-text-left">
                          <span v-if="agent.truUser.mobilePhones[0]" class="is-soft"> Phone</span> <br/>
                          <span v-if="agent.truUser.email" class="is-soft"> Email</span><br/>
                          <span v-if="agent.truUser.language" class="is-soft"> Speaks</span><br/>
                        </div>
                        <div class="column has-text-left">
                          <span v-if="agent.truUser.mobilePhones[0]"> {{ agent.truUser.mobilePhones[0] }}</span> <br/>
                          <span v-if="agent.truUser.email"> {{ agent.truUser.email }} </span> <br/>
                          <span v-for="lanuage in agent.truUser.language" v-if="agent.truUser.language">
                            {{language}} 
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                   <!-- Agent Info -->
                  <div class="column agent-info is-three-fifths has-text-left">
                    <span class="displayName title"> {{ agent.truUser.displayName }} </span>
                    <!-- Social Media -->
                    <span>
                      <span v-if="agent.extra_info" class="social-icons" style="font-size: 19px">
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
                    <span class="role subtitle is-soft" v-if="agent.organization"> {{ agent.organization.name }} </span>
                    <br/><br/>

                     <!-- Agent Bio -->
                    <div v-if="agent.extra_info" class="is-hidden-mobile">
                      <div v-if="agent.extra_info.bio" class="bio-overlay is-hidden-mobile" :style="fadedOverlay"></div>
                      <div class="bio">             
                        <p v-if="agent.extra_info.bio" v-html="agent.extra_info.bio">
                        </p>
                      </div>
                    </div>

                     <!-- Office Info -->
                    <div class="office-location" v-if="agent.organization" >
                      <div class="columns is-gapless is-mobile">
                        <div class="column is-narrow">
                          <div class="icon-container level-right">
                            <i class="is-soft icon-map-marker"></i>
                          </div>
                        </div>
                        <div class="column">
                          <div class="office-details" style="padding-left:0px; padding-right: 0px">
                            <span class="is-soft">OFFICE DETAILS</span>
                            <br/>
                             {{ agent.organization.address }}  <br/>
                             {{ agent.organization.city }} <br/>
                             {{ agent.organization.postal }} <br/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br/>

                     <!-- Agent Contact -->
                    <div class="contact-info is-hidden-tablet">
                        <span class="is-soft"> Contact {{ agent.truUser.displayName.split(" ")[0] }}</span>
                        <div class="is-hidden-mobile">
                          <br/><br/>
                        </div>
                        <div class="columns is-mobile">
                          <div class="column is-narrow has-text-left">
                            <span class="is-soft"> Phone</span> <br/>
                            <span class="is-soft"> Email</span><br/>
                            <!--<span class="is-soft"> Speaks</span><br/>-->
                          </div>
                          <div class="column has-text-left">
                            {{ agent.truUser.mobilePhones[0] }} <br/>
                             {{ agent.truUser.email }} <br/>
                            <!--{{ agentRoster[currentAgent].truUser.language }} <br/>-->
                          </div>
                          <br/>
                      </div>
                    </div>
                  </div>
                </div>
                <a :href="`/agent/${formatAgentUrl(agent.truUser.displayName)}`" class="agent-contact-button">
                  <button style="padding-left: 50px; padding-right: 50px" class="button strap-button is-primary">
                    Contact {{ agent.truUser.displayName.split(" ")[0] }}
                  </button>
                <br/>
                </a>
              </div>
            </transition-group>
            <div class="strap-agent__pagination">
              <button class="button strap-button is-primary strap-agent__pagination-left" @click="getPreviousAgent"> 
                <i class="icon-chevron-left"/>
              </button>
              <button class="button strap-button is-primary strap-agent__pagination-right" @click="getNextAgent"> 
                <i class="icon-chevron-right"/>
              </button>
            </div>
          </template>
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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default {
  name: 'StrapAgentRotator',

  components: {
    EditableTitle,
  },

  mixins: [mixinStrap],

  created: function () {
      setInterval(() => {
        if (this.currentIndex == this.agentRoster.length - 1 ) {
          this.currentIndex = 0
        } else {
          this.currentIndex ++;
        }
      }, (this.strap_state.numSeconds) * 1000);
  },

  computed: {
    strapPadding () {
      const { title } = this.strap_state

      if (
        (title.html === '' || title.html === '%3Cp%3E%3Cbr%3E%3C/p%3E')
      ) {
        return 'pad-small'
      }

      return 'pad-medium'
    },

    randomRoster () {
      if (!this.randomized) {
        this.currentIndex = getRandomInt(this.agentRoster.length)
        this.randomized = true
      }

      return this.agentRoster.slice(this.currentIndex, this.currentIndex + 1)
    },

    getSrc () {
      return this.strap_state.defaultPhotoURL
    },

    fadedOverlay() {
      var r = parseInt(this.strap_palette.bgColor.slice(1, 3), 16),
        g = parseInt(this.strap_palette.bgColor.slice(3, 5), 16),
        b = parseInt(this.strap_palette.bgColor.slice(5, 7), 16);

      var fadedColor = "rgba(" + r + ", " + g + ", " + b + ", 0)";

      return {
        "background": "linear-gradient( " + fadedColor + " 65%, " + this.strap_palette.bgColor + " 83%)"
      }
    }
  },

  prefetch,

  afterPrefetch,

  data () {
    return {
      agentRoster: {},
      currentAgent: 0,
      error: false,
      loading: false,
      moreResults: true,
      currentIndex: 0,
      randomized: false,

      // Animation
      delay: 150,
      lastDelay: 0
    }
  },

  methods: {
    formatAgentUrl (agent) {
      return agent.toLowerCase().replace(/ /g, "_");
    },

    getPreviousAgent () {
      if (this.currentIndex == 0 ) {
        this.currentIndex = this.agentRoster.length - 1
      } else {
        this.currentIndex --;
      }
    },
    getNextAgent () {
      if (this.currentIndex == this.agentRoster.length - 1 ) {
        this.currentIndex = 0
      } else {
        this.currentIndex ++;
      }
    },

    beforeEnter: function (el) {
      el.style.opacity = 0

      if (!process.browser) return

      Velocity(
        el,
        { opacity: 0 }
      )
    },

    enter: function (el, done) {
      this.lastDelay += this.delay
      const delay = this.lastDelay

      if (!process.browser) return

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, translateX: '0px' },
          { complete: done, duration: '300ms' }
        )
      }, "300ms")
    },

    leave: function (el, done) {
      if (!process.browser) return

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, translateX: '30px' },
          { complete: done, duration: '300ms' }
        )
      }, "300ms")
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Meet The Team', size: 2 }),
      numSeconds: 10,
      defaultPhotoURL: '//cdnassets.rmcloud.com/images/missing_person.png'
    }
  },

  schema () {
    return [
      {
        title: 'Meet The Team',
        tabs: [
          {
            title: 'Timing',
            initial: true,
            fields: [
              {
                key: 'state.numSeconds',
                type: 'number',
                label: 'Number of Seconds',
                default: 10,
                hint: 'Number of Seconds before automatic rotation. Between 5-30',
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
  margin: auto
  +desktop
    padding: 2.5rem 3.25rem 2.5rem 3.25rem
  +tablet
    padding: 2.5rem 3.25rem 2.5rem 3.25rem
  +mobile
    padding: 1rem .25rem 1rem .25rem

.inner-strap-content
  +desktop
    margin-left: 4rem
    margin-right: 4rem
  +mobile

#rosterList
  +mobile
    padding-bottom: 55px
    height: 640px
  +tablet
    height: 515px
    overflow: hidden
    padding-top: 30px
  +desktop
    height: 515px
    overflow: hidden
    padding-top: 30px

.agent-info
  +mobile
    margin-left: 20px
    margin-right: 20px
  .title
    +mobile
      font-size: 1.5em

.agent-contact-info
  text-align: center
  margin-left: auto
  padding-left: 5vw
  max-width: 450px

  +desktop
    height: 320px
  +tablet
    height: 320px

  +mobile
    height: 220px
    width: 98%
    margin-right: auto

.contact-info-wrapper
  margin: auto
  display: inline-block
  text-align: center

.contact-info
  font-size: 16px

.bio-overlay
  height: 125px
  width: 100%
  position: absolute

.bio
  +desktop
    height: 110px
    margin-bottom: 30px
    overflow: hidden

  +tablet
    height: 110px
    margin-bottom: 30px
    overflow: hidden

.agent-container
  text-align: center

  +desktop
    height: 300px
  +tablet
    height: 300px

  +mobile
    height: 200px

  .agent-image
    height: 100%
    box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.3)


.social-icons a
  color: var(--default-text)
  background-color: transparent;

.social-icons
  margin-left: 15px

.office-location
  border: 2px solid rgba(0,0,0,0.15)
  box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.1)

  +desktop
    height: 150px
    max-width: 75%

  +tablet
    margin-right: 50px

  +mobile
    height: 100px
    font-size: .75em
    text-align: center
    margin-right: auto
    margin-left: auto

  .icon-container
    text-align: center
    +desktop
      padding: 35px
    +tablet
      padding: 35px
    +mobile
      padding: 25px 25px 25px 30px

  .icon-map-marker
    +desktop
      font-size: 2.9em
    +tablet
      font-size: 2.9em
    +mobile
      font-size: 2.75em

.office-map 
  +desktop
    height: 150px
    width: 150px
  +touch 
    height: 100px
    width: 100px

.office-details
  +desktop
    padding: 20px
  +mobile
    text-align: left
    padding-top: 12px

.agent-contact-button
  +mobile
    padding-bottom: 50px

.strap-agent__pagination
  position: absolute
  z-index: 5
  display: flex
  pointer-events: none
  justify-content: space-between
  left: 25px
  right: 25px

  +desktop
    top: 50%

  +tablet
    top: 50%

  +mobile
    display: inline-flex
    margin: 10px
    left: 15px
    right: 15px
    bottom: -1%
    padding: 10px

.strap-agent__pagination-left
  margin-right: 1rem
  pointer-events: auto
  justify-self: flex-start

.strap-agent__pagination-right
  pointer-events: auto
  justify-self: flex-end

.strap-button
  min-width: 52px
  transition: opacity 250ms ease-in-out

.is-disabled
  .strap-button
    pointer-events: none
    opacity: 0

  &.strap-agent__pagination-right
    .strap-button
      opacity: 0.6

  box-sizing: content-box
  -webkit-box-sizing: content-box
  -moz-box-sizing: content-box

  float: right
  position: relative
  top: -25px
  left: 100% 
  width: 7em 
  margin-left: -7em
  padding-right: 5px
  
  text-align: right

</style>
