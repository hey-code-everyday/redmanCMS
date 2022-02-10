<template>
  <div class="small-touch-carousel-slide">
    <slot :$carousel="$carousel">Slide</slot>
  </div>
</template>

<script>
export default {
  inject: [ '$carousel' ],

  props: {
    src: {
      type: String
    }
  }
}
</script>

<style lang="sass" scoped>
.small-touch-carousel-slide
  height: 100%
  position: relative
  min-height: 100%
  align-self: center
  width: 100%
  max-width: auto
</style>
