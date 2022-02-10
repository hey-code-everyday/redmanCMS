<template>
  <div class="strap-agent-rotator" ref="strap">
    <div class="custom-strap-container pad-medium">

      <div class='strap-content'>
        <header class='strap-header content'>
          <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
        </header>
        <div v-if="agentRoster.length" id="rosterList" :class="{'has-nine': agentRoster.length > 9}" >
          <template>
            <transition-group tag="div"
              name="fade"
              class="columns agent-list is-mobile">
              <div v-for="agent in randomRoster" :key="agent.truUser._id" class="outer-agent-card column">
                <agent-horizontal-card :agent='agent' :photo='strap_state.defaultPhotoURL'/>
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
import AgentHorizontalCard from '@/components/AgentHorizontalCard'
import EditableTitle from '@/components/editable/EditableTitle'
import defaultTitle from '@/store/defaults/components/title'
import { prefetch, afterPrefetch } from '@/helpers/agent-roster'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default {
  name: 'StrapMultiAgentRotator',

  components: {
    EditableTitle,
    AgentHorizontalCard
  },

  mixins: [mixinStrap],

  created: function () {
      setInterval(() => {
        if (this.currentIndex == this.randomizedRoster.length - 1 ) {
          this.currentIndex = 0
        } else {
          this.currentIndex ++;
        }
      }, (this.strap_state.numSeconds) * 1000);
  },

  computed: {
    randomRoster () {

      //filter for Agents with no photos, if selected in schema
      if (this.strap_state.hideNoPhoto) {
        this.$set(this, 'randomizedRoster', this.agentRoster.filter( agent => {
            return agent.truUser.photoURL && agent.truUser.photoURL != ' '
        }))
      } else {
        this.$set(this, 'randomizedRoster', this.agentRoster);
      }

      if (!this.randomized) {
        this.currentIndex = getRandomInt(this.randomizedRoster.length)
        this.randomized = true
      }

      //loop around to end of roster
      var lastIndex = 0

      if (this.randomizedRoster.length <= 9) {
        var firstSelection = this.randomizedRoster.slice(this.currentIndex, this.randomizedRoster.length )
        var secondSelection = this.randomizedRoster.slice(0, this.currentIndex)
        return firstSelection.concat(secondSelection)
      } else if (this.currentIndex + 9 >= this.randomizedRoster.length) {
        var firstSelection = this.randomizedRoster.slice(this.currentIndex, this.randomizedRoster.length)
        var secondSelection = this.randomizedRoster.slice(0, 9 - firstSelection.length)
        return firstSelection.concat(secondSelection)
      } else {
        return this.randomizedRoster.slice(this.currentIndex, this.currentIndex + 9)
      }

    }
  },

  prefetch,

  afterPrefetch,

  data () {
    return {
      agentRoster: {},
      randomizedRoster: {},
      currentAgent: 0,
      error: false,
      loading: false,
      moreResults: true,
      currentIndex: 0,
      randomized: false,
    }
  },

  methods: {
    getPreviousAgent () {
      if (this.currentIndex == 0 ) {
        this.currentIndex = this.randomizedRoster.length - 1
      } else {
        this.currentIndex --;
      }
    },
    getNextAgent () {
      if (this.currentIndex == this.randomizedRoster.length - 1 ) {
        this.currentIndex = 0
      } else {
        this.currentIndex ++;
      }
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Meet The Team', size: 2 }),
      numSeconds: 10,
      defaultPhotoURL: '//cdnassets.rmcloud.com/images/missing_person.png',
      hideNoPhoto: false
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
              },
              {
                key: 'state.hideNoPhoto',
                type: 'checkbox',
                label: 'Hide agents with no photos',
                text: 'Hide agents with no photos',
                default: false,
                onValue: true,
                offValue: false
              },
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

.custom-strap-container
  margin: auto
  +desktop
    padding: 1rem 3.25rem 2.5rem 3.25rem
  +tablet
    padding: 1rem 3.25rem 2.5rem 3.25rem
  +mobile
    padding: 1rem .25rem 1rem .25rem

#rosterList
  +mobile
    padding-bottom: 55px
  +tablet
    overflow: hidden
    padding-top: 30px

  +desktop
    overflow: hidden
    padding-top: 30px

.has-nine
  +desktop
    margin-left: (calc(-220px - 2em))
    margin-right: -100px

.agent-list
  +mobile
    transform: translate(calc(-200px - 2em)) //centers on mobile

.outer-agent-card
  transition: $listingTransition

.fade-leave-active
  position: absolute

.fade-enter
  opacity: 0
  transform: scale(0.9)

.fade-leave-to
  +desktop
    display: none
  +mobile
    opacity: 0

.fade-move
  transition: $listingTransition


.fade-move:last-child
  transition: ease-out 1ms
  transform: translate(-300px)
  opacity: 0

.strap-agent__pagination
  position: absolute
  z-index: 5
  display: flex
  pointer-events: none
  justify-content: space-between
  left: 25px
  right: 25px

  +desktop
    top: 33%
  +tablet
    top: 33%   

.strap-agent__pagination-left
  margin-right: 1rem
  pointer-events: auto
  justify-self: flex-start
  +desktop
    height: 200px
  +tablet
    height: 200px  

.strap-agent__pagination-right
  pointer-events: auto
  justify-self: flex-end
  +desktop
    height: 200px
  +tablet
    height: 200px   

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
