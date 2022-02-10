<template>
  <div class="strap-quote">
    <div class="strap-container container pad-medium">
      <div class='strap-content content'>
        <p class="strap-quote__icon">
          <editable-icon @change="$strap_onComponentChange" keyName="icon" :value="strap_state.icon" />
        </p>
        <editable-quill @change="$strap_onComponentChange" keyName="quote" :value="strap_state.quote" class="strap-quote__quote" />
        <p>
          <editable-text @change="$strap_onComponentChange" keyName="author" :value="strap_state.author" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableIcon from '@/components/editable/EditableIcon'
import EditableText from '@/components/editable/EditableText'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultIcon from '@/store/defaults/components/icon'
import defaultText from '@/store/defaults/components/text'
import defaultQuill from '@/store/defaults/components/quill'

export default {
  name: 'Strap',

  components: {
    EditableIcon,
    EditableText,
    EditableQuill
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      icon: defaultIcon({ name: 'icon-quote-filled-closed', fontSize: 48 }),
      quote: defaultQuill({ html: '<span class="ql-size-large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus ornare elit, nec dapibus erat sollicitudin vitae. Nulla volutpat orci vitae dolor mattis, eget ornare diam sollicitudin.</span>' }),
      author: defaultText({ text: '— Laura Ipsum' })
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-quote__icon
  margin-bottom: 2rem !important

.strap-quote__quote
  font-size: 200% !important
  margin-bottom: 2rem

/deep/
  .strap-quote__quote
    margin-bottom: 2rem
    +mobile
      &, *
        font-size: $mobileTitleSize !important

</style>
