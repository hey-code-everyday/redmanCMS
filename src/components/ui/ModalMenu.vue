<template>
  <aside class="modal-menu menu">

    <template v-for="group in modal.groups">
      <p class="modal-menu__label menu-label">
        {{ group.title }}
      </p>
      <ul class="modal-menu__list menu-list">
        <li>
          <ul>
            <li v-for="panel in group.panels">
              <a :class="{ 'is-active': isActivePanel(panel, group) }" @click="changePanel(panel)">{{ panel.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </template>

  </aside>
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
    isActivePanel (panel, group) {
      const { curPanel, curGroup } = this.$props.modal

      if (group.key === curGroup.key && panel.title === curPanel.title) {
        return true
      }

      return false
    },

    changePanel (curPanel) {
      const curTab = curPanel.tabs[0]

      // TODO: make generic
      this.$store.commit(this.$props.mutation, { curPanel, curTab })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.modal-menu
  padding: 50px 20px
  min-width: 250px

  background-color: $wsDarkGrey
  color: $wsWhite

  a,
  a:link,
  a:visited
    color: #f5f5f5 !important

  +mobile
    padding: 30px 15px

.modal-menu__label
  color: $wsTextLight

.modal-menu__list
  a
    color: $wsWhite

    &:hover
      background-color: rgba($wsTextLight, 0.15)

    &.is-active
      background-color: $wsRed
      background-image: $wsUiGradient
      color: #fff !important

  li
    ul
      border-left-color: $wsBorder
</style>
