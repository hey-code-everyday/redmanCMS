<template>
  <transition name="mobile-nav">
    <div class='app-mobile-nav' v-if='visible'>

      <div class='overlay' @click='closeNav'>
      </div>

      <aside class="menu var--app-feature pad">
        <div class="app-mobile-nav__box-shadow"></div>

        <!-- Close button -->
        <div class="delete" @click="closeNav"></div>

        <template v-if="$store.state.website.config.display.logoUrl">
          <a href="/">
            <img :src="$store.state.website.config.display.logoUrl" style="width:75%" />
          </a>
          <br />
        </template>

        <!-- Account -->
        <template>
          <p class="menu-label">
            Account
          </p>
          <ul v-show="loggedIn" class="menu-list">
            <li><a @click="logout">Sign Out</a></li>
          </ul>
          <ul v-show="!loggedIn" class="menu-list">
            <li><a @click="login">Sign Up</a></li>
            <li><a @click="login">Sign In</a></li>
          </ul>
        </template>

        <!-- Single items -->
        <template v-if="hasTopLevel">
          <p class="menu-label" @click="toggleNav(0)">
            Navigation
            <span :class="[ 'icon', navToggled(0) && 'is-open' ]">
              <i class="icon-chevron-down"></i>
            </span>
          </p>
          <transition
            :css="false"
            @enter="enter"
            @leave="leave"
            >
            <ul :class="[ 'menu-list' ]" v-if="navToggled(0)">
              <li v-for="(navItem, i) in nav" :key="i" v-if="!navItem.dropdown.length">
                <a :href="navItem.href">{{ navItem.label }}</a>
              </li>
            </ul>
          </transition>
        </template>

        <!-- Nested items -->
        <template v-for="(navItem, i) in nav" v-if="navItem.dropdown.length">
          <p class="menu-label" @click="toggleNav(i + 1)">
            <template v-if="navItem.href">
              <a :href="navItem.href">{{ navItem.label }}</a>
            </template>
            <template v-else>
              {{ navItem.label }}
            </template>
            <span :class="[ 'icon', navToggled(i + 1) && 'is-open' ]">
              <i class="icon-chevron-down"></i>
            </span>
          </p>
          <transition
            :css="false"
            @enter="enter"
            @leave="leave"
          >
            <ul :class="[ 'menu-list' ]" v-if="navToggled(i + 1)">
              <li v-for="(dropdownItem, k) in navItem.dropdown">
                <a :href="dropdownItem.href">{{ dropdownItem.label }}</a>
              </li>
            </ul>
          </transition>
        </template>
      </aside>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppMobileNav',

  props: {
    visible: {
      type: Boolean,
      required: true
    },

    nav: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      toggled: {
        0: true
      }
    }
  },

  methods: {
    closeNav () {
      this.$store.commit('HIDE_MOBILE_NAV')
    },

    navToggled (i) {
      return this.toggled[i]
    },

    toggleNav (i) {
      for (let key in this.toggled) {
        if (key === i) continue
        this.toggled[key] = false
      }

      this.$set(this.toggled, i, !this.toggled[i])
    },

    enter (el, done) {
      const bRect = el.getBoundingClientRect()
      const height = bRect.height + 'px'

      el.style.height = '0px'

      setTimeout(() => {
        el.style.height = height
        done()
      }, 10)
    },

    leave (el, done) {
      el.style.height = '0px'

      setTimeout(() => {
        done()
      }, 150)
    },

    login () {
      this.$store.commit('SHOW_AUTH')
    },

    logout () {
      this.$store.dispatch('clearClientAuth')
    }
  },

  computed: {
    hasTopLevel () {
      let result = false

      this.nav.forEach(nav => {
        if (!nav.dropdown.length && nav.href) result = true
      })

      return result
    },

    palette () {
      return this.$store.getters.palette('feature')
    },

    loggedIn () {
      return this.$store.getters.clientAuthenticated
    }
  }
}
</script>

<style lang="sass" scoped>
.app-mobile-nav
  position: fixed
  pointer-events: auto
  top: 0
  left: 0
  width: 100vw
  height: 100vh

  .overlay
    position: absolute
    z-index: 0
    top: 0
    left: 0
    width: 100%
    height: 100%
    opacity: 0.6

  .menu
    position: relative
    z-index: 1
    top: 0
    left: 0
    height: 100%
    width: 100%
    max-width: 480px
    overflow-x: hidden
    overflow-y: auto

  .menu-label
    opacity: 0.6

  .delete
    position: fixed
    z-index: 1
    padding: 1.5rem
    top: 1.5rem
    right: 1.5rem

.app-mobile-nav__box-shadow
  position: fixed
  pointer-events: none
  box-shadow: 4px 0 17px rgba(#000, 0.2)
  top: 0
  left: 0
  width: 100vw
  height: 100vh

.mobile-nav-enter-active,
.mobile-nav-leave-active
  transition: all 250ms

  .overlay
    transition: opacity 250ms

  .menu
    transition: transform 250ms

.mobile-nav-enter,
.mobile-nav-leave-to
  .overlay
    opacity: 0

  .menu
    transform: translateX(-100%)

.menu-list
  overflow: hidden
  transition: height 150ms ease-in-out
  // height: 0
  // &.is-open
  //   height: auto
  li
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap

.menu-label
  user-select: none
  cursor: pointer
  marigin: 0
  &:not(:first-child)
    margin-top: 0
    padding-top: 1em
  &:not(:last-child)
    margin-bottom: 0
    padding-bottom: 1em

.icon
  &.is-open
    transform: rotate(180deg)

.overlay
  background: rgba(0,0,0,0.65)

.menu
  background-color: var(--header-brandBgColor)
  background-image: linear-gradient(135deg, var(--header-brandBgColor), var(--header-brandBgColor2))

.menu-label
  color: var(--header-brandText)

.menu-list
  a
    color: var(--header-brandText)
  a:hover
    background: transparent

</style>
