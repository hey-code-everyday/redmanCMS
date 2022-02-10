<template>
  <div class="strap-about-simple">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class='strap-content content'>
        <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
        <br />
        <editable-link-list
          tag="div"
          listKey="linkList"
          :list="strap_state.linkList"
          :onCreate="$strap_onListCreate"
          :onChange="$strap_onListChange"
          :onDelete="$strap_onListDelete"
        />
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
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableLinkList from '@/components/editable/EditableLinkList'
import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultLink from '@/store/defaults/components/link'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapAboutSimple',

  components: {
    EditableLinkList,
    EditableButtonList,

    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'About Simple' }),
      text: defaultQuill(),
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
.strap-about-simple
</style>
