<template>
  <div class="share-box var--gus-box">

    <a class="share-button is-email var--gus-button-media" :href="emailUrl()" target="_blank">
      <span class="icon">
        <Email />
      </span>
    </a>

    <a
    v-for="social in socials"
    class="share-button"
    target="_blank"
    :style="{ backgroundColor: social.color }"
    :href="url(social.name)">
      <span class="icon">
        <component :is="social.name" />
      </span>
    </a>

    <div class="share-button is-close">
      <span class="icon">
        <i class="icon-cross"></i>
      </span>
    </div>

  </div>
</template>

<script>
import Email from './SVG/Email'
import Twitter from './SVG/Twitter'
import Facebook from './SVG/Facebook'
import window from 'listing-details@/window'

export default {
  components: {
    Email,
    Twitter,
    Facebook
  },

  data () {
    return {
      socials: [
        { name: 'twitter', color: '#1da1f2' },
        { name: 'facebook', color: '#3b5998' }
      ]
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },

    url (social) {
      switch (social) {
        case 'twitter': return this.twitterUrl()
        case 'facebook': return this.facebookUrl()
      }

      return '/'
    },

    emailUrl () {
      return `mailto:?&subject=I just found this great property&body=${window.location.href}`
    },

    twitterUrl () {
      return `https://twitter.com/home?status=` + encodeURIComponent(`I just found this great property - ${window.location.href}`)
    },

    facebookUrl () {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    }
  }
}
</script>

<style lang="sass" scoped>
.share-box
  width: 62px
  overflow: hidden

.share-button
  display: block
  text-decoration: none
  position: relative
  width: 62px
  height: 62px
  cursor: pointer
  background: #efefef

  &.is-close
    i
      color: rgba(0,0,0,0.3)

  .icon
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-12px, -12px)
    display: block
    width: 24px
    height: 24px
    text-align: center

    i
      font-size: 24px

    svg
      fill: #fff
      stroke-width: 1px
</style>
