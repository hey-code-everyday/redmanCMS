<template>
  <div class="custom-modal-team-roster" :style="{ backgroundColor: state.value.backgroundModalColor + ' !important' }">

    <div class="agent-image" :style="{ backgroundImage: 'url(' + state.value.imageUrl + ')' }"></div>
    <div class="modal-text">
      <span class="title" :style="{ color: state.value.textModalColor && state.value.textModalColor + ' !important', textShadow }">{{ state.value.title }}</span> <br/>
      <span class="subtitle" :style="{ color: state.value.textModalColor && state.value.textModalColor + ' !important', textShadow }">{{ state.value.subtitle }}</span>  <br/>
      <div v-if="state.value.subtext" class="subtitle subtext" :style="{ color: state.value.textModalColor && state.value.textModalColor + ' !important', textShadow }"> {{ state.value.subtext }}
      </div>
      <div v-if="state.value.subtextImage" class="subtextImage" :style="{ backgroundImage: 'url(' + state.value.subtextImage + ')' }"></div>
    </div>
    <editable-quill class="bio" @change="updateBio" keyName="bio" :value="state.value.bio" :style="{ color: settings.palette.text && settings.palette.text + ' !important' }"/>
    <br/>
    <div stlye="button-holder">
      <div class="button strap-button is-primary is-small" @click="$customModal_close">Close</div>
    </div>
  </div>
</template>

<script>

import mixinCustomModal from '@/mixins/custom-modal'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultQuill from '@/store/defaults/components/quill'


export default {
  name: 'ModalCustomTeamRoster',

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
    updateBio (payload) {
      const { keyName, onChange } = this.$props.state

      const value = JSON.parse(JSON.stringify(this.state.value.bio))
      value.html = payload.value.value

      onChange({
        keyName,
        value: {
          keyName: 'bio',
          value
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../../assets/sass/variables'

.custom-modal-team-roster
  max-height: 700px

  .agent-image
    width: 100%
    height: 450px
    background-repeat: no-repeat
    background-position: center top
    background-size: cover
    position: relative

  .modal-text
    margin: 1em 0 1em 0

  .subtext
      margin-bottom: 0!important

  .subtextImage
    height: 30px
    background-repeat: no-repeat
    background-position: left bottom
    background-size: contain

  .bio
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
