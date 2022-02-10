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
  margin: auto
  position: relative
  min-height: 100%
  align-self: center
  position: relative
  &::after
    position: absolute
    content: ''
    display: block
    width: 100%
    height: 100%
    border-left: solid 2px var(--default-bgColor)
    border-right: solid 2px var(--default-bgColor)
    top: 0
    left: 0
    pointer-events: none
</style>
