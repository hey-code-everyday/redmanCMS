<template>
  <span
    :class="[ 'social-icons', (vertical ? 'is-vertical' : false) ]"
    :style="`font-size: ${size}px`"
  >
    <a
      v-for="(url, social) in $store.state.website.config.social"
      v-if="url"
      target="_blank"
      rel="nofollow"
      class="social-icon"
      :href="url"
      :style="{ padding: (size * 0.1) + 'px', width: (size * 1.72) + 'px', height: (size * 1.72) + 'px' }"
    >
      <span class="icon">
        <i :class="`socicon-${social}`"></i>
      </span>
    </a>
  </span>
</template>

<script>
export default {
  props: {
    vertical: {
      type: [String, Boolean],
      default: false
    },

    size: {
      type: [String, Number],
      default: 14
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/sass/variables'

.social-icons
  display: flex
  a
    display: inline-flex
    justify-content: center
    align-items: center
    text-align: center
    margin-right: 0.5em
    border-radius: 50%
    &:last-child
      margin-right: 0
      margin-bottom: 0
  &.is-vertical
    flex-direction: column
    a
      margin-right: 0
      margin-bottom: 0.5rem

+mobile
  .social-icons
    transform: scale(0.8) translateX(-20px)
</style>
