<template>
  <div class="strap-html-contained">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class='strap-content content'>
        <editable-html @change="$strap_onComponentChange" keyName="html" :value="strap_state.html" />
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

import EditableHtml from '@/components/editable/EditableHtml'
import EditableTitle from '@/components/editable/EditableTitle'

import defaultHtml from '@/store/defaults/components/html'
import defaultTitle from '@/store/defaults/components/title'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapHtmlContained',

  components: {
    EditableButtonList,

    EditableHtml,
    EditableTitle
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'HTML Contained' }),
      html: defaultHtml(),
      buttonList: [defaultButton()]
    }
  }
}
</script>

<style scoped lang="sass">
.strap-html-contained
</style>
