<template>
  <div class="strap-agent-daily-rotator" ref="strap">
    <div class="custom-strap-container pad-medium">

      <div class='strap-content'>
        <header class='strap-header content'>
          <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
        </header>
        <div class="strap-content">
          <template v-if="agentRoster.length">
              <div v-if="getDailyAgent">
                <div class="columns is-centered">

                  <div class="column is-3">
                    <div class="agent-container">
                      <!-- Agent Photo -->
                      <img v-if="!agent.truUser.photoURL || agent.truUser.photoURL === ' '" class="agent-image" :src="getSrc"/>
                      <img v-if="agent.truUser.photoURL && agent.truUser.photoURL != ' '" class="agent-image" :src="agent.truUser.photoURL">
                    </div>
                  </div>

                  <div class="column agent-contact-info has-text-left">
                    <span class="displayName title"> {{ agent.truUser.displayName }} </span> 
                    <br/>
                    <span class="role subtitle is-soft" v-if="agent.organization"> {{ agent.organization.name }} </span>
                    <br/>
                     <!-- Agent Info Desktop -->
                    <div class="contact-info-wrapper">
                      <div class="contact-info columns is-mobile">
                        <div class="column is-narrow has-text-left">
                          <span v-if="agent.truUser.mobilePhones[0]" class="is-soft"> Phone</span> <br/>
                          <span v-if="agent.truUser.email" class="is-soft"> Email</span><br/>
                          <span v-if="agent.truUser.language" class="is-soft"> Speaks</span><br/>
                        </div>
                        <div class="column has-text-left">
                          <span v-if="agent.truUser.mobilePhones[0]"> <a :href="'tel:'+agent.truUser.mobilePhones[0].replace(/-/g, '')"  rel="nofollow" target="_blank">{{ agent.truUser.mobilePhones[0] }}</a> </span> <br/>
                          <span v-if="agent.truUser.email"> <a :href="'mailto:'+agent.truUser.email" rel="nofollow">{{ agent.truUser.email }}</a> </span> <br/>
                          <span v-for="lanuage in agent.truUser.language" v-if="agent.truUser.language">
                            {{language}} 
                          </span>
                        </div>
                      </div>
                    </div>

                    <div v-if="agent.extra_info" class="social-icons">
                      <a
                        v-if="agent.extra_info && agent.extra_info.profileLinks.length"
                        v-for="(social, i) in agent.extra_info.profileLinks"
                        target="_blank"
                        class="social-icon"
                        :href="social.url" 
                      >
                        <span  v-if="social.type != 'website'">
                          <i :class="`socicon-${social.type}`"></i>
                        </span>
                        <span  v-if="social.type === 'website'">
                          <i :class="`icon-desktop`"></i>
                        </span>
                      </a>
                    </div>
                  </div>

                  <div class="column is-5 button-column">
                    <div style="height: 15%"></div>
                    <a :href="`/agent/${formatAgentUrl(agent.truUser.displayName)}`" class="agent-contact-button">
                      <button class="button strap-button is-primary">
                        View {{ agent.truUser.displayName.split(" ")[0] }}'s Profile
                      </button>
                    </a>
                    <a v-show="strap_state.showOurAgents" :href="strap_state.ourAgentsUrl" class="agent-contact-button view-listings">
                      <button class="button strap-button is-primary">
                       View Our Agents
                      </button>
                    </a>
                  </div>

                </div>
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


export default {
  name: 'StrapAgentDailyFeatured',

  components: {
    EditableTitle,
  },

  mixins: [mixinStrap],


  computed: {
    getDailyAgent () {
      //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
      let now = new Date();
      let start = new Date(now.getFullYear(), 0, 0);
      let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
      let oneDay = 1000 * 60 * 60 * 24;
      let day = Math.floor(diff / oneDay);

      this.$set(this, 'agent', this.agentRoster[day % this.agentRoster.length])
      return this.agent
    },

    getSrc () {
      return this.strap_state.defaultPhotoURL
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

      agent: {}      
    }
  },

  methods: {
    formatAgentUrl (agent) {
      return agent.toLowerCase().replace(/ /g, "_");
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Featured Agent', size: 2 }),
      defaultPhotoURL: '//cdnassets.rmcloud.com/images/missing_person.png',
      showOurAgents: true,
      ourAgents: 'agents'
    }
  },

  migrations (strap, state) {
    return [
      {
        showOurAgents: true,
        ourAgentsUrl: '/agents'
      }
    ]
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
          },
          {
            title: 'Our Agents',
            initial: true,
            fields: [
              {
                key: 'state.showOurAgents',
                type: 'checkbox',
                label: 'Show View Our Agents Button',
                text: 'Show button linking to agent roster',
                default: true,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.ourAgentsUrl',
                type: 'text',
                label: 'Agent Roster URL',
                default: '/agents'
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
    padding: 3.5rem 5.25rem 3.5rem 5.25rem
  +tablet
    padding: 2.5rem 5.25rem 2.5rem 5.25rem
  +mobile
    padding: 1rem .25rem 1rem .25rem

.pad-medium
  +mobile
    padding: 25px

.agent-info
  +mobile
    margin-left: 20px
    margin-right: 20px
  .title
    +mobile
      font-size: 1.5em

.contact-info-wrapper
  margin: auto
  display: inline-block
  text-align: center

.contact-info
  font-size: 16px

.agent-container
  margin-left: auto
  margin-right: auto
  max-height: 200px

  +desktop
    text-align: right
  +mobile
    text-align: center
  .agent-image
    max-height: 200px
    box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.3)

.social-icons a
  color: var(--default-text)
  background-color: transparent
  margin: 0px 5px 0px 5px

  .icon-desktop
    margin-right: 8px

.agent-contact-button button
  margin: 5px 0px 5px 0px
  padding-right: 50px
  padding-left: 50px
  +desktop
    width: 50%

</style>
