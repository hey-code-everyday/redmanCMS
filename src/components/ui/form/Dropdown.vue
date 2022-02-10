<template>
  <div class="app-control control">
    <template v-if="loading">
      <div class="app-select select select__loading">
        Loading...
      </div>
    </template>
    <template v-else-if="error">
      Error loading options.
    </template>
    <template v-else>
      <div class="app-select select">
        <select
        @blur="change($event.target.value)"
        @change="change($event.target.value)">
          <option v-for="opt in options" :value="opt.value" :selected="opt.value === value">{{ opt.text }}</option>
        </select>
      </div>
    </template>
  </div>
</template>

<script>
import mixinField from '@/mixins/field'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: [String, Number, Boolean],
      required: true
    }
  },

  data () {
    return {
      loading: false,
      error: false,
      options: []
    }
  },

  mounted () {
    if (this.field.options.length) {
      this.$set(this.$data, 'options', this.field.options)
    } else {
      this.loading = true

      const promise = this.field.options.call(this)
      promise.then(response => {
        this.loading = false
        this.$set(this.$data, 'options', response)
      }).catch(e => {
        this.loading = false
        this.error = true
        console.warn(e)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.select.select__loading
  height: 36px
  line-height: 36px
  border: solid 1px rgba($wsTextLight, 0.6)
  cursor: default
  padding-left: 0.625em
</style>
