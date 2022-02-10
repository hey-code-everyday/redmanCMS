<template>
  <div :class="[ 'nav-bar', (branded ? 'is-branded' : '') ]">

    <template v-for="(navItem, i) in nav">
      <!-- Link only -->
      <template v-if="!navItem.dropdown.length">
        <component :is="(navItem.href ? 'a' : 'div')" class="navbar-item" :target="navItem.linkOut ? '_blank' : ''" :href="massageUrl(navItem.href) || false">
          {{ navItem.label }}
        </component>
      </template>
      <!-- Dropdown -->
      <template v-else>
        <div class="navbar-item has-dropdown is-hoverable" :key="i">
          <component :is="(navItem.href ? 'a' : 'div')" class="navbar-link" :target="navItem.linkOut ? '_blank' : ''" :href="massageUrl(navItem.href) || false">
            {{ navItem.label }}
          </component>

          <div :class="[ 'navbar-dropdown',  (right ? 'is-right' : ''), (boxed ? 'is-boxed' : '') ]">
            <template v-for="(dropdownItem, k) in navItem.dropdown">
              <a class="navbar-item" :target="dropdownItem.linkOut ? '_blank' : ''" :href="massageUrl(dropdownItem.href)" :key="k">
                {{ dropdownItem.label }}
              </a>
            </template>
          </div>
        </div>
      </template>
    </template>

  </div>
</template>

<script>
import massageUrl from '@/helpers/massage-url'

export default {
  props: {
    nav: {
      type: Array,
      required: true
    },

    right: {
      type: Boolean,
      default: true
    },

    boxed: {
      type: Boolean,
      default: false
    },

    branded: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    massageUrl (url) {
      return massageUrl(url)
    }
  }
}
</script>

<style lang="sass">
.nav-bar

.navbar-item
  cursor: pointer
</style>
