<template>
<div class="app-control control">

  <div class="field is-grouped" v-for="(str, i) in value">
    <div class="app-control control">
      <input
      class="input app-input"
      type="text"
      :key="i"
      :placeholder="field.placeholder"
      :value="str"
      @blur="strChanged($event.target.value, i)"
      @keyup="strChanged($event.target.value, i)"
      @change="strChanged($event.target.value, i)">
    </div>
    <div class="control" v-if="canDelete">
      <span class="icon" @click="deleteStr(i)">
        <i class="icon-cross"></i>
      </span>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <button class="app-button button" @click="addStr">Add</button>
    </div>
  </div>

</div>
</template>

<script>
import mixinField from '@/mixins/field'

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      rnd: Math.random() + Date.now()
    }
  },

  methods: {
    strChanged (newStr, index) {
      const value = clone(this.$props.value)
      value[index] = newStr
      this.change(value)
    },

    deleteStr (index) {
      const value = clone(this.$props.value)
      value.splice(index, 1)
      this.change(value)
    },

    addStr () {
      const value = clone(this.$props.value)
      value.push('')
      this.change(value)
    }
  },

  computed: {
    canDelete () {
      return this.$props.value.length > 1
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.field.is-grouped
  .control
    &:first-child
      width: auto
      flex: 1

    &:last-child:not(:only-child)
      min-width: 24px
      max-width: 24px
      line-height: 36px
      font-size: 24px
      text-align: center

      .icon
        color: $wsIcon
        cursor: pointer
        transform: translateY(2px)

        &:hover
          color: $wsTextLight
</style>
