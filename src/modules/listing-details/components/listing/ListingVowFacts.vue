<template>
  <div class="listing-vow-facts listing-container content">
    <h2 class="title is-5 is-title">Exclusive Details</h2>

    <ul class="vow-facts">
      <li
        @click="vow.facts.length > 1  && viewVowFacts(i)"
        :class="vow.facts.length > 1 && 'has-details'"
        v-for="(vow, i) in allVow"
        v-if="vow.facts.length"
      >
        <a v-if="vow.facts.length > 1"></a>
        <div class="vow-left">
          {{ vow.label }}
        </div>
        <div class="vow-right" v-if="vow.facts.length > 1">
          <small class="is-label">
            <a class="is-hidden-touch">
              <span>{{ vow.facts.length }} {{ pluralize('detail', vow.facts.length) }}</span>
              <span>view all</span>
            </a>
            <a class="is-hidden-desktop">
              view {{ vow.facts.length }} {{ pluralize('detail', vow.facts.length) }}
            </a>
          </small>
        </div>
        <div class="vow-right" v-else>
          <small class="is-label">
            <span>
              {{ vow.facts[0].value }}
            </span>
          </small>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import pluralize from 'pluralize'
import CustomModalVowFacts from '@/components/ui/modals/custom/CustomModalVowFacts'

export default {
  name: 'ListingVowFacts',

  props: {
    listing: { type: Object, required: true }
  },

  computed: {
    mobile () {
      return this.$store.getters.isMobile
    },

    vowRooms () {
      const facts = this.listing.vow_facts
      if (!facts) return false

      const result = []

      if (facts.rooms) {
        Object.keys(facts.rooms).forEach(key => {
          result.push({
            label: key[0].toUpperCase() + key.substr(1),
            facts: facts.rooms[key].map(item => {
              return { key: item.level, value: item.dimensions }
            })
          })
        })
      } else return false

      return result
    },

    vowFacts () {
      const facts = this.listing.vow_facts
      if (!facts) return false

      const result = []

      Object.keys(facts).forEach(key => {
        if (key === 'rooms') return

        result.push({
          label: key[0].toUpperCase() + key.substr(1),
          facts: facts[key]
        })
      })

      return result

      // return facts.filter((item, key) => key !== 'rooms')
    },

    allVow () {
      if (this.vowRooms && this.vowFacts) {
        return this.vowRooms.concat(this.vowFacts)
      } else if (this.vowRooms) {
        return this.vowRooms
      } else if (this.vowFacts) {
        return this.vowFacts
      }

      return false
    },

    pluralize () {
      return pluralize
    }
  },

  methods: {
    viewVowFacts (i) {
      const vow = this.allVow[i]

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: vow,
        component: CustomModalVowFacts,
        settings: {
          padded: true,
          palette: 'default'
        }
      })
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.vow-facts
  position: relative
  display: flex
  flex-direction: column
  margin: 0
  li
    display: flex
    line-height: 1
    padding: 15px 20px
    border: solid 1px #dfdfdf
    margin-top: -1px
    &.has-details
      cursor: pointer
    &:first-child
      border-radius: 3px 3px 0 0
    &:last-child
      border-radius: 0 0 3px 3px
  +desktop
    flex-direction: row
    flex-wrap: wrap
    li
      position: relative
      min-width: 50%
      max-width: 50%
      &.has-details
        > a:after,
        > a:before
          position: absolute
          z-index: 1
          content: ''
          top: 0
          left: 0
          width: 100%
          height: 100%
          box-shadow: 0 0 0 4px
          opacity: 0
          transition: opacity 60ms ease-in-out
        > a:before
          box-shadow: 0 0 0 1px inset
      &:first-child
        border-radius: 3px 0 0 0
        > a:after,
        > a:before
          border-radius: 3px 0 0 0
      &:nth-child(2)
        border-radius: 0 3px 0 0
        > a:after,
        > a:before
          border-radius: 0 3px 0 0
      &:last-child
        border-radius: 0 0 3px 0
        > a:after,
        > a:before
          border-radius: 0 0 3px 0
        &:nth-child(odd)
          min-width: calc(100% - 1px)
          flex: 1
          border-radius: 0 0 3px 3px
          > a:after,
          > a:before
            border-radius: 0 0 3px 3px
      &:nth-last-child(2)
        border-radius: 0 0 0 3px
        > a:after,
        > a:before
          border-radius: 0 0 0 3px
        &:nth-child(even)
          border-radius: 0
          > a:after,
          > a:before
            border-radius: 0
      &:nth-child(2n)
        margin-left: -1px
      &.has-details:hover
        > a:after
          opacity: 0.4
        > a:before
          opacity: 1
        .vow-right
          small
            transform: translateY(calc(100% + 5px))
          .is-hidden-touch
            span:first-child
              opacity: 0
            span:last-child
              opacity: 1
  +mobile
    font-size: 16px
    li
      padding: 8px 10px

.vow-right
  position: relative
  margin-left: auto
  overflow: hidden
  a span,
  a.is-hidden-desktop
    text-decoration: underline
  small
    display: block
    transition: transform 150ms ease-in-out
  .is-hidden-touch
    span
      display: block
      transition: opacity 150ms ease-in-out
      &:last-child
        top: 0
        right: 0
        opacity: 0
        position: absolute
        white-space: nowrap
        transform: translateY(calc(-100% - 5px))
</style>
