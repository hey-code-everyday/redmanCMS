<template>
  <!-- Straps -->
  <div class="app-page__straps">
    <app-auth />
  </div>
</template>

<script>
import AppAuth from '@/components/AppAuth'

export default {
  name: 'AppPageAdminLogin',

  metaInfo: {
    title: 'Page Builder Login'
  },

  components: {
    AppAuth
  }
}
</script>

<style scoped lang="sass">
</style>
