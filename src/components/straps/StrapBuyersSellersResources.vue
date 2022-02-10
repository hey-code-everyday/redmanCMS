<template>
  <div class="strap-buyer-seller-resources">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <br />
      <div class='strap-content content'>
        <div class="tile is-ancestor">
          <div class="tile is-parent" v-for="i in [1, 2, 3]" :key="i">
            <div class="strap-bsr__box" :style="boxStyles">
              <p>
                <editable-icon @change="$strap_onComponentChange" :keyName="'icon' + i" :value="strap_state['icon' + i]" />
              </p>
              <p class="is-subtitle">
                <editable-text @change="$strap_onComponentChange" :keyName="'subtitle' + i" :value="strap_state['subtitle' + i]" />
              </p>
              <editable-quill @change="$strap_onComponentChange" :keyName="'text' + i" :value="strap_state['text' + i]" />
              <br />
              <editable-button @change="$strap_onComponentChange" :keyName="'emptyButton' + i" :value="strap_state['emptyButton' + i]" small="true" />
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

import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableIcon from '@/components/editable/EditableIcon'
import EditableText from '@/components/editable/EditableText'
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableButton from '@/components/editable/EditableButton'

import defaultText from '@/store/defaults/components/text'
import defaultIcon from '@/store/defaults/components/icon'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapBuyerSellerResources',

  components: {
    EditableButtonList,

    EditableIcon,
    EditableText,
    EditableTitle,
    EditableQuill,
    EditableButton
  },

  mixins: [mixinStrap],

  computed: {
    boxStyles () {
      const { strap_palette } = this
      return {
        borderColor: strap_palette.uiPrimary.bgColor
      }
    }
  },

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Buyers & Sellers Resources' }),
      buttonList: [],
      subtitle1: defaultText({ text: 'Email Updates' }),
      subtitle2: defaultText({ text: 'For Sellers' }),
      subtitle3: defaultText({ text: 'For Buyers' }),
      text1: defaultQuill({ html: 'Create and save custom listing searches, and opt-in to get new listings that match your search emailed directly to you.' }),
      text2: defaultQuill({ html: 'For most, a house is a big investment. Find out how much your investment is worth with a no-obligation market evaluation.' }),
      text3: defaultQuill({ html: 'Access and search every listing on the MLS® System using our simple, easy-to-use map search to find your next home today!' }),
      icon1: defaultIcon({ name: 'icon-envelope-open', style: 'enclosed', fontSize: 32 }),
      icon2: defaultIcon({ name: 'icon-bag-dollar', style: 'enclosed', fontSize: 32 }),
      icon3: defaultIcon({ name: 'icon-home4', style: 'enclosed', fontSize: 32 }),
      emptyButton1: defaultButton({ text: 'Sign Up', href: '/signup' }),
      emptyButton2: defaultButton({ text: 'Price Your Home', href: '/free-home-evaluation' }),
      emptyButton3: defaultButton({ text: 'Find Your Home', href: '/dream-home-finder' })
    }
  }
}
</script>

<style scoped lang="sass">
.strap-buyer-seller-resources

.strap-bsr__box
  border: solid 1px
  text-align: center !important
  padding: 1.5em
  border-radius: 0.25em

  p
    &.is-subtitle
      font-weight: bold
      font-size: 18px

</style>
