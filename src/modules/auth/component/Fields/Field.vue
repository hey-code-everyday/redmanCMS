<template>
  <div class="auth__field" :style="(isValid === false) ? availableStyles.primary : {}">

    <label
      class="auth__label"
      :for="id">
      {{label}}
    </label>

    <div class="control">
      <component
        is="input"
        :type="type"
        class="auth__input"
        :name="id"
        :id="id"
        @change="onChange"
        @keyup="onChange"
        @blur="onBlur"
        v-model="value" />
    </div>

    <p v-if="isValid === false" class="auth__validation-msg" :style="availableStyles.bgPrimary">{{errorMessage}}</p>
    <slot></slot>

  </div>
</template>

<script>

export default {
  name: 'field',

  props: ['id', 'availableStyles'],

  data: function () {
    return {
      value: '',
      beginValidating: false,
      isValid: null
    }
  },

  methods: {
    onBlur: function (e) {
      this.beginValidating = true
      this.onChange(e)
    },

    onChange: function (e) {
      const newValue = e.target.value
      const valid = (typeof this.validate === 'function')
        ? this.validate(newValue)
        : null

      if (this.beginValidating) {
        this.isValid = valid
      }

      this.$emit('change', newValue, valid)
    }
  }
}

</script>
