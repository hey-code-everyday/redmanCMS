<template>
  <div class="strap-form">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class='strap-content content'>
        <editable-redform @change="$strap_onComponentChange" keyName="redform" :value="strap_state.redform" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import Color from 'color'
import mixinStrap from '@/mixins/strap'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableRedform from '@/components/editable/EditableRedform'

import defaultTitle from '@/store/defaults/components/title'
import defaultRedform from '@/store/defaults/components/redform'

export default {
  name: 'StrapForm',

  components: {
    EditableTitle,
    EditableRedform
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Strap Form' }),
      redform: defaultRedform({ formID: 'stock/contact-agent' })
    }
  }
}
</script>

<style scoped lang="sass">
.strap-form

.strap-content
  width: 100%
  max-width: 768px

.is-aligned-centered
  .strap-content
    margin: 0 auto

.is-aligned-right
  .strap-content
    display: flex
    justify-content: flex-end
    margin-left: auto
</style>
