<template>
  <nav class="header-contract-strip nav is-thin is-solid var--app-primary">
    <div class="level" style="width:100%">
      <div class="level-left is-hidden-mobile" v-if="!hideSocial">
        <div class="level-item">
          <social-icons class="social-icons" :size="12" />
        </div>
      </div>

      <div class="level-right is-hidden-mobile" style="margin-bottom:0">
        <div class="level-item">
          <a class="nav-item" :href='"tel:"+config.office.phone'>
            <span style='margin:0 6px 0 0;transform:translateY(2px)'>
              <span class="icon">
                <i class="icon-telephone"></i>
              </span>
            </span>
            <span>{{ config.office.phone }}</span>
          </a>
        </div>
      </div>

      <div class="level-item is-hidden-tablet" style="margin-bottom:0">
        <div style="width:100%;height:24px" class="is-flex">
          <div style="width:50%;padding-left:10px" class="has-text-left" v-if="!hideSocial">
            <social-icons :size="12" />
          </div>
          <div style="width:50%;padding-right:10px" class="has-text-left">
            <a :href='"tel:"+config.office.phone'>
              <span style='margin:0 6px 0 0;transform:translateY(2px)'>
                <span class="icon">
                  <i class="icon-telephone"></i>
                </span>
              </span>
              <span>{{ config.office.phone }}</span>
            </a>
          </div>
        </div>
      </div>

      <div v-show="loggedIn" class="navbar-end is-hidden-touch">
        <a @click="logout">Sign Out</a>
      </div>
      <div v-show="!loggedIn" class="navbar-end is-hidden-touch">
        <a @click="login" class="border-right">Sign In</a>
      </div>

    </div>
  </nav>
</template>

<script>
import SocialIcons from '@/components/SocialIcons'
import mixinHeader from '@/mixins/header'

export default {
  name: 'HeaderContactStrip',

  mixins: [mixinHeader],

  props: {
    hideSocial: {
      type: Boolean,
      default: false
    }
  },

  components: {
    SocialIcons
  },

  computed: {
    config () {
      return this.$store.state.website.config
    },
    loggedIn () {
      return this.$store.getters.clientAuthenticated
    }
  },

  methods: {
    login () {
      this.$store.commit('SHOW_AUTH')
    },

    logout () {
      this.$store.dispatch('clearClientAuth')
    }
  }
}
</script>

<style lang="sass" scoped>
.header-contract-strip
  display: flex
  padding: 0 10px
  height: 34px
  color: var(--header-brandText)
  background: var(--header-brandBgColor)
  a,
  a:link,
  a:hover,
  a:visited
    color: var(--header-brandText)

.social-icons
  /deep/
    .social-icon
      color: var(--header-brandBgColor) !important
      background-color: var(--header-brandText) !important

.border-right
  margin-right: 11px
  padding-right: 11px
  position: relative

  &::after
    content: ""
    display: block
    height: 12px
    opacity: 0.75
    position: absolute
    right: -1px
    top: 6px
    width: 1px
</style>
