<template>
  <div :class="[ 'strap-market-stats-slim', isDark && 'is-dark' ]">
    <div :class="[ 'strap-container', 'container' ]">
      <div class='strap-content content'>
        <div class="strap-content__inner">

          <div v-if="loading">
            Loading...
          </div>

          <div v-else-if="error">
            {{ error.message }}
          </div>

          <div class="columns is-gapless" v-else>

            <!-- Price -->

            <div class="column">
              <div :class="[ 'box__stats' ]" :style="boxStyle">
                <span class="icon box__icon">
                  <i class="icon-bag-dollar"></i>
                </span>
                <header class="box__header">
                  <strong>Price</strong><br />
                  <small>{{ stats.aggregations.price.count | bigNumber }} listings</small>
                </header>
                <div class="level level__stats is-mobile">
                  <div class="level-item">
                    <strong class="title">{{ stats.aggregations.price.avg | round }}</strong><br />
                    <small>AVG</small>
                  </div>
                  <div class="level-item">
                    <strong class="title">{{ stats.aggregations.price.min | round }}</strong><br />
                    <small>MIN</small>
                  </div>
                  <div class="level-item">
                    <strong class="title">{{ stats.aggregations.price.max | round }}</strong><br />
                    <small>MAX</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Days on Market -->

            <div class="column">
              <div :class="[ 'box__stats' ]" :style="boxStyle">
                <span class="icon box__icon">
                  <i class="icon-calendar-empty"></i>
                </span>
                <header class="box__header">
                  <strong>Days on Market</strong><br />
                  <small>{{ stats.stats.dom.count | bigNumber }} listings</small>
                </header>
                <div class="level level__stats is-mobile">
                  <div class="level-item">
                    <strong class="title">{{ stats.stats.dom.avg | roundDays }}</strong><br />
                    <small>AVG</small>
                  </div>
                  <div class="level-item">
                    <strong class="title">{{ stats.stats.dom.min | roundDays }}</strong><br />
                    <small>MIN</small>
                  </div>
                  <div class="level-item">
                    <strong class="title">{{ stats.stats.dom.max | roundDays }}</strong><br />
                    <small>MAX</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Area -->

            <div class="column">
              <div :class="[ 'box__stats' ]" :style="boxStyle">
                <span class="icon box__icon">
                  <i class="icon-rulers"></i>
                </span>
                <header class="box__header">
                  <strong>Area</strong><br />
                  <small>${{ stats.stats.avgPricePerArea | round }} per sqft.</small>
                </header>
                <div class="level level__stats is-mobile">
                  <div class="level-item">
                    <strong class="title">{{ stats.aggregations.area.avg | round }}</strong><br />
                    <small>AVG</small>
                  </div>
                  <div class="level-item">
                    <strong class="title">{{ stats.aggregations.area.min | round }}</strong><br />
                    <small>MIN</small>
                  </div>
                  <div class="level-item">
                    <strong class="title">{{ stats.aggregations.area.max | round }}</strong><br />
                    <small>MAX</small>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import { preconfiguredOptions } from '@/helpers/listings'
import { prefetch, afterPrefetch, chartData, filters } from '@/helpers/market-stats'

export default {
  name: 'StrapMarketStatsSlim',

  mixins: [mixinStrap],

  prefetch,

  afterPrefetch,

  data () {
    return {
      sort: 'newest',
      stats: {},
      error: false,
      loading: false,
      sortOpen: false
    }
  },

  computed: {
    boxStyle () {
      return {}
    },

    isDark () {
      return this.$store.state.website.theme.dark || this.strap_style.theme === 'feature'
    },

    chartData
  },

  filters,

  initialState (strap, state) {
    return {
      searchName: ''
    }
  },

  schema () {
    return [
      {
        title: 'Market Stats',
        tabs: [
          {
            title: 'Display Options',
            initial: true,
            fields: [
              {
                key: 'state.searchName',
                type: 'dropdown',
                label: 'Preconfigured Search',
                hint: 'Display results from a preconfigured search',
                options () {
                  return preconfiguredOptions.call(this)
                }
              }
            ]
          }
        ]
      }
    ]
  },

  migrations (strap, state) {
    return [
      {
        searchName: ''
      } // Issue #219
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-market-stats-slim
  font-size: 16px

.strap-content
  display: flex

  .strap-content__inner
    width: 100%

.is-aligned-centered
  .strap-content
    justify-content: center

.is-aligned-right
  .strap-content
    justify-content: flex-end

+mobile
  .strap-content__inner
    max-width: 100% !important
  .strap-container
    padding-left: 0 !important
    padding-right: 0 !important

.box__stats
  position: relative
  padding: 1.25rem
  text-align: left
  &:after
    content: ''
    position: absolute
    top: 0
    right: 0
    bottom: 0
    opacity: 0.2
    border-right: solid 1px

.column:last-child
  .box__stats
    &:after
      display: none

+mobile
  .box__stats
    &:after
      top: auto
      bottom: 0
      left: 0
      border-right: none
      border-bottom: solid 1px

.box__header
  line-height: 1.2
  margin-bottom: 1.25rem

.box__icon
  position: absolute
  top: 1.25rem
  right: 1.25rem
  width: 40px
  height: 40px
  font-size: 40px
  opacity: 0.4

.level__stats
  .level-item
    display: block
    line-height: 1.2
    strong
      font-size: 18px
      font-weight: bold
    +mobile
      strong
        font-size: 18px
</style>
