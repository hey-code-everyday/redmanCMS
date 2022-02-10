<template>
  <div class="touch-carousel-slide">
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
.touch-carousel-slide
  height: 100%
  margin: auto
  position: relative
  min-height: 100%
  align-self: center
  display: inline-block
</style>
