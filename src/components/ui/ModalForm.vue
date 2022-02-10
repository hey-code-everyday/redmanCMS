<template>
  <div class="modal-form">
    <template v-if="modal.curTab.component">
      <component :is="modal.curTab.component" :props="modal.curTab.props" />
    </template>

    <template v-else v-for="(field, i) in modal.curTab.fields">
      <dynamic-field :key="`${field.key}--${i}`" :field="field" :state="state" :formUpdated="formUpdated" :index="i" />
    </template>
  </div>
</template>

<script>
import EditJson from './form/EditJson'
import Migration from './form/Migration'
import ManageFiles from './form/ManageFiles'
import ManageRoster from './form/ManageRoster'
import DynamicField from './DynamicField'
import ImportExport from './form/ImportExport'
import ColorEditor from './form/ColorEditor'
import NavigationEditor from './form/NavigationEditor'

export default {
  props: {
    state: {
      type: Object,
      required: true
    },

    modal: {
      type: Object,
      required: true
    },

    formUpdated: {
      type: Function,
      required: true
    }
  },

  components: {
    EditJson,
    Migration,
    ManageFiles,
    ManageRoster,
    DynamicField,
    ImportExport,
    ColorEditor,
    NavigationEditor
  }
}
</script>

<style lang="sass" scoped>

</style>
