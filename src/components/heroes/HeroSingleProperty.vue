<template>
<div class="hero hero-single-property">
  <div class="strap-container container">
    <div class="box-overlay-container">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class='strap-content content'>
        <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
      </div>
      <div class="columns is-2 is-multiline is-mobile is-centered">
        <div class="column link-column is-3-desktop is-6-mobile is-6-tablet">
          <editable-icon @change="$strap_onComponentChange" keyName="icon1" :value="strap_state.icon1" />
        </div>
        <div class="column link-column is-3-desktop is-6-mobile is-6-tablet">
          <editable-icon @change="$strap_onComponentChange" keyName="icon2" :value="strap_state.icon2" />
        </div>
        <div class="column link-column is-3-desktop is-6-mobile is-6-tablet">
          <editable-icon @change="$strap_onComponentChange" keyName="icon3" :value="strap_state.icon3" />
        </div>
        <div class="column link-column is-3-desktop is-6-mobile is-6-tablet">
          <editable-icon @change="$strap_onComponentChange" keyName="icon4" :value="strap_state.icon4" />
        </div>
      </div>
      <div class="columns is-2 is-multiline is-mobile is-centered list-buttons" >
        <editable-button-list

          tag="div"
          listKey="buttonList"
          :list="strap_state.buttonList"
          :onCreate="$strap_onListCreate"
          :onChange="$strap_onListChange"
          :onDelete="$strap_onListDelete"
        />
      </div>
      <div class='strap-content content'>
        <editable-quill @change="$strap_onComponentChange" keyName="text2" :value="strap_state.text2" />
      </div>
      <div>
         <editable-button @change="$strap_onComponentChange" keyName="ctaButton" :value="strap_state.ctaButton"/>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import mixinStrap from '@/mixins/strap'
import EditableQuill from '@/components/editable/EditableQuill'
import defaultQuill from '@/store/defaults/components/quill'
import EditableTitle from '@/components/editable/EditableTitle'
import defaultTitle from '@/store/defaults/components/title'
import EditableButton from '@/components/editable/EditableButton'
import defaultButton from '@/store/defaults/components/button'
import EditableIcon from '@/components/editable/EditableIcon'
import defaultIcon from '@/store/defaults/components/icon'
import EditableButtonList from '@/components/editable/EditableButtonList'

export default {
  name: 'HeroSingleProperty',

  components: {
    EditableTitle,
    EditableQuill,
    EditableButton,
    EditableIcon,
    EditableButtonList,
    EditableButton
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Hero ' }),
      text: defaultQuill(),
      buttonList: [defaultButton()],
      icon1: defaultIcon({ name: 'icon-bed', label: '3 beds', style: 'enclosed', fontSize: 28 }),
      icon2: defaultIcon({ name: 'icon-bathtub', label: '2 baths',  style: 'enclosed', fontSize: 28 }),
      icon3: defaultIcon({ name: 'icon-home4', label: '2400 sqft', style: 'enclosed', fontSize: 28 }),
      icon4: defaultIcon({ name: 'icon-home4', label: '2 car garage', style: 'enclosed', fontSize: 28 }),
      text2: defaultQuill(),
      buttonList: [defaultButton()],
      ctaButton: defaultButton({text: 'View listing'})
    }
  },

  methods: {

  }

}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'




.hero-single-property

.level
  justify-content: center

.level-item
  &.is-text
    font-size: 400%
    opacity: 0.6
    font-weight: lighter
    padding: 0 0.3em


.hero-single-property
  min-height: 300px
  max-width: 500px

.box-overlay-container
  margin-top: 35vh
  background-color: rgba(10, 10, 10, .4)
  margin-left: 5%
  height: auto!important






+mobile
  .box-overlay-container
    margin-top: 5vh
    margin-left: 2vw
    margin-right: 2vw
      height: auto!important

  .hero-single-property .strap-container
    width: 100%!important

  .strap-team-roster-strip .flickity-viewport
    height: auto
    touch-action: none

  .strap-container
    padding: 0!important
    margin: 0!important

  .strap-container.container
    padding: 0!important
    margin: 0!important





.hero-single-property .strap-buttons .strap-button
  float: left



</style>
