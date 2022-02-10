<template>
  <div class="empty-card card var--app-card">
    <div class="card-content">
      <div class="content">
        <slot />
      </div>
    </div>
    <a v-if="href" class="card-link" :href="href">
    </a>
  </div>
</template>

<script>
export default {
  name: 'EmptyCard',

  props: {
    href: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="sass" scoped>
.empty-card
  display: flex
  flex-direction: column
  text-align: left
  font-size: 14px

  strong
    font-size: 16px

  p
    margin-bottom: 0
    white-space: nowrap
    max-width: 100%
    text-overflow: ellipsis
    overflow: hidden

  .card-content
    flex: 1

  .card-link
    display: block
    position: absolute
    z-index: 3
    top: 0
    left: 0
    right: 0
    bottom: 0
</style>
