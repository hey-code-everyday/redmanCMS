<template>
  <div class="manage-files app-control control ws-ui">
    <file-upload
      mode="browse"
      class="file-upload"
      :token="$store.state.config.idToken"
      :spaceID="$store.state.config.spaceID"
      :allowed-types="[]"
    />
  </div>
</template>

<script>

export default {
  name: 'ManageFiles',

  props: {},

  components: {
    FileUpload: () => import('vue-file-upload')
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.manage-files
  height: 100%

.file-upload
  width: 300px
  +tablet
    width: 500px
  +desktop
    width: 800px
</style>
