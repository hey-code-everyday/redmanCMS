<template>
  <div class="var--gus-checkbox gus-checkbox">
    <input type="checkbox" class="var--gus-checkbox__input" :name="name" :value="value" :id="id" :checked="checked" @change="onChange" />
    <label :title="label" :for="id" class="var--gus-checkbox__label">{{label}}</label>
  </div>
</template>

<script>
export default {
  name: 'gus-checkbox',

  props: [
    'name',
    'value',
    'label',
    'checked'
  ],

  computed: {
    id: function () {
      return `${this.name}-${this.value}`
    }
  },

  methods: {
    onChange: function (e) {
      if (e.target.checked) {
        this.$emit('check', this.value)
      } else {
        this.$emit('uncheck', this.value)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

+mobile
  .gus-checkbox
    line-height: 32px
    height: 32px
    font-size: 16px
    label:before
      margin-top: 8px
      margin-right: 5px
</style>
