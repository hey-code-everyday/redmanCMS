<template>
  <search-bar
    class="listing-search-bar"
    :onSearch="search"
    :background="background"
    :placeholder="placeholder" />
</template>

<script>
import kebabCase from 'lodash/kebabCase'

import api from '@/api'
import SearchBar from '@/components/SearchBar'
const slugify = text => kebabCase(text.replace(/&/g, '-and-'))

export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search by city, neighbourhood, or MLS #'
    },

    background: {
      type: String,
      required: true
    }
  },

  components: {
    SearchBar
  },

  methods: {
    search (query, done) {
      api.getAutocomplete(this.$store.state, query).then(response => {
        const list = {}

        response.body.forEach(result => {
          const category = list[result.type] || {
            title: result.type[0].toUpperCase() + result.type.slice(1),
            items: []
          }

          const item = {
            label: result.locationTitle
          }

          if (result.type === 'listing') {
            const clean = slugify(result.locationTitle).toLowerCase()
            item.href = `/for-sale/${clean}--${result.mls}`
          } else if (result['whosonfirst.id']) {
            item.href = `/search/geo/wof/` + `${result['whosonfirst.id']}/?sort=list_date_des`
          } else {
            item.href = `/search/geo/all-areas/?lat=` +
              `${result.centre_lat}&lon=${result.centre_lon}&sort=geo_centre`
          }

          category.items.push(item)

          list[result.type] = category
        })

        const listArr = []
        for (let key in list) {
          listArr.push(list[key])
        }

        done(listArr)
      }).catch(e => {
        done(false, e)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.listing-search-bar

</style>
