<template>
  <div class="custom-modal-listing-share">
    <div class="content">
      <h2 class="title is-5">
        Share
        <em>{{ listing.address }}, {{ listing.city }}, {{ listing.province }}</em>
      </h2>

      <div class="field is-grouped is-social-share">
        <div class="control">
          <a class="button is-primary is-twitter" :href="shareUrl('twitter')" target="_blank">
            <span class="icon"><i class="socicon-twitter"></i></span>
            <span>Twitter</span>
          </a>
        </div>
        <div class="control">
          <a class="button is-primary is-facebook" :href="shareUrl('facebook')" target="_blank">
            <span class="icon"><i class="socicon-facebook"></i></span>
            <span>Facebook</span>
          </a>
        </div>
        <div class="control">
          <a class="button is-primary is-email" :href="emailUrl()" target="_blank">
            <span class="icon"><i class="icon-envelope-open"></i></span>
            <span>Email</span>
          </a>
        </div>
      </div>

      <div class="hr"><span>OR</span></div>

      <div class="field is-grouped" style="cursor:pointer">
        <div class="control is-url" @click="selectUrl">
          <span ref="url">{{ url }}</span>
        </div>
        <div class="control">
          <div class="button is-primary" @click="copyUrl">
            Copy Link
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
  name: 'ShareListing',

  props: {
    listing: { 
      type: Object, 
      required: true 
    }
  },

  computed: {
    url () {
      return process.browser ? window.location.href : ''
    }
  },

  methods: {
    shareUrl (social) {
      switch (social) {
        case 'twitter': return this.twitterUrl()
        case 'facebook': return this.facebookUrl()
      }
    },

    emailUrl () {
      return `mailto:?&subject=I just found this great property&body=${this.url}`
    },

    twitterUrl () {
      return `https://twitter.com/intent/tweet?text=` + encodeURIComponent(`I just found this great property - ${this.url}`)
    },

    facebookUrl () {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`
    },

    copyUrl () {
      if (!process.browser) return

      this.$copyText(this.url).then(result => {
        this.$store.dispatch('showNotification', { message: 'Link copied to clipboard!', type: 'branded' })
      }, err => {
        console.warn(err)
        this.$store.dispatch('showNotification', { message: 'Error copying link to clipboard.', type: 'error' })
      })
    },

    selectUrl (e) {
      if (!process.browser) return

      const el = this.$refs.url
      const selection = window.getSelection()
      const range = document.createRange()

      range.selectNodeContents(el)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../assets/sass/variables'

.custom-modal-listing-share

.title
  margin-bottom: 1.5rem + .75rem
  em
    opacity: 0.4
    font-style: normal

.hr
  margin: 1.5rem 0
  position: relative
  text-align: center
  span
    opacity: 0.8
    font-size: 14px
    font-weight: bold
  &:after,
  &:before
    position: absolute
    left: 0
    top: 50%
    content: ''
    width: 45%
    height: 0
    border-bottom: solid 1px
    opacity: 0.2
  &:after
    left: auto
    right: 0

.field
  width: 100%
  &.is-social-share
    .control
      flex: 1
      height:
    .button
      width: 100%
      height: 48px
      line-height: 48px
      color: #fff !important

.control
  &.is-url
    line-height: 36px
    flex: 1
    span
      border-bottom: solid 1px
      opacity: 0.6

.button
  &.is-twitter
    background: $brandTwitter !important
  &.is-facebook
    background: $brandFacebook !important
</style>
