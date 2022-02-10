<template>
<div class="custom-modal-vow-facts">
  <h2 class="title is-5">{{ state.label }}</h2>
  <ul class="vow-facts">
    <li v-for="(fact, i) in state.facts">
      <label class="label is-label">{{ fact.key }}</label>
      <span class="value">
        <span>{{ fact.value }}</span>
      </span>
    </li>
  </ul>
</div>
</template>

<script>
import mixinCustomModal from '@/mixins/custom-modal'

export default {
  name: 'ModalCustomVowFacts',

  mixins: [mixinCustomModal]
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-vow-facts

.vow-facts
  li
    position: relative
    display: flex
    min-height: 34px
    line-height: 34px
    font-size: 0.9em
    padding: 5px 0
    min-width: 320px
    &:after
      content: ''
      display: block
      position: absolute
      width: 100%
      height: 1px
      bottom: -1px
      left: 0
      box-shadow: 0 0 100px inset
      opacity: 0.2
    &:last-child
      &:after
        display: none
  .value,
  .label
    display: block
    width: 50%
  .label
    font-size: inherit
    font-weight: inherit
    margin-bottom: 0
    color: inherit
  .value
    display: flex
    align-items: center
    span
      display: inline-block
      line-height: 1.5
</style>
