<template>
  <div class="strap-featured-agent">
    <div class="strap-container container pad-medium">
      <div class="columns">

        <div class="column is-flex has-centered-content is-hidden-tablet">
          <div class="mobile-image-frame">
            <img :src="$strap_interpolate(strap_state.image.imageUrl)" />
          </div>
        </div>

        <div class="column is-flex is-aligned-left text-column">
          <div style="width:100%">
            <header class='strap-header content'>
              <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
            </header>

            <p class='strap-content content'>
              <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
            </p>

            <div class="strap-content content agent-fields">
              <div class="level" v-if="strap_state.textPhone.text !== ''">
                <div class="level-left">
                  <span class="level-item agent-label">Phone</span>
                </div>
                <div class="level-left">
                  <a class="level-item" :href="'tel:' + $strap_interpolate(strap_state.textPhone.text)">
                    <editable-text @change="$strap_onComponentChange" keyName="textPhone" :value="strap_state.textPhone" />
                  </a>
                </div>
              </div>

              <div class="level" v-if="strap_state.textEmail.text !== ''">
                <div class="level-left">
                  <span class="level-item agent-label">Email</span>
                </div>
                <div class="level-left">
                  <a class="level-item" :href="'mailto:' + $strap_interpolate(strap_state.textEmail.text)">
                    <editable-text @change="$strap_onComponentChange" keyName="textEmail" :value="strap_state.textEmail" />
                  </a>
                </div>
              </div>

              <div class="level" v-if="hasSocialLinks">
                <div class="level-left">
                  <span class="level-item agent-label">Social</span>
                </div>
                <div class="level-left">
                  <template v-for="(link, social) in $store.getters.socialLinks">
                    <a :href="link" v-if="link" target="_blank">
                      <span class="icon">
                        <i :class="`socicon-${social}`"></i>
                      </span>
                    </a>
                  </template>
                </div>
              </div>
            </div>

            <footer class='strap-footer content'>
              <editable-button-list
                tag="div"
                listKey="buttonList"
                :list="strap_state.buttonList"
                :onCreate="$strap_onListCreate"
                :onChange="$strap_onListChange"
                :onDelete="$strap_onListDelete"
              />
            </footer>
          </div>
        </div>

        <div class="column is-flex has-centered-content agent-column is-hidden-mobile">
          <div :class="{ 'image-frame': true, 'has-image-wide': imageIsWide }">
            <div class="image-bg" :style="{ 'background-color': strap_palette.uiPrimary.bgColor }"></div>
            <div class="image-shadow"></div>
            <div class="image-main bg-image" :style="{ 'background-image': `url(${$strap_interpolate(strap_state.image.imageUrl)})` }"></div>
            <img ref="image" :src="$strap_interpolate(strap_state.image.imageUrl)" />
            <editable-image @change="$strap_onComponentChange" keyName="image" :value="strap_state.image" class="editable-image-1" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import mixinStrap from '@/mixins/strap'

import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableText from '@/components/editable/EditableText'
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableImage from '@/components/editable/EditableImage'

import defaultText from '@/store/defaults/components/text'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultImage from '@/store/defaults/components/image'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapFeaturedAgent',

  components: {
    EditableButtonList,

    EditableText,
    EditableTitle,
    EditableQuill,
    EditableImage
  },

  mixins: [mixinStrap],

  data () {
    return {
      imageIsWide: true,
      imageLoading: true
    }
  },

  computed: {
    imageStyles () {
      return {}
    },

    hasSocialLinks () {
      const socialLinks = this.$store.getters.socialLinks

      for (let key in socialLinks) {
        if (socialLinks[key]) {
          return true
        }
      }

      return false
    }
  },

  methods: {
    imageLoad (image, e) {
      Vue.nextTick(() => {
        const { naturalHeight: height, naturalWidth: width } = image
        Vue.set(this.$data, 'imageIsWide', width > height)
        Vue.set(this.$data, 'imageLoading', false)
      })
    }
  },

  mounted () {
    const { image } = this.$refs
    this._imageLoad = this.imageLoad.bind(this, image)
    image.addEventListener('load', this._imageLoad)
  },

  beforeDestroy () {
    this.$refs.image.removeEventListener('loadstart', this._imageLoad)
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'About {{ agent.displayName }}', size: 2 }),
      text: defaultQuill(),
      textPhone: defaultText({ text: '{{ filters.phoneNumber(office.phone) }}' }),
      textEmail: defaultText({ text: '{{ office.email }}' }),
      image: defaultImage({ imageUrl: '//via.placeholder.com/350x250?text={{ agent.id }}' }),
      buttonList: [defaultButton({ href: '/contact' })]
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-featured-agent

.columns
  position: relative

.column
  position: relative

  +mobile
    text-align: center

    .control-strip
      &:last-of-type
        .control:last-of-type
          margin-right: 0

    .agent-label
      padding-right: 0
      justify-content: center
      min-width: none

    &.text-column
      padding-right: 0.75rem

.text-column
  padding-right: 4rem
  overflow-y: hidden

.agent-column
  display: flex
  justify-content: center
  align-items: center
  flex: 1

.agent-fields
  .level
    justify-content: flex-start

    &:not(:last-child)
      margin-bottom: 0.5rem

.agent-label
  opacity: 0.6
  padding-right: 2rem
  min-width: 175px
  text-align: left
  justify-content: left

.image-frame
  position: relative

  > img
    position: absolute
    visibility: hidden
    pointer-events: none

  &.has-image-wide
    // padding-top: 0
    // padding-top: 60%
    // width: 100%

    .image-bg
      top: -3.75rem
      bottom: -3.75rem
      left: 2.5rem
      right: 2.5rem

.mobile-image-frame
  position: relative
  width: 100%

  img
    border: none
    width: 100%
    color: rgba(#000, 0.5)
    box-shadow: 0 7px 24px

.image-main,
.image-shadow
  position: absolute
  z-index: 1
  top: 0
  left: 0
  right: 0
  bottom: 0

.image-shadow
  color: #000
  box-shadow: 0 7px 24px
  opacity: 0.5

.image-main
  z-index: 2
  background-color: #35373A
  background-repeat: no-repeat
  background-size: cover
  background-position: 50% 50%

.image-bg
  position: absolute
  z-index: 1
  top: 2.5rem
  bottom: 2.5rem
  left: -3.75rem
  right: -3.75rem

.editable-image-1
  /deep/ img
    width: 100%
</style>
