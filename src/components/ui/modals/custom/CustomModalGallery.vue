<template>
  <div class="custom-modal-gallery" :style="{ backgroundColor: state.value.backgroundModalColor + ' !important' }">
    <div v-if="state.value.useSoldLabel" class="overlay has-sold-label" :style="{ backgroundImage: 'url(' + state.value.soldLabelURL + ')' }"></div>
    <img class="gallery-image" :src=" state.value.imageUrl " :alt=" state.value.title ">
    <div class="modal-text">
      <span class="title" :style="{ color: state.value.textModalColor && state.value.textModalColor + ' !important', textShadow }">{{ state.value.title }}</span> <br/>
      <span class="subtitle" :style="{ color: state.value.textModalColor && state.value.textModalColor + ' !important', textShadow }">{{ state.value.subtitle }}</span>  <br/>
      <div v-if="state.value.subtext" class="subtitle subtext" :style="{ color: state.value.textModalColor && state.value.textModalColor + ' !important', textShadow }"> {{ state.value.subtext }}
      </div>
    </div>
    <editable-quill class="desc" @change="updateDesc" keyName="desc" :value="state.value.desc" :style="{ color: settings.palette.text && settings.palette.text + ' !important' }"/>
    <br/>
    <div style="button-holder">
      <div class="button strap-button is-primary is-small" @click="$customModal_close">Close</div>
    </div>
  </div>
</template>

<script>

import mixinCustomModal from '@/mixins/custom-modal'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultQuill from '@/store/defaults/components/quill'


export default {
  name: 'ModalCustomGallery',

  mixins: [mixinCustomModal],

  components: {
    EditableQuill,
  },

  computed: {
    textShadow () {
      const data = this.state.value
      const useDropShadow = data.useDropShadow

      if (useDropShadow) {
        return data.textShadowX + "px " + data.textShadowY + "px " + data.textShadowBlur + "px " + data.textShadowColor;

      } else {
        return {}
      }
    }
  },
  methods: {
    updateDesc (payload) {
      const { keyName, onChange } = this.$props.state

      const value = JSON.parse(JSON.stringify(this.state.value.desc))
      value.html = payload.value.value

      onChange({
        keyName,
        value: {
          keyName: 'desc',
          value
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-gallery
  max-height: 700px

  .gallery-image
    width: 100%
    height: auto
    position: relative
    z-index: 1
    
  .has-sold-label
    background-position: left center
    background-repeat: no-repeat
    background-size: 100px auto
    height: 100px
    left: 0
    position: absolute
    top: 0
    width: 110px
    z-index: 2

  .modal-text
    margin: 1em 0 1em 0

  .subtext
      margin-bottom: 0!important

  .desc
    overflow: hidden

  .button-holder
    position: relative
    display: flex
    justify-content: flex-end

  .button
    margin-bottom: 2em;
    position: absolute
    right: 0

</style>
