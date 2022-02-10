<template>
  <!-- Straps -->
  <div class="app-page__straps">
    <!-- Error strap -->
    <template v-if="$store.getters.hasPageError">
      <app-strap :strap="$store.getters.errorStrap" key="error" />
    </template>

    <!-- Empty strap -->
    <template v-else-if="$store.state.page.straps.length === 0">
      <app-strap :strap="$store.getters.emptyStrap" key="empty" />
    </template>

    <!-- Straps -->
    <template v-for="(strap, i) in $store.getters.straps" v-else >
      <app-strap
        :key="strap.id"
        :strap="strap"
        :style="{ zIndex: 9999 - i }"
      />
    </template>
  </div>
</template>

<script>
import AppStrap from '@/components/AppStrap'

export default {
  name: 'AppPage',

  components: {
    AppStrap
  }
}
</script>

<style scoped lang="sass">
.app-page__straps
  position: relative
  z-index: 1
</style>
