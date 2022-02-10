<template>
  <div>
    <div v-if="!loading">

      <div class="level">
        <div class='level-left'></div>
        <div class="level-right">
          <button class="level-item button new-office is-normal" @click="createNewOffice">
          <i class="new-icon icon-plus"></i> New Office </button>
        </div>
      </div>

      <hr/>

      <div v-for="office in offices.root.children">

        <label class="label"> Name: </label>
        <div class="control">
          <input class="input" v-model='office.name'><br/>
          <p class="help">*required</p>
        </div>

        <label class="label"> Address </label> 
        <div class="control">
          <input class="input" v-model="office.address" placeholder="Add Me!"><br/>
          <p class="help">*required</p>
        </div>

         <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <div class="label is-normal">
                  <label class="label">City</label>
                </div>
                <p class="control">
                  <input class="input" v-model='office.city' required><br/>
                  <p class="help">*required</p>
                </p>
              </div>
              <div class="field">
                <div class="label is-normal">
                  <label class="label">Postal</label>
                </div>
                <p class="control is-expanded">
                  <input class="input"  v-model='office.postal' placeholder="Add Me!" required><br/>
                  <p class="help">*required</p>
                </p>
              </div>
            </div>
          </div>

        <div class="level">
          <div class="level-left">
            <button @click="removeOffice(office)" class="button level-item save-button is-danger "> DELETE </button>
          </div>

          <div class="level-right">
            <button @click="saveOffices(office)" class="button level-item save-button is-success "> SAVE </button>
          </div>
        </div>

        <hr/>

      </div>
    </div>

    <div v-if="loading">
      Loading...
    </div>

  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'OfficeManager',

  data() {
    return {
      loading: true,
      offices: {},
      name: '',
      address: '',
      city: '',
      postal: ''
    }
  },

  created () {
    Promise.all([
      api.getOffices(this.$store.state).then(response => {
        this.$set(this, 'offices', response.body)
        this.$set(this, 'loading', false)
        return response.body
      }).catch(e => {
        console.warn(e)
      })
    ])
  },

  watch: {
    offices (newOfficeList) {
      this.$set(this, 'offices', newOfficeList)
    }
  },

  methods: {
    getNextId () {
      var maxId = 0
      var officesHolder = this.offices.root.children

      for (var id in officesHolder) {
        var office = officesHolder[id]

        if (office && office.id > maxId) {
          maxId = office.id
        }
      }

      return parseInt(maxId) + 1

    },

    createNewOffice() {
      var emptyOffice = {
        "id": this.getNextId(),
        "name": 'New Office',
        "address": '123 Street',
        "type": "office",
        "city": 'City',
        "postal": 'A1B 2C3 '
      }

      var newOfficeList = (this.offices.root.children).concat(emptyOffice)
      this.offices.root.children = newOfficeList
      this.updateOfficesAPI()
    },

    removeOffice(removedOffice) {
      this.$set(this, 'loading', true)
      var newOfficeList = this.offices.root.children.filter( office => {
        return String(office.id).indexOf(String(removedOffice.id)) === -1
      })

      this.offices.root.children = newOfficeList
      this.updateOfficesAPI()

    },

    saveOffices(updatedOffice) {
      this.$set(this, 'loading', true)
      var newOfficeList = this.offices.root.children.filter( office => {
        return String(office.id).indexOf(String(updatedOffice.id)) === -1
      })

      newOfficeList = newOfficeList.concat(updatedOffice)

      this.offices.root.children = newOfficeList

      this.$set(this, 'offices', this.offices)
      this.updateOfficesAPI()
    },

    updateOfficesAPI (){
      api.putOffice(this.$store.state, this.offices).then(response => {
        //update rev number, or else error occurs
        this.offices._rev = response.body.rev
        this.$set(this, 'loading', false)
        return
      }).catch(e => {
        console.warn(e)
      })
    }
  }
}

</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/_all'

.button-container
  text-align: right

.new-icon
  padding-right: .5em

.new-office
  border-radius: 10px


</style>
