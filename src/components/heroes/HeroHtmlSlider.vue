<template>
  <div class="hero hero-html-slider">
    <flickity-slider ref="flickity" :options="strap_state.sliderOptions">
      <div v-for="(slide, i) in strap_state.slides" :key="i" class="flickity-slide">
        <editable-html
          :keyName="i"
          :value="slide"
          class="editable-html"
          @change="e => { $strap_onListChange('slides', e) }"
        />
      </div>
    </flickity-slider>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import mixinStrapSlider from '@/mixins/strap-slider'
import FlickitySlider from '@/components/FlickitySlider'
import EditableHtml from '@/components/editable/EditableHtml'
import defaultHtml from '@/store/defaults/components/quill'
import defaultSlider from '@/store/defaults/components/slider'
import sliderSchema from '@/constants/schemas/slider-config'

export default {
  name: 'HeroHtmlSlider',

  components: {
    FlickitySlider,
    EditableHtml
  },

  mixins: [mixinStrap, mixinStrapSlider],

  data () {
    return {
      slider: {
        numSlidesKey: 'numSlides',
        slidesKey: 'slides',
        defaultSlide () {
          return defaultHtml()
        }
      }
    }
  },

  initialState (strap, state) {
    return {
      numSlides: 1,
      slides: [defaultHtml()],
      sliderOptions: defaultSlider()
    }
  },

  schema () {
    return sliderSchema()
  }
}
</script>

<style scoped lang="sass">
.hero-html-slider
  position: relative

.editable-html
  position: relative
  width: 100%
  height: 100%
</style>
