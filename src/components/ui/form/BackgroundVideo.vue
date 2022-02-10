<template>
<div class="app-control control">
  <div class="field is-grouped">
    <div class="app-control control">
      <input
      ref="mp4"
      class="input app-input"
      type="text"
      placeholder="*.mp4"
      :value="value.mp4Url"
      v-once
      @blur="onBlur"
      @keyup="onChange"
      @change="onChange">
    </div>
    <div class="control">
      MP4
    </div>
  </div>

  <div class="field is-grouped">
    <div class="app-control control">
      <input
      ref="webm"
      class="input app-input"
      type="text"
      placeholder="*.webm"
      :value="value.webmUrl"
      v-once
      @blur="onBlur"
      @keyup="onChange"
      @change="onChange">
    </div>
    <div class="control">
      WebM
    </div>
  </div>

  <div class="field is-grouped">
    <div class="app-control control">
      <input
      ref="ogg"
      class="input app-input"
      type="text"
      placeholder="*.ogg"
      :value="value.oggUrl"
      v-once
      @blur="onBlur"
      @keyup="onChange"
      @change="onChange">
    </div>
    <div class="control">
      OGG
    </div>
  </div>

</div>
</template>

<script>
import Vue from 'vue'
import mixinField from '@/mixins/field'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      debounce: null
    }
  },

  methods: {
    id (key) {
      const rnd = this.$data.rnd
      return `chk_${key}_${rnd}`
    },

    urlChanged () {
      const { mp4, webm, ogg } = this.$refs
      if (!mp4 || !webm || !ogg) return

      const value = {
        mp4Url: mp4.value,
        webmUrl: webm.value,
        oggUrl: ogg.value
      }

      this.change(value)
    },

    onBlur () {
      this.urlChanged()
    },

    onChange () {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.urlChanged()
      }, 200)
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
      min-width: 50px
      line-height: 36px
      color: $wsTextLight
</style>
