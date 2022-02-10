<template>
  <div>
    <agent-selector />
  </div>
</template>

<script>

export default {
  name: 'ManageRoster',

  components: {
    AgentSelector: () => import('@/components/AgentSelector')
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'


</style>
