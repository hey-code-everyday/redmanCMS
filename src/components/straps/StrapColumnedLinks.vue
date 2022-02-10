<template>
  <div class="strap-columned-links">
    <div class="custom-strap-container">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class='strap-content content'>
        <div class="strap-content__inner">
          <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
        </div>
      </div>

      <div class="columns is-2 is-multiline is-mobile is-centered">
        <div class="column link-column" :class="getColumnProportions" v-for="x in strap_state.numberOfColumns">
          <editable-link-list
            tag="div"
            :style="getTextAlign"
            :listKey="getListString(x)"
            :list="getLinkList(x)"
            :onCreate="$strap_onListCreate"
            :onChange="$strap_onListChange"
            :onDelete="$strap_onListDelete"
          />
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
import EditableLinkList from '@/components/editable/EditableLinkList'

import defaultLink from '@/store/defaults/components/link'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapColumnedLinks',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableLinkList
  },

  mixins: [mixinStrap],

  computed: {
    getColumnProportions () {
      var colNum = this.strap.state.numberOfColumns

      if (colNum === 1) {
        return ''
      } else if (colNum === 2) {
        return 'is-6-desktop is-6-mobile is-6-tablet'
      } else if (colNum === 3) {
        return 'is-4-desktop is-6-mobile is-4-tablet'
      } else if (colNum === 4) {
        return 'is-3-desktop is-6-mobile is-6-tablet'
      } else if (colNum === 5) {
        return 'is-2-desktop is-6-mobile is-4-tablet'
      } else if (colNum === 6) {
        return 'is-2-desktop is-6-mobile is-4-tablet'
      }
    },

    getTextAlign () {
      return 'textAlign:' + this.strap.state.textAlign
    }
  },

  methods: {
    /*The onChange methods for EditableList uses the state of the strap to add/remove links. Therefore,
      we have to send the key that will be used as a string. In this case, it's referencing the linkList#
    */

    getListString(x) {
      return 'linkList' + x
    },

    getLinkList(index) {
      if (index >= 1 && index <= 12) {
        return this.strap.state['linkList' + index]
      } else {
        return []
      }
    }
  },

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      numberOfColumns: 1,
      title: defaultTitle({ html: 'Column Strap' }),
      buttonList: [defaultButton()],
      linkList1: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList2: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList3: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList4: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList5: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList6: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList7: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList8: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList9: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList10: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList11: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
      linkList12: [
        defaultLink({
          text: '{{ office.email }}'
        })
      ],
    }
  },

  schema () {
    return [
      {
        title: 'Column Display',
        tabs: [
          {
            title: 'Layout',
            fields: [
              {
                key: 'state.numberOfColumns',
                type: 'number',
                label: 'Number of Columns',
                default: 1,
                hint: 'Number of columns that will contain links (up to 6 max)',
                minValue: 1,
                maxValue: 6,
                step: 1
              },
              {
                key: 'state.textAlign',
                type: 'dropdown',
                label: 'Link Text Alignment',
                default: 'center',
                options: [
                  { text: 'center', value: 'center' },
                  { text: 'left', value: 'left' },
                  { text: 'right', value: 'right' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-columned-links
  .custom-strap-container
    +desktop
      margin: 2em
    +mobile
      margin: 1em

  /deep/
    .strap-links .editable-link
      display: block

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
