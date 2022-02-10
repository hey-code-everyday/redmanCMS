<template>
  <div class="modal-estimate modal-box">
    <div class="modal-box__content">
      <div class="modal-box__content-inner">
        <editable-title
          @change="$strap_onComponentChange"
          :value="strap.state.estimateModalTitle"
          keyName="estimateModalTitle"
        />
        <redform
          size="small"
          :formID="formID"
          :spaceID="$store.state.config.spaceID"
          :messagePlaceholder="address!== '' ? `I would like to get a free evaluation ${address}. Thank you.` : ''"
          :subject="`Free Home Evaluation ${address}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppModal from '@/components/ui/AppModal'
import Redform from '@/components/Redform'
import defaultRedform from '@/store/defaults/components/redform'
import EditableTitle from '@/components/editable/EditableTitle'
import mixinStrap from '@/mixins/strap'

export default {
  name: 'ModalEstimate',
  components: {
    AppModal,
    Redform,
    EditableTitle
  },
  mixins: [mixinStrap],
  computed: {
    formID () {
      const { formID } = defaultRedform({ formID: 'stock/contact-agent' })
      return formID
    },
    address () {
      return this.$store.state.ui.estimateAddress
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.modal-estimate
  width: 800px
  height: 800px

  +mobile
    width: 100%
    height: 100%
</style>
