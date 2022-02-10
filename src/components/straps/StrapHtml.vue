<template>
  <div class="strap-html">
    <editable-html @change="$strap_onComponentChange" keyName="html" :value="strap_state.html" />
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableHtml from '@/components/editable/EditableHtml'

import defaultHtml from '@/store/defaults/components/html'

export default {
  name: 'StrapHtml',

  components: {
    EditableHtml
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      html: defaultHtml()
    }
  }
}
</script>

<style scoped lang="sass">
.strap-html
</style>
