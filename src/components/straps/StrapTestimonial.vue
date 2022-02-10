<template>
  <div class="strap-testimonial">
    <div class="strap-container pad-small">
      <div class='strap-content content'>
        <div class="columns is-gapless">
          <div class="column is-1 is-hidden-mobile .strap-testimonial__openIcon">
            <editable-icon @change="$strap_onComponentChange" keyName="iconOpen" :value="strap_state.iconOpen" />
          </div>
          <div class="column">
            <editable-quill @change="$strap_onComponentChange" keyName="quote" :value="strap_state.quote" class="strap-testimonial__quote" />
          </div>
          <div class="column is-1 is-hidden-mobile">
            <editable-icon @change="$strap_onComponentChange" keyName="iconClose" :value="strap_state.iconClose" />
          </div>
        </div>
        <div class="columns is-gapless">
          <div class="column is-8"></div>
          <div class="column">
            <editable-quill @change="$strap_onComponentChange" keyName="author" :value="strap_state.author" />
          </div>
          <div class="column is-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableIcon from '@/components/editable/EditableIcon'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultIcon from '@/store/defaults/components/icon'
import defaultQuill from '@/store/defaults/components/quill'

export default {
  name: 'StrapTestimonial',

  components: {
    EditableIcon,
    EditableQuill
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      iconOpen: defaultIcon({ name: 'icon-quote-filled-open', fontSize: 30 }),
      iconClose: defaultIcon({ name: 'icon-quote-filled-closed', fontSize: 30 }),
      quote: defaultQuill({ html: '<span class="ql-size-large">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus ornare elit, nec dapibus erat sollicitudin vitae. Nulla volutpat orci vitae dolor mattis, eget ornare diam sollicitudin.</span>' }),
      author: defaultQuill({ html: '— Laura Ipsum' })
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-testimonial

.strap-testimonial__icon
  margin-bottom: 2rem !important

.strap-testimonial__openIcon
  align:left

/deep/
  .strap-testimonial__quote
    margin-bottom: 2rem
    +mobile
      &, *
        font-size: $mobileTitleSize !important

</style>
