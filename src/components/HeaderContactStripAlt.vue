<template>
  <nav class="header-contract-strip-alt nav is-thin is-solid is-hidden-mobile">
    <div class="level" style="width:100%">
      <div class="level-left"/>
      <div class="level-right is-hidden-mobile" style="margin-bottom:0">
        <div class="level-item small-pad-right">
          <a class="nav-item" :href='"tel:"+config.office.phone'>
            <span style='margin:0 6px 0 0;transform:translateY(2px)'>
            </span>
            <span class="call-us-text">Call Today:</span>
            <span class="phone-number"> {{ config.office.phone }}</span>
          </a>
        </div>
        <div class="level-item is-hidden-mobile small-pad-right var--app-default" v-if="!hideSocial">
          <social-icons :size="12" />
        </div>

        <div class="level-item is-hidden-tablet" style="margin-bottom:0">
          <div style="width:100%;height:24px" class="is-flex">
            <div style="width:50%;padding-left:10px" class="has-text-left" v-if="!hideSocial">
              <social-icons :size="12"/>
            </div>
            <div style="width:50%;padding-right:10px" class="has-text-right">
              <a :href='"tel:"+config.office.phone'>
                <span style='margin:0 6px 0 0;transform:translateY(2px)'>
                  <span class="icon">
                    <i class="icon-telephone"></i>
                  </span>
                </span>
                <span class="call-us-text">Call Us Today:</span>
                <span class="phone-number"> {{ config.office.phone }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="level-item signInSignOut">
          <div v-show="loggedIn" class="navbar-end is-hidden-touch">
            <a class="signIn" @click="logout">Sign Out</a>
          </div>
          <div v-show="!loggedIn">
            <div class="navbar-end is-hidden-touch">
              <a @click="login" class="signIn border-right">Sign In</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </nav>
</template>

<script>
import SocialIcons from '@/components/SocialIcons'
import mixinHeader from '@/mixins/header'

export default {
  name: 'HeaderContactStripAlt',

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
.header-contract-strip-alt
  padding: 10px 10px
  margin-bottom: 5px!important
  height: 34px
  .small-pad-right
    padding-right: 1.75vw

.signIn
  color: var(--header-linkText)

.social-icons
  /deep/
    .social-icon
      color: var(--header-brandText) !important
      background-color: var(--header-brandBgColor) !important

.call-us-text
  color: var(--header-linkText)
  font-weight: bold

.phone-number
  color: var(--default-accentColor)
  font-weight: bold
  font-size: 110%
</style>
