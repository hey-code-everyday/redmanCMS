<template>
  <div class="large-listing-card card var--app-card">
    <a class="card-link" :href="cardLink" v-on:mouseover="isActive = !isActive" v-on:mouseleave="isActive = !isActive"></a>
    <div class='overlay has-label strong'>
      <div v-if="listing.open_houses" class="inner-lablel">
        {{getDate}} • {{getTime}}
      </div>
      <div v-if="!listing.open_houses">
        Open House
      </div>
    </div>

    <div class="card-image">
      <template v-if="listing.images && listing.images.length">
        <div :class=" { hover: isActive }" class="overlay is-bg" :style="`background-image: url(${bgSrc})`"></div>
        <figure :class=" { hover: isActive }" class="image" :style="`background-image: url(${imageSrc})`">
          <img  :src="imageSrc" :srcset="imageSrcset" />
        </figure>
      </template>
      <template v-else>
        <div class="overlay is-bg" ></div>
        <figure class="image has-no-image">
          <span class="no-image">
            No Image Available
          </span>
        </figure>
      </template>
      <div class="overlay is-fg" :class=" { hover: isActive }">
        <div class="overlay-inner">
          <div class="card-info">
            <p v-if="listing.bathrooms || listing.bedrooms || listing.area">
              <b>
              <span v-if="listing.bedrooms">{{ listing.bedrooms }} BED •</span>
              <span v-if="listing.bathrooms">{{ listing.bathrooms }} BATH •</span>
              <span v-if="listing.area">{{ Math.round(listing.area) }} SQFT</span>
              </b>
            </p>
            <h3 v-if="listing.price">
              {{ listing.price | listingPrice }}
            </h3>
            <h4 v-if="listing.address">
              <b>
                <span v-if="community">
                  {{ community }} |
                </span>
                {{ listing.address }}
              </b>
            </h4>
          </div>
          <div class="listing-favorite">
            <a v-if="isFavorite"
            class="fav-icon"
            href="javascript:void(0)"
            @click="toggleFavorite">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path :style="{ fill: primaryColor }" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg>
            </a>
            <a v-else
            class="fav-icon"
            href="javascript:void(0)"
            @click="toggleFavorite">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path :style="{ fill: primaryColor }" d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import api from '@/api'
import { encodeDetailsUrl, formatDate, formatTime } from '@/helpers/listings'
import favoriteListingMixin from '@/mixins/favorite-listing'

export default {
  name: 'LargeOpenHouseCard',

  mixins: [favoriteListingMixin],

  props: {
    listing: {
      type: Object,
      required: true
    }
  },

  created() {
    if (!this.listing.location) return
    if (!this.listing.location.lat) return
    if (!this.listing.location.lon) return
    var latlong = {
      lat: parseFloat(this.listing.location.lat),
      lon: parseFloat(this.listing.location.lon)
    }

    api.getHierarchiesByLatLon(this.$store.state, latlong).then(res => {
      this.$set(this, 'breadcrumbs', res.body)
      return
    }).catch(err => {
      new Error(err)
      this.error = true
    })
  },

  computed: {
    cardLink () {
      return encodeDetailsUrl(this.listing)
    },

    primaryColor () {
      return '#fff'
    },

    getDate () {
      return formatDate(this.listing)
    },
    getTime () {
      return formatTime(this.listing)
    },

    community () {
      var community = ''

      for (var x in this.breadcrumbs) {
        var node = this.breadcrumbs[x]
        if (node['wof:placetype'] === 'neighbourhood') {
          community = node['wof:name']
        }
      }
      return community
    }
  },

  data () {
    return {
      bgSrc: null,
      imageSrc: null,
      imageSrcset: null,
      listingImageError: false,
      isActive: false,
      breadcrumbs: {}
    }
  },

  methods: {
    getSrcForSize (src, size) {
      const parts = src.split('/')
      if (parts.length < 4) {
        throw new Error('getSrcForSize: provided src is not a URL')
      }
      const [filename] = parts.slice().reverse()
      return src.replace(filename, `${size}/${filename}`)
    },

    getSrcset (src, sizes) {
      return sizes.map(size =>
        `${this.getSrcForSize(src, size.name)} ${size.width}w`
      ).join(', ')
    },

    setSrcset () {
      const images = this.listing.images
      if (!images || !images.length) return null

      const image = images[0]

      this.imageSrcset = this.getSrcset(image, [
        { name: 'retina-medium', width: 1000 },
        { name: 'medium', width: 500 }
      ])
    },

    setSrc () {
      const images = this.listing.images
      if (!images || !images.length) return ''

      let src = images[0]
      src = src.split('/')
      src.splice(src.length - 1, 0, 'medium')
      src = src.join('/')

      const image = new Image()
      image.onerror = () => {
        this.imageSrc = images[0]
      }
      image.src = src
      this.imageSrc = src
    },

    setBgsrc () {
      const images = this.listing.images
      if (!images || !images.length) return null

      let src = images[0]
      src = src.split('/')
      src.splice(src.length - 1, 0, 'medium')
      src = src.join('/')

      const image = new Image()
      image.onerror = () => {
        this.bgSrc = images[0]
      }
      image.src = src
      this.bgSrc = src
    },

    randomString (from, to) {
      const numChars = from + (Math.floor(Math.random() * (to - from)))

      let str = ''
      for (let i = 0; i < numChars; i++) {
        str += String.fromCharCode((65 + Math.floor(Math.random() * 25)))
      }
      return str
    },

    randomPrice () {
      const parts = [
        this.randomString(3, 3),
        this.randomString(3, 3)
      ]
      return parts.join(' ')
    },

    randomAddress () {
      const parts = [
        this.randomString(4, 6),
        this.randomString(2, 3),
        this.randomString(2, 6)
      ]
      return parts.join(' ')
    }
  },

  mounted () {
    this.setSrc()
    this.setBgsrc()
    this.setSrcset()
  }
}
</script>

<style lang="sass" scoped>
.large-listing-card
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

    &.is-co
      font-size: 12px

  .card-content
    flex: 1

.card
  box-shadow: 0px 0px 0px!important

.card-link
  display: block
  position: absolute
  z-index: 0
  top: 0
  left: 0
  right: 0
  bottom: 0

.has-label
  text-align: center
  font-size: 20px
  font-weight: bolder
  color: #fff
  background-color: var(--default-text)
  position: absolute
  width: 100%
  left: 0
  top: 0
  z-index: 2
  margin-top: 10px

  .inner-lablel
    margin: 5px

.card-image
  position: relative
  z-index: 1
  pointer-events: none
  height: 350px
  background-color: #333
  overflow: hidden

  .overlay
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

    &.is-bg
      z-index: 0
      top: -2%
      left: -2%
      right: -2%
      bottom: -2%
      filter: blur(2px)
      background-position: 50% 50%
      background-size: cover
      opacity: 0.8


    &.is-fg
      color: #fff
      padding: 20px
      text-shadow: 0 0 1px rgba(#000, 0.6)
      display: flex
      justify-content: flex-start
      align-items: flex-end
      background-size: 100% 100%
      background-color: rgba(#000, 0.3)
      transition: background-color 1s
      background-image: linear-gradient(180deg, rgba(#303841, 0) 0%, rgba(#303841, 0) 60%, rgba(#303841, 0.4) 100%)

      &.hover
        background-color: rgba(#000, 0)

      h3
        font-weight: bold
        font-size: 2.5rem
        margin-bottom: 0
        line-height: 1.1

      h4
        font-size: 18px
      p
        span
          display: inline-block
          margin-right: 5px

  .image
    position: relative
    top: 0
    left: 0
    width: 100%
    height: 100%
    margin: 0
    background-position: 50% 50%
    background-size: cover
    background-repeat: no-repeat
    transition: transform 1s;

    img
      height: 0
      width: 0
      visibility: hidden

    &.hover
      transform: scale(1.03);


    &.has-no-image
      &:before
        content: ''
        z-index: 0
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: url('../assets/images/house.svg')
        background-position: 50% 50%
        background-size: contain
        background-repeat: no-repeat
        opacity: 0.1

    .no-image
      position: absolute
      z-index: 1
      text-align: center
      color: #fff
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      font-size: 120%
      opacity: 0.6

.is-blurred
  strong
    position: relative
    display: inline-block
    width: 50%
    height: 1rem

    &:before
      position: absolute
      z-index: 0
      content: ''
      width: 100%
      height: 100%
      box-shadow: 0 0 0 10px inset
      border-radius: 1px
      opacity: 0.1

    &:after
      position: absolute
      z-index: 1
      content: 'Address Hidden'
      width: 100%
      height: 100%
      font-size: 11px
      text-transform: uppercase
      text-align: center
      font-weight: lighter
      opacity: 0.4

.listing-favorite
  position: absolute
  bottom: 1.5rem
  right: 1.5rem

  a
    pointer-events: auto
    display: block
    height: 32px
    font-size: 28px
</style>
