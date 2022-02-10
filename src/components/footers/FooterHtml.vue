<template>
  <div class="footer-html">
    <editable-html @change="$footer_onComponentChange" keyName="html" :value="footer_state.html" />
  </div>
</template>

<script>
import mixinFooter from '@/mixins/footer'

import EditableHtml from '@/components/editable/EditableHtml'
import defaultHtml from '@/store/defaults/components/html'

export default {
  name: 'FooterHtml',

  components: {
    EditableHtml
  },

  mixins: [mixinFooter],

  initialState (strap, state) {
    return {
      html: defaultHtml()
    }
  }
}
</script>

<style scoped lang="sass">
.footer-html
</style>
