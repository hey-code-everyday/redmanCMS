<template>

<div class="save-search-popup card box var--gus-box gus-panel--mobile-up gus-layer-panel" :ref="$options.name">
  <form method="POST" @submit="submit">

    <div class="card-content">
      <div class="content">
        <div class="field">
          <label class="label var--gus-reset-colors" for="saved-search-name">Save This Search</label>
          <div class="control has-icons-right">
            <input :class="`input ${error ? 'is-danger' : 'var--gus-border-primary'}`" name="saved-search-name" v-model="savedSearchName" id="saved-search-name" />
            <span v-if="!!error" class="icon is-right"><i class="icon-warning is-large"></i></span>
            <span v-if="loadState === 'saving'" class="icon is-right gus-loading saved-search-popup__loading"></span>
            <span v-if="loadState === 'saved'" class="icon is-right saved-search-popup__success"><i class="icon-check"></i></span>
          </div>
          <p class="help is-danger">{{error}}</p>
        </div>
      </div>
    </div>

    <footer class="card-footer">
      <button type="reset" @click="close" class="card-footer-item save-search-popup__button var--gus-reset-colors">Cancel</button>
      <button type="submit" :disabled="disabled" class="card-footer-item save-search-popup__button var--gus-bg-primary">
        Save
      </button>
    </footer>

  </form>
</div>

</template>

<script>

export default {
  name: 'SaveSearchPopup',

  data: function () {
    return {
      savedSearchName: 'My Saved Search',
      loadState: 'ready' // may also be 'saving', 'saved'
    }
  },

  computed: {
    suggestedSavedSearchName: function () {
      return this.$store.getters.uniqueSavedSearchTitle()
    },

    error: function () {
      if (this.loadState !== 'ready') return

      if (this.savedSearchName === '') {
        return 'Name cannot be empty'
      }
      if (
        this.$store.state.gus.saved &&
        this.$store.state.gus.saved.find(save => save.name === this.savedSearchName)
      ) {
        return 'Search with this name already exists'
      }
      return ''
    },

    disabled: function () {
      return !!this.error || (this.loadState !== 'ready')
    }
  },

  methods: {
    close: function () {
      this.$emit('requestClose')
    },
    submit: function (e) {
      e.preventDefault()
      this.loadState = 'saving'
      this.$store.dispatch('saveSearch', this.savedSearchName).then(res => {
        this.loadState = 'saved'
        setTimeout(() => this.$emit('requestClose'), 1000)
      })
    }
  },

  created: function () {
    this.savedSearchName = this.suggestedSavedSearchName
  }
}
</script>

<style scoped lang="sass">

.save-search-popup
  padding: 0
  max-width: unset
  text-align: left

.save-search-popup__button
  border: none
  font-size: 1.2em
  cursor: pointer
  position: relative
  &:disabled
    cursor: not-allowed
    opacity: 0.5

.saved-search-popup__loading
  font-size: 0.6em
  margin: 8px

.saved-search-popup__success
  animation: saved 0.5s ease-in-out

@keyframes saved
  0%
    transform: scaleX(0)
  100%
    transform: scaleX(1)

@-webkit-keyframes saved
  0%
    -webkit-transform: scaleX(0)
  100%
    -webkit-transform: scaleX(1)

</style>
