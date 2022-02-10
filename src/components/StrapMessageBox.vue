<template>
  <div class="strap-message-box box ws-ui">
    <div class="content">
      <p class="is-icon" v-if="icon">
        <i :class="`icon ${icon}`"></i>
      </p>
      <h5 v-if="title" class="title is-5">
        <strong>{{ title }}</strong>
      </h5>
      <p>
        <slot></slot>
      </p>
      <footer v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String
    },

    title: {
      type: String
    }
  },

  name: 'StrapMessageBox'
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.strap-message-box
  margin: 0 auto
  max-width: 450px
  width: 100%
  box-shadow: $wsUiShadow
  text-align: center
  color: $wsTextLight
  padding: 2rem

  .content
    .title
      margin: 0.6rem 0

    p
      margin: 0.4rem 0

      &.is-icon
        margin-bottom: 1.6rem

        .icon
          font-size: 50px
          height: 50px

  footer
    margin-top: 1.6rem
    margin-bottom: 0.4rem
</style>
