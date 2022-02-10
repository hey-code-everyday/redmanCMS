<template>
  <div class="strap-big-icons">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class='strap-content content'>
        <div class="level">
          <div class="level-item is-narrow is-icon is-hidden-mobile">
            <editable-icon @change="$strap_onComponentChange" keyName="icon1" :value="strap_state.icon1" />
          </div>
          <div class="level-item is-narrow is-text is-hidden-mobile">+</div>
          <div class="level-item is-narrow is-icon is-hidden-mobile">
            <editable-icon @change="$strap_onComponentChange" keyName="icon2" :value="strap_state.icon2" />
          </div>
          <div class="level-item is-narrow is-text is-hidden-mobile">=</div>
          <div class="level-item is-narrow is-icon">
            <editable-icon @change="$strap_onComponentChange" keyName="icon3" :value="strap_state.icon3" />
          </div>
        </div>
        <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
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
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultIcon from '@/store/defaults/components/icon'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'Strap',

  components: {
    EditableButtonList,

    EditableIcon,
    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Big Icons' }),
      text: defaultQuill(),
      buttonList: [defaultButton()],
      icon1: defaultIcon({ name: 'icon-user', style: 'enclosed', fontSize: 28 }),
      icon2: defaultIcon({ name: 'icon-home4', style: 'enclosed', fontSize: 28 }),
      icon3: defaultIcon({ name: 'icon-heart', style: 'enclosed', fontSize: 28 })
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-big-icons

.level
  justify-content: center

.level-item
  &.is-text
    font-size: 400%
    opacity: 0.6
    font-weight: lighter
    padding: 0 0.3em

+with-palette
  .strap-icon
    color: var(--#{$palette}-text)
    &.is-enclosed
      color: var(--#{$palette}-uiPrimary-text)
      background-color: var(--#{$palette}-uiPrimary-bgColor)
</style>
