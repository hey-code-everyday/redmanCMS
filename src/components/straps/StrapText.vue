<template>
  <div class="strap-text">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class='strap-content content'>
        <div class="strap-content__inner" :style="{ maxWidth: strap_state.textWidth ? strap_state.textWidth + '%' : false }">
          <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
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

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableButtonList from '@/components/editable/EditableButtonList'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapText',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      textWidth: 0,
      title: defaultTitle({ html: 'Text Strap' }),
      buttonList: [defaultButton()]
    }
  },

  schema () {
    return [
      {
        title: 'Text Display',
        tabs: [
          {
            title: 'Layout',
            fields: [
              {
                key: 'state.textWidth',
                type: 'number',
                label: 'Maxmimum Text Width',
                default: 0,
                hint: 'Maxmimum text width in percent. Set to 0 for automatic.',
                minValue: 0,
                maxValue: 100,
                step: 5
              }
            ]
          }
        ]
      }
    ]
  },

  migrations (strap, state) {
    return [
      { textWidth: 0 } // Issue #35
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-text

.strap-content
  display: flex

  .strap-content__inner
    width: 100%

.is-aligned-centered
  .strap-content
    justify-content: center

.is-aligned-right
  .strap-content
    justify-content: flex-end

+mobile
  .strap-content__inner
    max-width: 100% !important
</style>
