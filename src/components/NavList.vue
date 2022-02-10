<template>
  <ul class="nav-list">
    <template v-for="(navItem, i) in nav">
      <li v-if="!navItem.dropdown.length">
        <a :href="massageUrl(navItem.href) || false">{{ navItem.label }}</a>
      </li>
    </template>
  </ul>
</template>

<script>
import massageUrl from '@/helpers/massage-url'

export default {
  props: {
    nav: {
      type: Array,
      required: true
    }
  },

  methods: {
    massageUrl (url) {
      return massageUrl(url)
    }
  }
}
</script>

<style lang="sass" scoped>
.nav-list
  li
    margin-bottom: 0.5rem
</style>
