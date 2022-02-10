<template>
  <div class='strap-large-about-image-aside columns is-gapless'>

    <div v-show="!strap_state.imageOnRight || isMobile" class='column is-image'>
      <div class='image-container'>
        <div class="image" :style="getImage">
        </div>
      </div>
    </div>
    <div class='column is-text'>
      <div class="strap-container container pad-medium">
        <div>
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
          </header>

          <div class='strap-content content'>
            <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
          </div>

          <div class='strap-content content'>
            <div class='level'>
              <div class='level-left'>
                <editable-link-list
                  tag="div"
                  listKey="linkList"
                  :list="strap_state.linkList"
                  :onCreate="$strap_onListCreate"
                  :onChange="$strap_onListChange"
                  :onDelete="$strap_onListDelete"
                />
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
    </div>
    <div v-show="strap_state.imageOnRight && !isMobile" class='column is-image'>
      <div class='image-container'>
        <div class="image" :style="getImage">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableLinkList from '@/components/editable/EditableLinkList'
import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableImage from '@/components/editable/EditableImage'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableTitle from '@/components/editable/EditableTitle'

import defaultLink from '@/store/defaults/components/link'
import defaultImage from '@/store/defaults/components/image'
import defaultQuill from '@/store/defaults/components/quill'
import defaultTitle from '@/store/defaults/components/title'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapLargeAboutImageAside',

  components: {
    EditableLinkList,
    EditableButtonList,

    EditableImage,
    EditableQuill,
    EditableTitle
  },

  mixins: [mixinStrap],

  computed: {
    getImage() {
      return {
        backgroundImage: `url("` + this.strap_state.imageSrc + `")`
      }
    },
    isMobile () {
      return this.$store.getters.isMobile
    },
  },

  schema () {
    return [
      {
        title: 'Image',
        tabs: [
          {
            title: 'Image',
            fields: [
              {
                key: 'state.imageSrc',
                type: 'image',
                label: 'Image url',
                default: ''
              },
              {
                key: 'state.imageOnRight',
                type: 'checkbox',
                label: 'Image Position',
                text: 'Place the image on the right',
                default: false,
                onValue: true,
                offValue: false
              },
            ]
          }
        ]
      }
    ]
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'About Image Aside' }),
      text: defaultQuill(),
      imageSrc: '//via.placeholder.com/512x512',
      buttonList: [defaultButton()],
      linkList: [
        defaultLink({
          icon: 'icon-envelope-open',
          text: '{{ office.email }}'
        }),
        defaultLink({
          icon: 'icon-telephone',
          text: '{{ filters.phoneNumber(office.phone) }}'
        })
      ],
      imageOnRight: false
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-large-about-image-aside
  .level-left,
  .strap-links
    width: 100%

  .image-container
    height: 100%

  .image
    min-height: 300px
    height: 100%
    background-position: 50% 0%
    background-size: cover
    background-repeat: no-repeat


</style>