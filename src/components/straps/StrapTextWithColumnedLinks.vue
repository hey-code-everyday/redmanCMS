<template>
  <div class="strap-text-with-columns-aside">
    <div class="strap-container container pad-small">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="mainTitle" :value="strap_state.mainTitle" />
      </header>

      <div class='strap-content content'>
        <div class="strap-content__inner">
          <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
        </div>
      </div>

      <br/>

      <div class="columned-link-container">
        <div class="columns">
          <div class="column is-half-desktop is-half-tablet columned-link">
            <editable-title class="column-title subtitle" @change="$strap_onComponentChange" keyName="topBoxTitle" :value="strap_state.topBoxTitle" />
            <div class="columns is-gapless is-mobile">
              <div class="column link-column" :class="getProportionsTop" v-for="x in strap_state.topColumnNumber">
                <editable-link-list
                  tag="div"
                  :listKey="getListString('Top', x)"
                  :list="getLinkListTop(x)"
                  :onCreate="$strap_onListCreate"
                  :onChange="$strap_onListChange"
                  :onDelete="$strap_onListDelete"
                />
              </div>
            </div>
          </div>
          <div class="column is-hidden-desktop is-hidden-tablet"></div>
          <div class="column is-half-desktop is-half-tablet columned-link">
            <editable-title class="column-title subtitle" @change="$strap_onComponentChange" keyName="bottomBoxTitle" :value="strap_state.bottomBoxTitle" />
            <div class="columns is-gapless is-mobile">
              <div class="column link-column" :class="getProportionsBottom" v-for="x in strap_state.bottomColumnNumber">
                <editable-link-list
                  tag="div"
                  :listKey="getListString('Bottom', x)"
                  :list="getLinkListBottom(x)"
                  :onCreate="$strap_onListCreate"
                  :onChange="$strap_onListChange"
                  :onDelete="$strap_onListDelete"
                />
              </div>
            </div>
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

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableButtonList from '@/components/editable/EditableButtonList'
import EditableLinkList from '@/components/editable/EditableLinkList'

import defaultLink from '@/store/defaults/components/link'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapTextWithColumnedLinks',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableLinkList
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      topColumnNumber: 1,
      bottomColumnNumber: 1,
      text: defaultQuill(),
      mainTitle: defaultTitle({ html: 'Text with Columns Aside' }),
      topBoxTitle: defaultTitle({ html: 'Column Title' }),
      bottomBoxTitle: defaultTitle({ html: 'Column Title' }),
      buttonList: [defaultButton()],
      linkListTop1: [
        defaultLink({
          text: 'Price Range'
        })
      ],
      linkListTop2: [
        defaultLink({
          text: 'Price Range'
        })
      ],
      linkListTop3: [
        defaultLink({
          text: 'Price Range'
        })
      ],
      linkListBottom1: [
        defaultLink({
          text: 'Neighbourhood'
        })
      ],
      linkListBottom2: [
        defaultLink({
          text: 'Neighbourhood'
        })
      ],
      linkListBottom3: [
        defaultLink({
          text: 'Neighbourhood'
        })
      ]
    }
  },

  computed: {
    getProportionsTop () {
      if (this.strap.state.topColumnNumber === 1) {
        return ''
      } else if (this.strap.state.topColumnNumber === 2) {
        return 'is-one-half'
      } else if (this.strap.state.topColumnNumber === 3) {
        return 'is-one-third'
      }
    },

    getProportionsBottom () {
      if (this.strap.state.bottomColumnNumber === 1) {
        return ''
      } else if (this.strap.state.bottomColumnNumber === 2) {
        return 'is-one-half'
      } else if (this.strap.state.bottomColumnNumber === 3) {
        return 'is-one-third'
      }
    }
  },

  methods: {
    /*The onChange methods for EditableList uses the state of the strap to add/remove links. Therefore,
      we have to send the key that will be used as a string. In this case, it's referencing the linkList#
    */

    getListString(boxPosition, x) {
      return 'linkList' + boxPosition + x
    },

    getLinkListTop(index) {
      if (index === 1) {
        return this.strap.state.linkListTop1
      } else if (index === 2) {
        return this.strap.state.linkListTop2
      } else if (index === 3) {
        return this.strap.state.linkListTop3
      } else {
        return []
      }
    },
    getLinkListBottom(index) {
      if (index === 1) {
        return this.strap.state.linkListBottom1
      } else if (index === 2) {
        return this.strap.state.linkListBottom2
      } else if (index === 3) {
        return this.strap.state.linkListBottom3
      } else {
        return []
      }
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
                key: 'state.topColumnNumber',
                type: 'number',
                label: 'Number of columns in top box',
                default: 0,
                hint: 'Select anywhere between 1-3 columns.',
                minValue: 1,
                maxValue: 3,
                step: 1
              },
              {
                key: 'state.bottomColumnNumber',
                type: 'number',
                label: 'Number of columns in bottom box.',
                default: 0,
                hint: 'Select anywhere between 1-3 columns.',
                minValue: 1,
                maxValue: 3,
                step: 1
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

.strap-text-with-columns-aside
  .columned-link-container
    +desktop
      margin: 0em 2em 2em .5em


  .columned-link
    border: 2px solid black
    margin: 0em .5em 0em .5em

  .column-title
    height: 1.5em
    font-size: 1.5em
    margin-bottom: 0px

  .column-box-gap
    height: 2em

  .link-column
    /deep/
      .strap-links .editable-link
        display: block
        overflow: hidden
        text-overflow: ellipsis

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

.strap-footer
  margin-top: 1em

+mobile
  .strap-content__inner
    max-width: 100% !important
</style>
