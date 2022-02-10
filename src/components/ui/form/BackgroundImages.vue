<template>
<div class="app-control control">

  <div class="field is-grouped" v-for="(url, i) in value.imageUrls">
    <div class="app-control control has-icons-right">
      <input
      class="input app-input"
      type="text"
      ref="input"
      :key="i"
      :placeholder="field.placeholder"
      :value="url"
      @blur="urlChanged($event.target.value, i)"
      @keyup="urlChanged($event.target.value, i)"
      @change="urlChanged($event.target.value, i)">
      <span class="icon is-small is-right" @click="openModal(i)" title="Select or Upload an Image">
        <i class="icon-cloud"></i>
      </span>
    </div>
    <div class="control" v-if="canDeleteImage">
      <span class="icon" @click="deleteImage(i)">
        <i class="icon-cross"></i>
      </span>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <button class="app-button button" @click="addImage">Add Image</button>
    </div>
  </div>

  <div class="field">
    <label class="app-checkbox checkbox">
      <input
      type="checkbox"
      :id="id('repeat')"
      :checked="value.repeat"
      @change="boolChanged($event.target, 'repeat')">
      <label :for="id('repeat')"></label>
      Repeat images as a pattern
    </label>
  </div>

  <div class="field">
    <label class="app-checkbox checkbox">
      <input
      type="checkbox"
      :id="id('greyscale')"
      :checked="value.greyscale"
      @change="boolChanged($event.target, 'greyscale')">
      <label :for="id('greyscale')"></label>
      Make images greyscale
    </label>
  </div>

  <div class="field">
    <label class="app-checkbox checkbox">
      <input
      type="checkbox"
      :id="id('parallax')"
      :checked="value.parallax"
      @change="boolChanged($event.target, 'parallax')">
      <label :for="id('parallax')"></label>
      Make image use parallax effect [Single Image Only]
    </label>
  </div>

  <div class="field">
    <label class="app-checkbox checkbox">
      <input
      type="checkbox"
      :id="id('kenburns')"
      :checked="value.kenburns"
      @change="boolChanged($event.target, 'kenburns')">
      <label :for="id('kenburns')"></label>
      Make image use kenburns effect [Single Image Only]
    </label>
  </div>

</div>
</template>

<script>
import mixinField from '@/mixins/field'
import CustomModalImageUpload from '@/components/ui/modals/custom/CustomModalImageUpload'

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

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
      rnd: Math.random() + Date.now()
    }
  },

  methods: {
    id (key) {
      const rnd = this.$data.rnd
      return `chk_${key}_${rnd}`
    },

    urlChanged (newUrl, index) {
      if (newUrl.indexOf('https://s3.amazonaws.com/ddf-photos.redmantech.ca/') === 0) {
        newUrl = newUrl.replace('https://s3.amazonaws.com/ddf-photos.redmantech.ca/', '/_files/')
      }
      const value = clone(this.$props.value)
      value.imageUrls[index] = newUrl
      this.change(value)
    },

    boolChanged (target, key) {
      const value = clone(this.$props.value)
      value[key] = target.checked
      this.change(value)
    },

    deleteImage (index) {
      const value = clone(this.$props.value)
      value.imageUrls.splice(index, 1)
      this.change(value)
    },

    addImage () {
      const value = clone(this.$props.value)
      value.imageUrls.push('')
      this.change(value)
    },

    openModal (i) {
      const updateValue = (event) => {
        const src = event.file.src[event.size]
        this.$refs.input[i].value = src
        this.urlChanged(src, i)
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
  },

  computed: {
    canDeleteImage () {
      return this.$props.value.imageUrls.length > 1
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
  input + .icon
    pointer-events: auto
    cursor: pointer
    color: $wsIcon !important
    opacity: 1 !important
    &:hover
      color: $wsTextLight !important
</style>
