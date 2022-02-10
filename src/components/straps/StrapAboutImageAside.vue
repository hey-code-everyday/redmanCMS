<template>
  <div class="strap-about-image-aside">
    <div class="strap-container container pad-medium">
      <div class='columns'>
        <div class='column is-image'>
          <div class='image-container'>
            <editable-image @change="$strap_onComponentChange" keyName="image" :value="strap_state.image" />
          </div>
        </div>
        <div class='column is-text'>
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
  name: 'Strap',

  components: {
    EditableLinkList,
    EditableButtonList,

    EditableImage,
    EditableQuill,
    EditableTitle
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'About Image Aside' }),
      text: defaultQuill(),
      image: defaultImage({
        imageUrl: '//via.placeholder.com/512x512'
      }),
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
      ]
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-about-image-aside
  .columns
    flex: 1

  .level-left,
  .strap-links
    width: 100%

  +tablet
    .container
      display: flex
      align-items: center
      justify-content: center
    
  /deep/
    img
      +touch
        height: auto !important
        max-width: 320px !important
        width: 100% !important
      
      +desktop-only
        height: auto !important
        width: 300px !important
    
+tablet
  .columns
    width: auto
  
  .column
    display: flex
    align-items: center
  
    &.is-image
      flex: 0
      justify-content: flex-end
  
    &.is-text
      flex: 1
      padding-left: 4.25rem
      padding-bottom: 4.25rem

+desktop
  .column

    &.is-image
      flex: 1
  
    &.is-text
      flex: 1

  .no-padding-bottom
    .strap-container.pad-medium
      padding-bottom: 0

</style>