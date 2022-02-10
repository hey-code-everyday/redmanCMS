<template>
<div class="modal-tabs">
  <div class="tabs">
    <ul>
      <li v-for="tab in modal.curPanel.tabs" :class="{ 'is-active': isActiveTab(tab) }">
        <a @click="changeTab(tab)">{{ tab.title }}</a>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  props: {
    modal: {
      type: Object,
      required: true
    },

    mutation: {
      type: String,
      required: true
    }
  },

  methods: {
    isActiveTab (tab) {
      const { curTab } = this.$props.modal

      if (tab.title === curTab.title) {
        return true
      }

      return false
    },

    changeTab (curTab) {
      this.$store.commit(this.$props.mutation, { curTab })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.modal-tabs
  position: relative
  margin-bottom: 50px

  .tabs
    margin: 0 50px
    position: relative
    z-index: 1

    ul
      border-bottom-color: transparent

    a
      padding-left: 0
      padding-right: 0
      margin-right: 30px
      border-bottom-color: transparent
      color: $wsTextLight

    li
      &.is-active
        a
          border-bottom-color: $wsRed
          color: $wsText
  +mobile
    margin-bottom: 20px

    .tabs
      margin: 0 20px

  &::before
    position: absolute
    content: ''
    bottom: 0
    left: 0
    right: 0
    height: 1px
    box-shadow: 0 0 0 1px rgba($wsTextLight, 0.35) inset
</style>
