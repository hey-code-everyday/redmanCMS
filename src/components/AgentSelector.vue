<template>
  <div>
    <div v-if="!loading">

      <!-- Display Agent List-->
      <div v-if="view === 'showAgentList'">

        <div class="columns is-gapless">
          <div class="column is-7">
            <div class="control">
              <input class="input" type="text" v-model="agentSearchFilter" placeholder="Agent Name">
            </div>
          </div>
          <div class="column button-container">
            <button class="nav-buttons" @click="addAgent()"><i class="icon-user-plus"></i> Add Agent </button>
          </div>
          <div class="column button-container">
            <button class="nav-buttons" @click="editOffices()"><i class="icon-apartment"></i> Edit Offices </button>
          </div>
        </div>

        <div v-for="agent in searchAgents" class="agent-select">
          <div class="columns is-gapless">
            <div class="column is-3 agent-name">
              {{ agent.doc.displayName }}  
              <br/>
            </div>
            <div class="column is-3 agent-phone">
              {{ agent.doc.mobilePhones[0]}}
            </div>
            <div class="column is-4 agent-email">
              {{ agent.doc.email}}
            </div>
            <div class="column is-2 agent-edit">
              <i class="icon icon-pencil2" @click="editAgent(agent)"></i>
              <i class="icon icon icon-trash2" @click="deleteAgent(agent)"></i>
            </div>
          </div>
        </div>

        <div v-if="!loading && searchAgents.length === 0 ">
          No Agents Found
        </div>

        <div v-if="loading">
          Loading...
        </div>

      </div>

      <!-- Display Editing Agent-->
      <div v-if="view === 'editAgent'">

        <button class="button back-to-search is-normal" @click="returnToSearch">
          <i class="icon-chevron-left"></i>
        </button>

        <br/>
        <agent-editor @deletedSelectedAgent="returnToSearch" :agent='selectedAgent' :agentExtraInfo='selectedAgentExtraInfo' :agentId='getAgentId'/>
      
      </div>

      <div v-if="view === 'editOffices' ">

        <button class="button back-to-search is-normal" @click="returnToSearch">
          <i class="icon-chevron-left"></i>
        </button>

        <br/>

        <office-manager/>

      </div>

    </div>

  </div>
</template>

<script>
import api from '@/api'
import AgentEditor from '@/components/AgentEditor'
import OfficeManager from '@/components/OfficeManager'


export default {
  name: 'AgentSelector',

  components: {
    AgentEditor,
    OfficeManager
  },

  props: {
    mode: {
      type: String,
      default: 'editAgent'
    }
  },

  computed: {
    searchAgents () {
      if (this.updateRoster) {
        
        api.getAgentRosterForEditing(this.$store.state)
        .then(res => {
        if (res.status !== 200) {
          this.showOverlay('error', {
            err: new Error(`Error fetching roster (${res.status}).`)
          }
        )}
          this.$set(this, 'agentRoster', res.body.rows)
          this.$set(this, 'loading', false)
          resolve(res.body)
        })
        .catch(err => {
          new Error(err)
          this.error = true
        })

        this.$set(this, 'updateRoster', false)
      }

      return this.agentRoster.filter(agent => (agent.doc.displayName).toLowerCase().includes(this.agentSearchFilter.toLowerCase()))
    },

    getAgentId () {
      if (typeof this.selectedAgent.doc != 'undefined') {
        return this.selectedAgent.doc.uid
      } else {
        return ''
      }
    }
  },

  data () {
    return {
      agentRoster: {},
      agentSearchFilter: '',
      loading: true,
      view: 'showAgentList',
      selectedAgent: {},
      selectedAgentExtraInfo: {},
      updateRoster: false
    }
  },


  watch: {
    agentRoster (nextRoster) {
      this.$set(this, 'agentRoster', nextRoster)
    },
    updateRoster (updateRoster) {
      this.searchAgents
    }
  },

  created () {
    Promise.all([
        api.getAgentRosterForEditing(this.$store.state)
        .then(res => {
        if (res.status !== 200) {
          this.showOverlay('error', {
            err: new Error(`Error fetching roster (${res.status}).`)
          }
        )}
          this.$set(this, 'agentRoster', res.body.rows)
          this.$set(this, 'loading', false)
          resolve(res.body)
        })
        .catch(err => {
          new Error(err)
          this.error = true
        })
      ])
  },

  methods: {
    deleteAgent (agent) {
      var result = confirm("Are you sure you want to delete this Agent?");
      if (result) {
          api.deleteAgent(this.$store.state, agent.doc.uid).then(response => {
          this.$set(this, 'updateRoster', true)
        }).catch(e => {
          console.warn(e)
        })
      }
    },

    editAgent (agent) {
      this.$set(this, 'selectedAgent', agent)
      this.getExtraAgentInfo(agent)
      this.$set(this, 'view', 'editAgent')
    },

    editOffices (agent) {
      this.$set(this, 'view', 'editOffices')
    },

    returnToSearch () {
      this.$set(this, 'loading', true)
      this.$set(this, 'updateRoster', true)
      this.searchAgents
      this.$set(this, 'view', 'showAgentList')
      this.$set(this, 'selectedAgent', {})
      this.$set(this, 'selectedAgentExtraInfo', {})
      this.$set(this, 'updateRoster', false)
    },

    getExtraAgentInfo (agent) {
      api.getAgentExtraInfo(this.$store.state, agent.doc.uid).then(response => {
        this.$set(this, 'selectedAgentExtraInfo', response.body)
      }).catch(e => {
        console.warn(e)
      })
    },

    //create a new Agent
    addAgent: function() {
      this.$set(this, 'loading', true)
      this.$set(this, 'selectedAgent', {})
      this.$set(this, 'selectedAgentExtraInfo', {})
      this.$set(this, 'view', 'editAgent')
      this.$set(this, 'loading', false)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/_all'

.button-container
  text-align: center
.nav-buttons
  padding: 1em
  border-radius: 10px
.new-agent
  font-size: 0.9em
.agent-select
  text-align: left
  border-bottom: 2px solid rgba(0,0,0,0.2)
  padding: 0.5em 0em 0.5em 0em
  font-size: 0.9em

  .agent-edit
    text-align: right
    padding-left: 1em
  .agent-phone, .agent-email
    font-size: 0.9em
    overflow: hidden
    text-overflow: ellipsis
  .agent-name
    padding-left: 1em

.back-to-search
  border-radius: 10px


</style>
