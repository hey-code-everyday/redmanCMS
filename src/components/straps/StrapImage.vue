<template>
  <div class="strap-image">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class='strap-content content'>
        <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
        <br />
        <div>
          <editable-image @change="$strap_onComponentChange" keyName="image" :value="strap_state.image" />
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
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableImage from '@/components/editable/EditableImage'
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultImage from '@/store/defaults/components/image'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'Strap',

  components: {
    EditableButtonList,

    EditableImage,
    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Image' }),
      text: defaultQuill(),
      image: defaultImage({ imageUrl: '//via.placeholder.com/800x600' }),
      buttonList: [defaultButton()]
    }
  }
}
</script>

<style scoped lang="sass">
.strap-image
</style>
