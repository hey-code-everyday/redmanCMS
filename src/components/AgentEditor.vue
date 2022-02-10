<template>
  <div>
    <div v-if="!loading">
      <br/>
      <div class="title">
        {{ displayName }}

        <span v-if="isSaved === 'saved'" class="tag is-success">
          Saved!
        </span>

        <span v-if="isSaved === 'error'" class="tag is-danger">
          Error Saving
        </span>
      </div>

      <div class="agent-edit field">
        <div class="field contact-info">

          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <div class="label is-normal">
                  <label class="label">Name</label>
                </div>
                <p class="control">
                  <input class="input" v-model='displayName' required><br/>
                  <p class="help">*required</p>
                </p>
              </div>
              <div class="field">
                <div class="label is-normal">
                  <label class="label">Role</label>
                </div>
                <p class="control is-expanded">
                  <div class="select">
                    <select v-model="role" required>
                      <option value='realtor'>
                        REALTOR®
                      </option>
                      <option value='support'>
                        Support
                      </option>
                    </select>
                  </div>
                </p>
              </div>
            </div>
          </div>


          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <div class="label is-normal">
                  <label class="label">Phone</label>
                </div>
                <p class="control">
                  <input class="input" v-model='mobileNumber' required><br/>
                  <p class="help">*required</p>
                </p>
              </div>
              <div class="field">
                <div class="label is-normal">
                  <label class="label">Email</label>
                </div>
                <p class="control is-expanded">
                  <input class="input"  v-model='email' placeholder="Add Me!" required><br/>
                  <p class="help">*required</p>
                </p>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label"> Realtor ID: </label>
            <div class="control">
              <input class="input"  v-model='boardID' placeholder="Add Me!">
            </div>
          </div>

          <label class="label"> Office: </label>
          <div class="control">
            <div class="select">
              <select v-model="office">
                <option v-for="offices in officeOptions" v-bind:value="offices.id">
                  {{ offices.name }}
                </option>
              </select>
            </div>
          </div>

          <br/>

          <img class='agent-image' :src='photoURL'/>
          <div class="field">
            <label class="label"> Photo: </label>
            <div class="control has-icons-right">
              <image-input :field="{}" :value="photoURL || '' " @change="photoURL = $event"></image-input>
            </div>
            <p class="help">Suggested dimensions: 400px x 550px. <br/> For best results, use a photo with portrait/vertical orientation. </p>
          </div>

        </div>

        <hr/>

        <div class="extra-info">

          <div class="field">
            <label class="label"> Languages Spoken: </label>
            <div class="control">
              <input  class="input"  v-model='speaks' placeholder="Add Me!">
            </div>
          </div>

          <div class="field">
            <label class="label"> Personal Website URL: </label>
            <div class="control">
              <input type="url" class="input"  v-model='personalURL' placeholder="https://www.realestate.com">
            </div>
          </div>

          <div class="field">
            <label class="label"> Facebook URL:  </label>
            <div class="control">
              <input type="url" class="input"  v-model='facebookURL' placeholder="https://www.facebook.com/realestate">
            </div>
          </div>

          <div class="field">
            <label class="label"> LinkedIn URL:  </label>
            <div class="control">
              <input type="url" class="input"  v-model='linkedinURL' placeholder="https://www.linkedin.com/in/realestate">
            </div>
          </div>

          <div class="field">
            <label class="label"> Twitter URL:  </label>
            <div class="control">
              <input type="url" class="input"  v-model='twitterURL' placeholder="https://twitter.com/realestate">
            </div>
          </div>

          <div class="field">
            <label class="label"> Instagram URL:  </label>
            <div class="control">
              <input type="url" class="input"  v-model='instagramURL' placeholder="https://instagram.com/realestate">
            </div>
          </div>

          <div class="field">
            <label class="label"> Bio: </label>
            <div class="control">
              <textarea class="textarea"  v-model="bio" placeholder="Add Me!"></textarea>
            </div>
          </div>
        </div>

        <br/>

        <div class="level">
          <div class="level-left">
            <button @click="deleteAgent" class="button level-item delete-button is-danger" > DELETE </button>
          </div>
          <div class="level-right">
            <button @click="updateAgent" class="button level-item save-button is-success "> SAVE </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="loading">
      Loading...
    </div>

  </div>
</template>

<script>
import api from '@/api'
import ImageInput from '@/components/ui/form/ImageInput'
import CustomModalImageUpload from '@/components/ui/modals/custom/CustomModalImageUpload'


export default {
  name: 'AgentEditor',

  components: {
    ImageInput
  },

  props: {
    agentId: {
      type: String,
      required: false
    },
    agent: {
      type: Object,
      required: false
    },
    agentExtraInfo: {
      type: Object,
      required: false
    }
  },

  created() {
    if (!this.agentId) {

      var board = this.$store.state.gus.config.sources[0]

      //make new basic info
      let agentJson = {
        "role": "realtor",
        "displayName": "New Agent",
        "email": this.$store.state.website.config.office.email,
        "photoURL": " ",
        "mobilePhones": [this.$store.state.website.config.office.phone],
        "boardAgentIds": {[board]: ""},
        "organizationId": "1",
        "leadPriority": 0,
        "leadSpecializationTags": [],
        "lookups": {
          "auth0": {
            "id": ""
          }
        }
      }

      api.addAgent(this.$store.state, agentJson).then(response => {
        this.$set(this, 'selectedAgentId', response.body.uid)

        //make new extra info
        let agentExtraInfoJson = {
          "profileLinks": [],
          "title" : "realtor",
          "speaks": ["English"],
          "bio": " ",
          "profilePicture": " "
        }

        api.updateExtraInfo(this.$store.state, this.selectedAgentId, agentExtraInfoJson).then(response => {
          this.$set(this, 'selectedAgentExtraInfo', response.body)
          //get Agent Roster -> the response from adding the Agent does not have all the required fields to save the agent later on
          api.getAgentRosterForEditing(this.$store.state).then(res => {
            if (res.status !== 200) {
              this.showOverlay('error', {
                err: new Error(`Error fetching roster (${res.status}).`)
              }
            )}

            //find the new agent in the agent roster
            var newAgent = res.body.rows.find( rawAgent => {
              return (rawAgent.doc.uid).indexOf(this.selectedAgentId) > -1
            })

            this.$set(this, 'selectedAgent', newAgent)
            this.$set(this, 'displayName', newAgent.doc.displayName)
            this.$set(this, 'email', newAgent.doc.email)
            this.$set(this, 'mobileNumber', newAgent.doc.mobilePhones[0])
            this.$set(this, 'role', newAgent.doc.role)
            this.$set(this, 'boardName', this.getBoardName())
            this.$set(this, 'boardID', this.getBoardAgentIds())
            this.$set(this, 'photoURL', newAgent.doc.photoURL || this.agentExtraInfo.profilePicture)
            this.$set(this, 'personalURL', this.getInitialProfileLinks('website') || '')
            this.$set(this, 'twitterURL', this.getInitialProfileLinks('twitter') || '')
            this.$set(this, 'facebookURL', this.getInitialProfileLinks('facebook') || '')
            this.$set(this, 'linkedinURL', this.getInitialProfileLinks('linkedin') || '')
            this.$set(this, 'instagramURL', this.getInitialProfileLinks('instagram') || '')
            this.$set(this, 'office', parseInt(newAgent.doc.organizationId) || 1)
            this.$set(this, 'speaks', agentExtraInfoJson.speaks)
            this.$set(this, 'bio', this.selectedAgentExtraInfo.bio)

            if (newAgent.doc.lookups) this.$set(this, 'auth', newAgent.doc.lookups.auth0.id || '')

            this.$set(this, 'loading', false)
            return
            }).catch(err => {
            new Error(err)
            this.error = true
          })
        }).catch(e => {
          console.warn(e)
        })
      }).catch(e => {
        console.warn(e)
      })
    } else {

      this.$set(this, 'selectedAgent', this.agent,)
      this.$set(this, 'selectedAgentExtraInfo', this.agentExtraInfo)
      this.$set(this, 'selectedAgentId',  this.agentId)

      this.$set(this, 'displayName', this.selectedAgent.doc.displayName)
      this.$set(this, 'email', this.selectedAgent.doc.email)
      this.$set(this, 'mobileNumber', this.selectedAgent.doc.mobilePhones[0])
      this.$set(this, 'role', this.selectedAgent.doc.role)
      this.$set(this, 'boardName', this.getBoardName())
      this.$set(this, 'boardID', this.getBoardAgentIds())
      this.$set(this, 'photoURL', this.selectedAgent.doc.photoURL || this.selectedAgentExtraInfo.profilePicture)
      this.$set(this, 'personalURL', this.getInitialProfileLinks('website'))
      this.$set(this, 'twitterURL', this.getInitialProfileLinks('twitter'))
      this.$set(this, 'facebookURL', this.getInitialProfileLinks('facebook'))
      this.$set(this, 'linkedinURL', this.getInitialProfileLinks('linkedin'))
      this.$set(this, 'instagramURL', this.getInitialProfileLinks('instagram'))
      this.$set(this, 'office', parseInt(this.selectedAgent.doc.organizationId) || 1)
      this.$set(this, 'speaks', this.selectedAgentExtraInfo.speaks)
      this.$set(this, 'bio', this.selectedAgentExtraInfo.bio)
      if (this.selectedAgent.doc.lookups) this.$set(this, 'auth', this.selectedAgent.doc.lookups.auth0.id)

      this.$set(this, 'loading', false)
    }
  },

  data () {
    return {
      loading: true,
      isSaved: '',
      selectedAgent: '',
      selectedAgentExtraInfo: '',
      selectedAgentId: '',
      displayName: '',
      email: '',
      mobileNumber: '',
      role: '',
      boardName: '',
      boardID: '',
      photoURL: '',
      personalURL: '',
      twitterURL: '',
      facebookURL: '',
      linkedinURL: '',
      instagramURL: '',
      office: 1,
      officeOptions: this.getOffices(),
      speaks: [],
      bio: '',
      auth: ''
    }
  },

  watch: {
    agent (nextAgent) {
      this.$set(this, 'displayName', nextAgent.doc.displayName || '')
      this.$set(this, 'email', nextAgent.doc.email || '')
      this.$set(this, 'mobileNumber', nextAgent.doc.mobilePhones[0] || '')
      this.$set(this, 'role', nextAgent.doc.role || '')
      this.$set(this, 'boardName', this.getBoardName() || '')
      this.$set(this, 'boardID', this.getBoardAgentIds() || '')
      this.$set(this, 'photoURL', nextAgent.doc.photoURL || nextAgent || '')
      this.$set(this, 'office', parseInt(nextAgent.organizationId) || 0)
    },
    agentExtraInfo (nextExtraInfo) {
      this.$set(this, 'personalURL', this.getInitialProfileLinks('website') || '')
      this.$set(this, 'twitterURL', this.getInitialProfileLinks('twitter') || '')
      this.$set(this, 'facebookURL', this.getInitialProfileLinks('facebook') || '')
      this.$set(this, 'linkedinURL', this.getInitialProfileLinks('linkedin') || '')
      this.$set(this, 'instagramURL', this.getInitialProfileLinks('instagral') || '')
      this.$set(this, 'speaks', nextExtraInfo.speaks || ' ' )
      this.$set(this, 'bio', nextExtraInfo.bio || ' ')
    },
    isSaved () {
      //remove tags after 3 seconds
      setTimeout(() => {
        this.$set(this, 'isSaved', '')
      }, 3000)
    }
  },

  computed: {
    removeTag () {
      this.$set(this, 'isSaved', '')
    }
  },

  methods: {
    openModal () {
      const updateValue = (event) => {
        let src = event.file.src[event.size]
        if (src.indexOf('https://s3.amazonaws.com/ddf-photos.redmantech.ca/') === 0) {
          src = src.replace('https://s3.amazonaws.com/ddf-photos.redmantech.ca/', '/_files/')
        }
        this.$refs.input.value = src
        this.change(src)
      }

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          updateValue
        },
        // template: 'Hello, world',
        component: CustomModalImageUpload,
        settings: {
          width: '800px',
          height: 'auto',
          padded: true
        }
      })
    },
    getOffices: function () {
      Promise.all([
        api.getOffices(this.$store.state).then(response => {
          this.$set(this, 'officeOptions', response.body.root.children)
        }).catch(e => {
          console.warn(e)
        })
      ])
    },

    getInitialProfileLinks: function(type) {
      if (!this.agentExtraInfo.profileLinks) return ''

      var profileLinks = this.agentExtraInfo.profileLinks

      for (var x = 0; x < profileLinks.length; x++) {
        if (profileLinks[x].type === type) return profileLinks[x].url

      }
      return
    },

    getBoardName: function() {
      for (var board in this.selectedAgent.doc.boardAgentIds) {
        return board
      }

      return
    },

    getBoardAgentIds: function() {
      for (var board in this.selectedAgent.doc.boardAgentIds) {
        return this.selectedAgent.doc.boardAgentIds[board]
      }
      return
    },

    getProfileLinks: function() {
      var profileLinks = []

      if (this.personalURL != '') {
        profileLinks.push({'type': 'website', 'url' : this.personalURL})
      }

      if (this.twitterURL != '') {
        profileLinks.push({'type': 'twitter', 'url' : this.twitterURL})
      }

      if (this.facebookURL != '') {
        profileLinks.push({'type': 'facebook', 'url' : this.facebookURL})
      }

      if (this.linkedinURL != '') {
        profileLinks.push({'type': 'linkedin', 'url' : this.linkedinURL})
      }

      if (this.instagramURL != '') {
        profileLinks.push({'type': 'instagram', 'url' : this.instagramURL})
      }

      return profileLinks

    },
    updateAgent: function() {
      this.$set(this, 'loading', true)
      this.$set(this, 'isSaved', 'saved')
      this.updateBasicInfo()
      this.updateExtraInfo()
    },

    updateBasicInfo: function() {
      if (this.selectedAgent) {
        let photoURL = this.photoURL || " "
        let boardObject = {}
        let board = this.$store.state.gus.config.sources[0]

        if (this.boardID != '') {
          boardObject = { [board] : this.boardID }
        }

        let agentJson = {
          "_id": this.selectedAgent.doc._id,
          "_rev": this.selectedAgent.value.rev,
          "role":this.role,
          "displayName": this.displayName,
          "email": this.email,
          "photoURL": photoURL,
          "uid": this.selectedAgent.doc.uid,
          "mobilePhones": [
            this.mobileNumber
          ],
          "boardAgentIds": boardObject,
          "organizationId": parseInt(this.office),
          "leadPriority": 0,
          "leadSpecializationTags": [],
          "lookups": {
            "auth0": {
              "id": this.auth || ''
            }
          }
        }

        api.updateAgent(this.$store.state, this.selectedAgent.doc.uid, agentJson).then(response => {
          //have to update rev number, or next put will fail
          if (response.status != 200) {
            this.$set(this, 'isSaved', 'error')
          } else if (this.isSaved != 'error') {
            this.$set(this, 'isSaved', 'saved')
            this.selectedAgent.value.rev = response.body.rev
          }
          return response.body
        }).catch(e => {
          console.warn(e)
          this.$set(this, 'isSaved', 'error')
        })
      }
    },

    updateExtraInfo: function() {
      if (this.selectedAgentExtraInfo) {

        //first element of speaks should be a string
        var languages = this.speaks ? [(this.speaks).toString()] : [" "]

        let agentJson = {
          "profileLinks": this.getProfileLinks(),
          "title" : this.role,
          "speaks": languages,
          "bio": this.bio,
          "profilePicture": this.photoURL
        }

        api.updateExtraInfo(this.$store.state, this.selectedAgent.doc.uid, agentJson).then(response => {
          this.$set(this, 'loading', false)

          if (response.status != 200) {
            this.$set(this, 'isSaved', 'error')
          }
          return response.body
        }).catch(e => {
          this.$set(this, 'isSaved', 'error')
          console.warn(e)
        })
      }
    },

    deleteAgent: function() {
      var result = confirm("Are you sure you want to delete this Agent?")

      if (result) {
        api.deleteAgent(this.$store.state, this.selectedAgent.doc.uid).then(response => {
          this.$emit('deletedSelectedAgent')
          return
        }).catch(e => {
          console.warn(e)
          this.$set(this, 'isSaved', 'error')
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.new-agent
  font-size: 0.9em
.agent-image
  height: 150px
  width: 125px
.agent-select
  text-align: left
  border-bottom: 2px solid rgba(0,0,0,0.2)
  padding: 0.5em
  font-size: 0.9em

  .agent-edit
    text-align: right

.control
  .input
    border-radius: 0 !important

    &:focus
      .icon
        color: $wsIcon !important

        &:hover
          color: $wsTextLight !important

  &:first-child
    min-width: 72px

  &:last-child
    width: auto
    flex: 1

  .icon
    pointer-events: auto
    cursor: pointer
    color: $wsIcon !important
    opacity: 1 !important

    &:hover
      color: $wsTextLight !important
</style>
