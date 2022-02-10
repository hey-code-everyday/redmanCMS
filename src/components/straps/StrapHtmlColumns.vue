<template>
  <div class="strap-html-columns">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class='strap-content content'>
        <div class="columns">
          <div class="column">
            <editable-html @change="$strap_onComponentChange" keyName="htmlCol1" :value="strap_state.htmlCol1" />
          </div>
          <div class="column">
            <editable-html @change="$strap_onComponentChange" keyName="htmlCol2" :value="strap_state.htmlCol2" />
          </div>
          <div class="column">
            <editable-html @change="$strap_onComponentChange" keyName="htmlCol3" :value="strap_state.htmlCol3" />
          </div>
          <div class="column">
            <editable-html @change="$strap_onComponentChange" keyName="htmlCol4" :value="strap_state.htmlCol4" />
          </div>
          <div class="column">
            <editable-html @change="$strap_onComponentChange" keyName="htmlCol5" :value="strap_state.htmlCol5" />
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
  name: 'StrapHtmlColumns',

  components: {
    EditableButtonList,

    EditableHtml,
    EditableTitle
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'HTML Columns' }),
      htmlCol1: defaultHtml({ html: 'Column 1' }),
      htmlCol2: defaultHtml({ html: 'Column 2' }),
      htmlCol3: defaultHtml({ html: 'Column 3' }),
      htmlCol4: defaultHtml({ html: 'Column 4' }),
      htmlCol5: defaultHtml({ html: 'Column 5' }),
      buttonList: [defaultButton()]
    }
  }
}
</script>

<style scoped lang="sass">
.strap-html-columns

.columns
  width: 100%
  margin: 0

.column
  &:empty
    display: none
</style>
