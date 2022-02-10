<template>
<div class="app-control control has-icons-right">
  <input
  class="input app-input"
  type="text"
  :placeholder="field.placeholder"
  :value="value"
  :tabIndex="tabIndex"
  ref="input"
  @blur="onChange($event.target.value)"
  @keyup="onChange($event.target.value)"
  @change="onChange($event.target.value)">
  <span class="icon is-small is-right" @click="openModal" title="Select or Upload an Image">
    <i class="icon-cloud"></i>
  </span>
</div>
</template>

<script>
import mixinField from '@/mixins/field'
import CustomModalImageUpload from '@/components/ui/modals/custom/CustomModalImageUpload'

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: String,
      required: true
    }
  },

  components: {
    CustomModalImageUpload
  },

  data () {
    return {
      debounce: null
    }
  },

  methods: {
    onChange (value) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.change((this.$refs.input && this.$refs.input.value) || value)
      }, 200)
    },

    openModal () {
      const updateValue = (event) => {
        let src = event.file.src[event.size]
        if (src.indexOf('https://s3.amazonaws.com/ddf-photos.redmantech.ca/') === 0) {
          src = src.replace('https://s3.amazonaws.com/ddf-photos.redmantech.ca/', '/_files/')
        }
        this.$refs.input.value = src
        this.change(src)
      }

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          updateValue
        },
        // template: 'Hello, world',
        component: CustomModalImageUpload,
        settings: {
          width: '800px',
          height: 'auto',
          padded: true
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.control
  .input
    border-radius: 0 !important

    &:focus
      .icon
        color: $wsIcon !important

        &:hover
          color: $wsTextLight !important

  &:first-child
    min-width: 72px

  &:last-child
    width: auto
    flex: 1

  .icon
    pointer-events: auto
    cursor: pointer
    color: $wsIcon !important
    opacity: 1 !important

    &:hover
      color: $wsTextLight !important
</style>
