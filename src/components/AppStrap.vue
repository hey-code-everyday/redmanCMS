<template>
  <section
    :id="`strap-${strap.id}`"
    :class="[ 'app-strap', (strap.id === 'hero' ? 'app-hero' : ''), 'strap', `var--app-${strap.config.style.theme}`, ($store.state.editing ? 'is-editing-strap' : false) ]"
    v-if="$store.state.editing || !strap.config.hidden"
  >
    <!-- Settings -->
    <client-only>
      <StrapToolbar
        :strap="strap"
        v-if="$store.getters.canEdit && (strap.id !== 'error' && strap.id !== 'empty')"
        class="strap-toolbar"
      />
    </client-only>

    <!-- Strap structure -->
    <div :class="[ 'strap-outer', ...strap.config.outerClasses, `is-aligned-${strap.config.style.textAlign}` ]" v-if="!strap.config.hidden">
      <!-- Background images/video -->
      <strap-images-overlay v-if="hasBgImages" :strap="strap" />
      <strap-image-overlay v-else-if="hasBgImage" :strap="strap" />
      <strap-video-overlay v-if="hasBgVideo" :strap="strap" class="is-hidden-touch" />

      <!-- Background overlay -->
      <strap-color-overlay :strap="strap" />

      <!-- Strap contents -->
      <div :class="[ 'strap-inner', ...strap.config.innerClasses ]">
        <component
          :is="strap.name"
          :strap="strap"
          @migrate="migrate"
        />
      </div>
    </div>

    <!-- Empty placeholder -->
    <div class="strap-placeholder" v-else>
      <StrapMessageBox title="Hidden Strap" class="strap-placeholder__message-box">
        This strap is hidden to visitors. Enable it in the settings or below.
        <template slot="footer" v-if="$store.getters.canEdit">
          <span class="button is-primary" @click="showStrap">
            <span>Make it visible</span>
          </span>
        </template>
      </StrapMessageBox>
    </div>

    <!-- Rule -->
    <hr v-if="strap.config.style.rule" />
  </section>
</template>

<script>
import deepmerge from 'deepmerge'

import ClientOnly from '@/components/ClientOnly'
import StrapToolbar from './StrapToolbar'
import StrapMessageBox from '@/components/StrapMessageBox'
import StrapColorOverlay from '@/components/StrapColorOverlay'
import StrapVideoOverlay from '@/components/StrapVideoOverlay'
import StrapImageOverlay from '@/components/StrapImageOverlay'
import StrapImagesOverlay from '@/components/StrapImagesOverlay'
import heroes from './heroes'
import straps from './straps'

const components = {
  ...heroes,
  ...straps
}

export default {
  name: 'AppStrap',

  components: {
    ...components,
    ClientOnly,
    StrapToolbar,
    StrapMessageBox,
    StrapColorOverlay,
    StrapVideoOverlay,
    StrapImageOverlay,
    StrapImagesOverlay
  },

  props: {
    strap: {
      type: Object,
      required: true
    }
  },

  computed: {
    hasBgVideo () {
      const bgVideo = this.strap.config.style.bgVideo
      return bgVideo.mp4Url || bgVideo.webmUrl || bgVideo.oggUrl
    },

    hasBgImages () {
      const bgImage = this.strap.config.style.bgImage
      return bgImage.imageUrls.length > 1
    },

    hasBgImage () {
      const bgImage = this.strap.config.style.bgImage
      return bgImage.imageUrls.length === 1
    }
  },

  methods: {
    showStrap () {
      const strap = this.$props.strap
      strap.config.hidden = false

      this.$store.dispatch('setStrap', strap)
    },

    migrate (migrations) {
      let strap = this.$props.strap

      if (migrations) {
        if (!strap.state.migrations) strap.state.migrations = {}

        migrations().forEach((m, i) => {
          if (!strap.state.migrations[i]) {
            strap.state.migrations[i] = true
            strap.state = deepmerge(strap.state, m)
          }
        })

        this.$store.commit('SET_STRAP', strap)
      }
    }
  },

  mounted () {
    this.$store.dispatch('triggerCustomEvent', {
      eventName: 'strap-mount',
      data: {
        name: this.strap.name,
        strap: this.strap,
        component: this
      }
    })
    this.$store.dispatch('triggerCustomEvent', {
      eventName: this.strap.name + '-mount',
      data: {
        strap: this.strap,
        component: this
      }
    })
    this.$store.dispatch('triggerCustomEvent', {
      eventName: this.strap.id + '-mount',
      data: {
        strap: this.strap,
        component: this
      }
    })
  },

  updated () {
    this.$store.dispatch('triggerCustomEvent', {
      eventName: 'strap-update',
      data: {
        name: this.strap.name,
        strap: this.strap,
        component: this
      }
    })
    this.$store.dispatch('triggerCustomEvent', {
      eventName: this.strap.name + '-update',
      data: {
        strap: this.strap,
        component: this
      }
    })
    this.$store.dispatch('triggerCustomEvent', {
      eventName: this.strap.id + '-update',
      data: {
        strap: this.strap,
        component: this
      }
    })
  }
}
</script>

<style lang="sass">
.strap-toolbar
  opacity: 0
  pointer-events: none
  transform: translateX(-10%)
  transition: all 150ms ease-in-out

.app-strap
  &.is-editing-strap
    // min-height: calc(208px + 40px)
    min-height: 2em

  &:hover
    .strap-toolbar
      pointer-events: auto
      opacity: 1
      transform: translateX(0)

.strap-placeholder
  background-color: transparent
  padding: 40px
  text-align: center

  em
    font-style: italic

.strap-placeholder__message-box
  position: relative
  z-index: 1
</style>
