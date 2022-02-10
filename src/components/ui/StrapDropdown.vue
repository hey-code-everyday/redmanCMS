<template>
  <select class="strap-selector" @change="$emit('change', $refs.select.value)" ref="select">
    <option value="" disabled selected>— Select a Strap —</option>
    <optgroup label="Utility">
      <option :value="key" :key="key" v-for="(strap, key) in straps.utility">{{ strap.name }}</option>
    </optgroup>
    <optgroup label="Original">
      <option :value="key" :key="key" v-for="(strap, key) in straps.original">{{ strap.name }}</option>
    </optgroup>
  </select>
</template>

<script>
import straps from '@/components/straps/straps'

export default {
  computed: {
    straps () {
      return {
        utility: this.reduceStraps('utility'),
        original: this.reduceStraps('original')
      }
    }
  },

  methods: {
    reduceStraps (set) {
      const keys = Object.keys(straps)
      return keys.filter(k => {
        const s = straps[k]
        return !s.hidden && !s.hero && s.set === set
      }).reduce((obj, key) => {
        obj[key] = straps[key]
        return obj
      }, {})
    }
  }
}
</script>

<style lang="sass" scoped>
.strap-selector
  color: black

</style>
