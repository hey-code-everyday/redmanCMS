<template>
<div class="modal-new-listing-details modal-box">
  <div class="modal-box__content new-listing-details__content">
    <div class="modal-box__content-inner new-listing-details__content-inner">
      <!-- Nav bar -->
      <div class="modal-nav__containner">
        <div class="nav_back">
          <svg
            @click="closeModal"
            width="28"
            height="28"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              fill-rule="nonzero"
              d="M10.308 16c0 .256.097.512.293.707l9.193 9.192c.39.39 1.024.39 1.414 0 .39-.39.39-1.024 0-1.415L12.722 16l8.485-8.485c.39-.39.39-1.024 0-1.414-.39-.39-1.024-.39-1.414 0L10.6 15.294c-.195.195-.292.45-.292.707z"></path>
          </svg>
          <p class="subtitle">
            <template v-if="searchResult.city">{{ searchResult.city }}</template>
            <template v-if="searchResult.city && searchResult.province">,</template>
            <template v-if="searchResult.province">{{ searchResult.province }}</template>
          </p>
        </div>
        <div class="gallery-modal__selection">
          <button v-if="images.length > 0" @click="gotoPhotos"> <Photo /> {{ images.length }} Photos </button>
          <button v-if="videos.length > 0" @click="gotoVideos"> <Video /> {{ videos.length }} Videos </button>
          <button v-if="others.length > 0" @click="gotoOthers"> {{ others.length }} Others </button>
        </div>
      </div>

      <!-- Mobile toggle buttons -->
      <div class="gallery-section__selection-mobile">
        <button v-if="images.length > 0" @click="gotoPhotos"> <Photo /> {{ images.length }} Photos </button>
        <button v-if="videos.length > 0" @click="gotoVideos"> <Video /> {{ videos.length }} Videos </button>
        <button v-if="others.length > 0" @click="gotoOthers"> {{ others.length }} Others </button>
      </div>

      
      <!-- Images -->
      <template v-if="images.length > 0">
        <h3 class="title is-2 var--gus-title" id="new-listing-details-modal__photos">
          {{ images.length }} Photos
        </h3>
        <template v-for="(image, id) in images">
          <div class="ws-ui" v-if="$store.state.editing && typeof(image) === 'object'">
            <button class="button is-primary" @click="openEditImage(image)">
              <span>Click to Edit</span>
            </button>
          </div>
          <img
            class="new-listing-details__img"
            :src="typeof(image) === 'string' ? image : image.data.imageUrl"
            :alt="getAltTag(id + 1)"
            :id="`listing-details-modal-item-${id}`"
            :key="`listing-details-modal-img-${id}`"
          />
        </template>
      </template>
      
      <!-- Videos -->
      <template v-if="videos.length > 0">
        <h3 class="title is-2 var--gus-title" id="new-listing-details-modal__videos">
          {{ videos.length }} Videos
        </h3>
        <div
          v-for="(video, id) in videos"
          :id="`listing-details-modal-item-${images.length + id}`"
          :key="`listing-details-modal-video-${id}`"
          class="video-containner"
        >
          <div class="ws-ui" v-if="$store.state.editing">
            <button class="button is-primary" @click="openEditVideo(video)">
              <span>Click to Edit</span>
            </button>
          </div>
          <youtube-video
            :url="video.data.url"
            :highres="true"
            class="youtube-video"
          />
        </div>
      </template>

      <!-- Others -->
      <template v-if="others.length > 0">
        <h3 class="title is-2 var--gus-title" id="new-listing-details-modal__others">
          Others
        </h3>
        <div
          v-for="(other, id) in others"
          :id="`listing-details-modal-item-${images.length + videos.length + id}`"
          :key="`listing-details-modal-other-${id}`"
          class="other-containner is-other"
        >
          <div class="ws-ui" v-if="$store.state.editing">
            <button class="button is-primary" @click="openEditHtml(other)">
              <span>Click to Edit</span>
            </button>
          </div>
          <postscribe-html :html="other.data.html" />
        </div>
      </template>

      <!-- Contact card -->
      <listing-contact-card
        v-if="Object.keys(strap).length > 0"
        :listing="searchResult"
        :forms="{ moreInfo: strap.state.formMoreInfo.formID, requestShowing: strap.state.formRequestShowing.formID }"
        :theme="strap.config.style.theme"
        @submit="formSubmitted"
      />
    </div>
  </div>
</div>
</template>

<script>
import ListingNav from '@/modules/listing-details/components/listing/ListingNav'
import ListingContactCard from '@/modules/listing-details/components/listing/ListingContactCard'
import YoutubeVideo from '@/components/YouTubeVideo'
import PostscribeHtml from '@/components/PostscribeHtml'
import Photo from '@/modules/listing-details/components/SVG/Photo'
import Video from '@/modules/listing-details/components/SVG/Video'
import { elementScrollToTop } from '@/modules/listing-search/helpers/elementScrollToTop'

export default {
  name: 'ModalNewListingDetails',

  components: {
    ListingNav,
    ListingContactCard,
    YoutubeVideo,
    PostscribeHtml,
    Photo,
    Video
  },

  computed: {
    selectedID() {
      return this.$store.state.ui.newListingDetailsModalSelectedImgID
    },

    searchResult() {
      return this.$store.state.ui.newListingDetailsSearchResult.searchResult
        ? this.$store.state.ui.newListingDetailsSearchResult.searchResult
        : {}
    },

    strap() {
      return this.$store.state.ui.newListingDetailsSearchResult.strap
        ? this.$store.state.ui.newListingDetailsSearchResult.strap
        : {}
    },

    images() {
      if (!this.searchResult) return []
      if (!this.searchResult.publicInfo.additionalMedia) this.searchResult.images
      return this.searchResult.images.concat(this.searchResult.publicInfo.additionalMedia.filter(media => media.type === 'image'))
    },

    videos() {
      if (!this.searchResult.publicInfo.additionalMedia) return []
      return this.searchResult.publicInfo.additionalMedia.filter(media => media.type === 'video')
    },

    others() {
      if (!this.searchResult.publicInfo.additionalMedia) return []
      return this.searchResult.publicInfo.additionalMedia.filter(media => media.type === 'other')
    },

    postalCode() {
      if (!this.searchResult.additionalDetails) return false
      let postalCode = ''
      this.searchResult.additionalDetails.map(additionalDetail => {
        additionalDetail.details.map(detail => {
          if (Object.keys(detail)[0] === 'Postal Code') {
            postalCode = detail['Postal Code']
          }
        })
      })
      return postalCode
    },
  },

  watch: {
    selectedID() {
      if (this.selectedID) {
        elementScrollToTop(`listing-details-modal-item-${this.selectedID}`)
      }
    }
  },

  mounted() {
    if (this.selectedID) {
      elementScrollToTop(`listing-details-modal-item-${this.selectedID}`)
    }
  },

  methods: {
    gotoPhotos() {
      elementScrollToTop('new-listing-details-modal__photos')
    },
    gotoVideos() {
      elementScrollToTop('new-listing-details-modal__videos')
    },
    gotoOthers() {
      elementScrollToTop('new-listing-details-modal__others')
    },
    closeModal() {
      this.$store.commit('HIDE_ALL_MODALS')
    },
    formSubmitted() {
      console.log('did it')
    },
    openEditImage(item) {
      if (!this.$store.state.editing) return

      const id = 1
      const value = item.data
      const keyName = this.searchResult.publicInfo.additionalMedia.indexOf(item)

      const schema = {
        title: 'Image',
        canDelete: true,
        fields: [
          {
            key: 'imageUrl',
            type: 'image',
            label: 'Image URL',
            default: ''
          }
        ]
      }

      const onChange = newValue => {
        this.$store.dispatch('startEditing')
        value[newValue.keyName] = newValue.value
      }

      const onDelete = () => {
        this.$store.dispatch('startEditing')
        this.searchResult.publicInfo.additionalMedia.splice(keyName, 1)

        this.checkIndex()
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value,
        schema,
        keyName,
        onChange,
        onDelete
      })
    },
    openEditVideo(item) {
      if (!this.$store.state.editing) return

      const id = 1
      const value = item.data
      const keyName = this.searchResult.publicInfo.additionalMedia.indexOf(item)

      const schema = {
        title: 'YouTube Video',
        canDelete: true,
        fields: [
          {
            key: 'url',
            type: 'text',
            label: 'Video URL',
            default: ''
          }
        ]
      }

      const onChange = newValue => {
        this.$store.dispatch('startEditing')
        value[newValue.keyName] = newValue.value
      }

      const onDelete = () => {
        this.$store.dispatch('startEditing')
        this.searchResult.publicInfo.additionalMedia.splice(keyName, 1)

        this.checkIndex()
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value,
        schema,
        keyName,
        onChange,
        onDelete
      })
    },
    openEditHtml(item) {
      if (!this.$store.state.editing) return

      const id = 1
      const value = item.data
      const editValue = {...item.data, html: decodeURI(item.data.html)}
      const keyName = this.searchResult.publicInfo.additionalMedia.indexOf(item)

      const schema = {
        title: 'Other',
        canDelete: true,
        fields: [
          {
            key: 'html',
            type: 'multiText',
            label: 'HTML',
            default: ''
          }
        ]
      }

      const onChange = newValue => {
        this.$store.dispatch('startEditing')
        value[newValue.keyName] = encodeURI(newValue.value)
      }

      const onDelete = () => {
        this.$store.dispatch('startEditing')
        this.searchResult.publicInfo.additionalMedia.splice(keyName, 1)

        this.checkIndex()
      }

      this.$store.commit('SHOW_EDIT_COMPONENT', {
        id,
        value: editValue,
        schema,
        keyName,
        onChange,
        onDelete
      })
    },
    getAltTag(order) {
      const keys = ['address', 'neighbourhood', 'city', 'province']
      const suffix = []
      keys.map(key => {
        if (this.searchResult[key]) {
          suffix.push(this.searchResult[key])
        }
      })
      if (this.postalCode !== '') {
        suffix.push(this.postalCode)
      }
      return `${suffix.join(', ')} - ${order}`
    }
  }
}
</script>

<style lang="sass" scoped>
.new-listing-details__content
  background-color: rgb(248, 248, 248)
  .modal-box__content
    padding: 50px 0 120px 0

.modal-new-listing-details
  width: 100%
  height: 100%

.new-listing-details__img
  max-width: 100%
  padding-top: 2rem
  @media (max-width: 768px)
    padding-top: 0.5rem

.new-listing-details__content-inner
  max-width: 60rem
  margin: auto
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding-top: 5rem
  padding-bottom: 5rem
  h3
    width: 100%
    font-weight: 700
    font-size: 32px
    line-height: 48px
    padding-left: 2rem
    margin-top: 2rem
    color: var(--default-titleText) !important
  @media (max-width: 768px)
    padding: 4rem 0

.gallery-section__selection-mobile
  display: none
  max-width: 100vw
  @media (max-width: 768px)
    display: inline-flex
  text-align: center
  align-items: center
  vertical-align: top
  padding: 10px 0
  height: 52px
  background-color: rgb(255, 255, 255)
  box-shadow: #00000026 0px 6px 12px 0px
  border-radius: 26px
  cursor: pointer
  z-index: 0
  button
    margin: 0px
    width: auto
    overflow: visible
    white-space: nowrap
    color: inherit
    background: transparent
    border: none
    user-select: none
    appearance: none
    -webkit-tap-highlight-color: transparent
    display: flex
    -webkit-box-align: center
    align-items: center
    padding: 0px 10px
    font-size: 14px
    line-height: 24px
    border-right: 1px solid #b7c1d2
    outline: none
    cursor: pointer
  button:last-of-type
    border-right: none

.gallery-modal__selection
  @media (max-width: 768px)
    display: none
  text-align: center
  align-items: center
  display: inline-flex
  vertical-align: top
  padding: 10px 20px
  height: 52px
  background-color: rgb(255, 255, 255)
  box-shadow: #00000026 0px 6px 12px 0px
  border-radius: 26px
  cursor: pointer
  z-index: 2
  button
    margin: 0px
    width: auto
    overflow: visible
    white-space: nowrap
    color: inherit
    background: transparent
    border: none
    user-select: none
    appearance: none
    -webkit-tap-highlight-color: transparent
    display: flex
    -webkit-box-align: center
    align-items: center
    padding: 0px 20px
    font-size: 14px
    line-height: 24px
    border-right: 1px solid #b7c1d2
    outline: none
    cursor: pointer
  button:last-of-type
    border-right: none

.modal-nav__containner
  display: flex
  justify-content: space-between
  z-index: 2
  align-items: center
  width: 100%
  position: absolute
  top: 0
  padding: 0 8rem
  height: 6rem
  background: white
  border-bottom: 1px solid #ded8d8
  @media (max-width: 768px)
    height: 4.5rem
    padding: 0 1rem
.listing-nav
  &:after
    border-bottom: none !important

.nav_back
  display: flex
  align-items: center
  .subtitle
    padding-left: 1rem
  svg
    cursor: pointer

.other-containner
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  margin-top: 1rem
  width: 100%
.video-containner
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  margin-top: 1rem
  width: 100%

.is-other
  > div,
  .postscribe-html__inner
    width: 100%
    height: 100%
</style>
