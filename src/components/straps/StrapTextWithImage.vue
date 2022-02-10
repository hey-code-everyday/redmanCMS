<template>
  <div class="strap-text-with-image">
    <div class="strap-container container" v-bind:class="[strap_state.bottomPadding ? 'pad-medium-bottom' : 'small-padding-bottom', strap_state.topPadding ? 'pad-medium-top' : 'small-padding-top']">
      <header class='strap-header content' v-if="strap_state.showTitle">
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class="columns">
        <div class="column is-3-fullhd is-4-desktop is-5-tablet" v-if="!strap_state.imageOnRight && strap_state.showImage" style="margin-right: 20px; text-align: center!important">
             <editable-image @change="$strap_onComponentChange" keyName="image" :value="strap_state.image" />
        </div>
        <div class="column">
          <div class='strap-content content'>
            <div class="strap-content__inner" :style="{ maxWidth: strap_state.textWidth ? strap_state.textWidth + '%' : false }">
              <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
            </div>
          </div>
        </div>
        <div class="column is-3-fullhd is-4-desktop is-5-tablet" v-if="strap_state.imageOnRight && strap_state.showImage" style="margin-left: 20px; text-align: center!important">
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

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableButtonList from '@/components/editable/EditableButtonList'
import EditableImage from '@/components/editable/EditableImage'


import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'
import defaultImage from '@/store/defaults/components/image'


export default {
  name: 'StrapTextwithImage',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButtonList,
    EditableImage
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      text: defaultQuill(),
      textWidth: 0,
      title: defaultTitle({ html: 'Text Strap' }),
      buttonList: [defaultButton()],
      agentOnRight: true,
      showtitle: true,
      showImage: true,
      bottomPadding: true,
      topPadding: true,
      image: defaultImage({ imageUrl: '//via.placeholder.com/250x250' }),
    }
  },

  schema () {
    return [
    {
        title: 'Strap Appearance',
        tabs: [
          {
            title: 'Display',
            fields: [
              {
                key: 'state.showImage',
                type: 'checkbox',
                label: 'Show Image',
                text: 'Have an image inline with the text',
                default: true,
                onValue: true,
                offValue: false
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
              {
                key: 'state.showTitle',
                type: 'checkbox',
                label: 'Show title',
                text: 'Show the title',
                default: true,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.topPadding',
                type: 'checkbox',
                label: 'Top Padding',
                text: 'Have padding on the top',
                default: true,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.bottomPadding',
                type: 'checkbox',
                label: 'Bottom Padding',
                text: 'Have padding on the bottom',
                default: true,
                onValue: true,
                offValue: false
              }
            ]
          }
        ]
      },
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

.strap-text-with-image
  .small-padding-bottom
    padding-bottom: 1px

  .small-padding-top
    padding-top: 0

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
