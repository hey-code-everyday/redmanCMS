<template>
  <div class="strap-quote-slider">
    <flickity-slider ref="flickity" :options="sliderOptions">
      <div v-for="(slide, i) in strap_state.slides" :key="i" class="flickity-slide strap-content content pad-medium">
        <p class="strap-quote__icon">
          <editable-icon
            keyName="icon"
            :value="slide.icon"
            @change="e => { $strapSlider_onSlideChange('slides', i, e) }"
          />
        </p>
        <editable-quill
          keyName="quote"
          :value="slide.quote"
          @change="e => { $strapSlider_onSlideChange('slides', i, e) }"
          class="strap-quote__quote"
        />
        <p class="author">
          <editable-text
            keyName="author"
            :value="slide.author"
            @change="e => { $strapSlider_onSlideChange('slides', i, e) }"
          />
        </p>
      </div>
    </flickity-slider>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import mixinStrapSlider from '@/mixins/strap-slider'
import FlickitySlider from '@/components/FlickitySlider'

import EditableIcon from '@/components/editable/EditableIcon'
import EditableText from '@/components/editable/EditableText'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultIcon from '@/store/defaults/components/icon'
import defaultText from '@/store/defaults/components/text'
import defaultQuill from '@/store/defaults/components/quill'
import defaultSlider from '@/store/defaults/components/slider'

import sliderSchema from '@/constants/schemas/slider-config'

function defaultSlide () {
  return {
    icon: defaultIcon({ name: 'icon-quote-filled-closed', fontSize: 48 }),
    quote: defaultQuill({ html: '<span class="ql-size-large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus ornare elit, nec dapibus erat sollicitudin vitae. Nulla volutpat orci vitae dolor mattis, eget ornare diam sollicitudin.</span>' }),
    author: defaultText({ text: '— Laura Ipsum' })
  }
}

export default {
  name: 'StrapQuoteSlider',

  components: {
    FlickitySlider,
    EditableIcon,
    EditableText,
    EditableQuill
  },

  mixins: [mixinStrap, mixinStrapSlider],

  computed: {
    sliderOptions () {
      return {
        ...this.strap_state.sliderOptions,
        draggable: !this.$store.getters.canEdit
      }
    }
  },

  data () {
    return {
      slider: {
        numSlidesKey: 'numSlides',
        slidesKey: 'slides',
        defaultSlide () {
          return defaultSlide()
        }
      }
    }
  },

  initialState (strap, state) {
    return {
      numSlides: 1,
      slides: [defaultSlide()],
      sliderOptions: defaultSlider()
    }
  },

  schema () {
    return sliderSchema()
  }
}
</script>

<style scoped lang="sass">
.strap-quote-slider
  position: relative

.author
  margin-top: 0.4rem
</style>
