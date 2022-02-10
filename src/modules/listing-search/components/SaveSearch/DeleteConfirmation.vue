<template>
<div class="card box var--gus-box gus-panel--mobile-up delete-confirmation gus-layer-panel" :aria-hidden="!toDelete">
  <div class="card-content">
    <div class="content">
      <p>Are you sure you want to delete this saved search:</p>
      <p><strong>{{toDelete.name}}</strong></p>
    </div>
  </div>
  <footer class="card-footer">
    <button class="button card-footer-item delete-confirmation__button var--gus-bg-primary" @click="confirm">Delete</button>
    <button class="button card-footer-item delete-confirmation__button" @click="cancel">Cancel</button>
  </footer>
</div>
</template>

<script>

export default {
  name: 'previousSearchesItemDeleteConfirmation',

  props: [
    'toDelete'
  ],

  methods: {
    confirm: function () {
      this.$store.dispatch('deleteSavedSearch', this.toDelete.id)
      this.$emit('close')
    },

    cancel: function () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="sass">

.delete-confirmation
  padding: 0
  text-align: left

.delete-confirmation__button
  font-size: 1.2em
  cursor: pointer
  position: relative
  text-align: center
  border: none
  border-radius: 0
  height: 100%
  &:disabled
    cursor: not-allowed
    opacity: 0.5

</style>
