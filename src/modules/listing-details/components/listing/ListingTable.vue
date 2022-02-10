<template>
  <div class="listing-table listing-container content">
    <h2 class="title is-5 is-title">Key Details</h2>
    <div class="columns">
      <div class="column">
        <ul>
          <li v-for="fact in factsLeft" v-if="fact.key.toLowerCase() !== 'amenities'">
            <label class="label is-label">{{ fact.key }}</label>
            <span class="value">
              <span v-if="fact.val">{{ fact.val }}</span>
              <span v-else>{{ fact.value }}</span>
            </span>
          </li>
          <li v-show="mobile && fact.key.toLowerCase() !== 'amenities'" v-for="fact in factsRight">
            <label class="label is-label">{{ fact.key }}</label>
            <span class="value">
              <span v-if="fact.val">{{ fact.val }}</span>
              <span v-else>{{ fact.value }}</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="column" v-show="!mobile">
        <ul>
          <li v-for="fact in factsRight" v-if="fact.key.toLowerCase() !== 'amenities'">
            <label class="label is-label">{{ fact.key }}</label>
            <span class="value">
              <span v-if="fact.val">{{ fact.val }}</span>
              <span v-else>{{ fact.value }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listingTable',

  props: {
    listing: { type: Object, required: true }
  },

  computed: {
    mobile () {
      return window.innerWidth < 1024
    },

    facts () {
      const listing = this.listing
      if (listing == null) return []

      if (!listing.facts || !listing.facts.length) return []

      const items = []
      listing.facts.forEach(fact => {
        let value = fact.value || '—'
        value = value.replace(/\s,/g, ',')
        value = value.replace(/,([^\s])/g, ', $1')

        items.push({ key: fact.key, value })
      })

      return items
    },

    factsLeft () {
      let facts = []
      this.facts.forEach((fact, i) => { if (i % 2 === 0) facts.push(fact) })
      return facts
    },

    factsRight () {
      let facts = []
      this.facts.forEach((fact, i) => { if (i % 2 === 1) facts.push(fact) })
      return facts
    }
  }
}
</script>

<style scoped lang="sass">
@import '~bulma/sass/utilities/_all'

.listing-table
  li
    position: relative
    display: flex
    min-height: 34px
    line-height: 34px
    font-size: 0.9em
    padding: 5px 0
    &:after
      content: ''
      display: block
      position: absolute
      width: 100%
      height: 1px
      bottom: -1px
      left: 0
      box-shadow: 0 0 100px inset
      opacity: 0.2
    &:last-child
      &:after
        display: none
  .value,
  .label
    display: block
    width: 50%
  .label
    font-size: inherit
    font-weight: bolder
    margin-bottom: 0
    color: inherit
  .value
    display: flex
    align-items: center
    span
      display: inline-block
      line-height: 1.5
  +mobile
    li
      line-height: 28px
      min-height: 28px

.content
  ul
    margin: 0
</style>
