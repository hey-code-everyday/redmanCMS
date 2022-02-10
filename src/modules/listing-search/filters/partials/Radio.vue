<template>

<div class="gus-filter__radio var--gus-radio">
  <input type="radio" class="var--gus-radio__input" ref="radio" :name="name" :value="value" :id="id" @change="onChange" :checked="checked" />
  <label :for="id" class="var--gus-radio__label gus-radio__label">{{label}}</label>
</div>

</template>

<script>
export default {
  name: 'gus-radio',

  props: [
    'name',
    'value',
    'label',
    'currentValue'
  ],

  computed: {
    id () {
      return `${this.name}-${this.value}`
    },
    checked () {
      return (this.value === this.currentValue)
    }
  },

  methods: {
    onChange () {
      this.$emit('change', this.value)
    }
  }
}
</script>
