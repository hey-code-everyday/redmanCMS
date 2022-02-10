<template>
  <div class="agent-card">
    <a :href="formatAgentUrl">
      <div class="agent-image" :title='agent.truUser.displayName' :style='getSrc'></div>
      <div class="agent-name subtitle">
        <strong>{{agent.truUser.displayName}}</strong>
        <br/>
        <a :href="`tel:${agent.truUser.mobilePhones[0]}`">{{agent.truUser.mobilePhones[0]}}</a>
      </div>
    </a>
  </div>
</template>
<script>

export default {
  name: 'AgentHorizontalCard',

  props: {
    agent: {
      type: Object,
      required: true
    },
    photo: {
      type: String,
      required: false
    }
  },

  computed: {
    formatAgentUrl () {
      var formattedAgentName = this.agent.truUser.displayName.toLowerCase().replace(/ /g, "_");
      let url = '/agent/' + formattedAgentName
      return url
    },
    getSrc () {
      if (!this.agent.truUser.photoURL || this.agent.truUser.photoURL === ' ') {
         return 'background-image: url("' + this.photo +'")'
      } else if (this.agent.truUser.photoURL && this.agent.truUser.photoURL != ' ') {
        return 'background-image: url("' + this.agent.truUser.photoURL + '")'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.agent-card
  display: flex
  flex-direction: column
  text-align: left
  font-size: 14px
  width: 275px;

.agent-image
  position: relative
  z-index: 1
  pointer-events: none
  height: 325px
  overflow: hidden
  background-position: 50% 50%
  background-size: cover

.agent-name
  text-align: center
  color: var(--default-text-color)

</style>
