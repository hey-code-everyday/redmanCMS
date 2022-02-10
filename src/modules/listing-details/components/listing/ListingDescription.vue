<template>
  <div class="listing-description listing-container content">
    <p ref="desc" class="ld-text" :style="descStyle">
      <template v-if="expanded">
        {{ description }}
      </template>
      <template v-else>
        {{ shortDescription }}
      </template>
    </p>
    <p v-if="expanding" class="is-expanded" ref="longDesc" :style="{ width: width + 'px' }">
      {{ description }}
    </p>
    <p v-if="contracting" class="is-expanded" ref="shortDesc" :style="{ width: width + 'px' }">
      {{ shortDescription }}
    </p>
    <p v-if="!isShort" class="read-more">
      <a class="var--gus-link" @click="toggleExpanded">
        <span v-if="expanded">Show Less</span>
        <span v-else>Read More</span>
        <i class="icon-chevron-down var--gus-icon"
        :style="{ transform: `rotate(${expanded ? 180 : 0}deg)` }"></i>
      </a>
    </p>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'ListingDescription',

  props: {
    listing: { type: Object, required: true }
  },

  data () {
    return {
      expanded: false,
      expanding: false,
      contracting: false,
      width: 0,
      height: 0
    }
  },

  methods: {
    expand () {
      if (this.expanded || this.expanding) return

      // Phase 0
      const { desc } = this.$refs

      let width = desc.getBoundingClientRect().width
      let height = desc.getBoundingClientRect().height

      this.width = width
      this.height = height
      this.expanding = true

      // Phase 1
      Vue.nextTick(() => {
        const { longDesc } = this.$refs
        let height = longDesc.getBoundingClientRect().height
        this.height = height

        this.expanded = true

        // Phase 2
        setTimeout(() => {
          Vue.nextTick(() => {
            this.expanding = false
          })
        }, 350)
      })
    },

    contract () {
      if (!this.expanded || this.contracting) return

      // Phase 0
      const { desc } = this.$refs

      let width = desc.getBoundingClientRect().width
      let height = desc.getBoundingClientRect().height

      this.width = width
      this.height = height
      this.contracting = true

      // Phase 1
      Vue.nextTick(() => {
        const { shortDesc } = this.$refs
        let height = shortDesc.getBoundingClientRect().height
        this.height = height

        // Phase 2
        setTimeout(() => {
          Vue.nextTick(() => {
            this.contracting = false
            this.expanded = false
          })
        }, 350)
      })
    },

    toggleExpanded (e) {
      e.preventDefault()

      if (this.expanded) {
        this.contract()
      } else {
        this.expand()
      }
    }
  },

  computed: {
    descLimit () {
      return 512
    },

    descStyle () {
      const style = {}

      if (this.expanding || this.contracting) {
        style.height = this.height + 'px'
        style.overflow = 'hidden'
      }

      return style
    },

    shortDescription () {
      const { description } = this.listing

      const limit = this.descLimit
      const end = description.length > limit ? '...' : ''

      return description.slice(0, limit) + end
    },

    description () {
      return this.listing.description
    },

    isShort () {
      const { description } = this.listing
      const limit = this.descLimit

      return description.length <= limit
    },

    mobile () {
      return window.innerWidth < 1024
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-description
  position: relative
  p
    line-height: 1.7
    &.is-expanded
      top: 0
      left: 0
      position: absolute
      pointer-events: none
      visibility: hidden
  +mobile
    font-size: 16px

.ld-text
  transition: height 350ms ease-in-out
.read-more
  a
    text-decoration: none
  span
    text-decoration: underline
  i
    display: inline-flex
    font-size: 14px
    margin-left: 4px
    transition: transform 150ms ease-in-out

</style>
