<template>
  <div class="strap-empty">
    <div class="strap-container container pad-medium">
      <StrapMessageBox title="Empty Page" icon="icon-hammer-wrench">
        This page doesn't have any straps. <template v-if="$store.getters.canEdit">Why don't you try adding one?</template>
        <client-only slot="footer">
          <template v-if="$store.getters.canEdit">
            <add-strap-field @change="addStrap" />
          </template>
        </client-only>
      </StrapMessageBox>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import StrapMessageBox from '@/components/StrapMessageBox'
import createStrap from '@/store/defaults/strap'
import AddStrapField from '@/components/ui/AddStrapField'
import ClientOnly from '@/components/ClientOnly'

export default {
  name: 'StrapEmpty',

  mixins: [mixinStrap],

  components: {
    AddStrapField,
    ClientOnly,
    StrapMessageBox
  },

  methods: {
    addStrap (strapName) {
      const palette = this.$store.getters.palette(this.strap_style.theme)
      const newStrap = createStrap(false, false, false, palette.uiPrimary.bgColor, palette.uiSecondary.bgColor)
      newStrap.name = strapName
      this.$store.dispatch('newStrap', newStrap)
    }
  }
}
</script>

<style scoped lang="sass">
.strap-empty
  background-color: #fafafa
  background-image: url('../../assets/images/geometry2.png')

.add-strap-field
  width: 85%
  margin: 0 auto

  .control
    &:first-child
      flex: 1

      select,
      .select
        width: 100%
</style>
