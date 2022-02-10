<template>
  <div :class="[ 'strap-market-stats', isDark && 'is-dark' ]">
    <div :class="[ 'strap-container', 'container', (strap_state.title.html == emptyQuill) ? 'pad-small' : 'pad-medium' ]">
      <header class='strap-header content'>
        <h2 v-if="strap_state.useSearchName && strap_state.searchName" class="title is-2" style="padding: 0.5rem 0">{{ searchName }}</h2>
        <editable-title v-else @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>
      <div class='strap-content content'>
        <div class="strap-content__inner">

          <div v-if="loading">
            Loading...
          </div>

          <div v-else-if="error">
            {{ error.message }}
          </div>

          <div class="columns" v-else>

            <!-- Price -->

            <div class="column">
              <div :class="[ 'box', 'box__stats', isBranded && 'is-branded' ]" :style="boxStyle">
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
              <div :class="[ 'box', 'box__stats', isBranded && 'is-branded' ]" :style="boxStyle">
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
              <div :class="[ 'box', 'box__stats', isBranded && 'is-branded' ]" :style="boxStyle">
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

          <!-- Chart -->

          <div class="stats-chart" v-if="false">
            <div class="stats-chart__header">
              <h2 class="title is-4">Days on Market</h2>

              <!-- Sort -->

              <div class="stats-chart__sort">
                <div :class="[ 'dropdown', 'is-right', sortOpen && 'is-active' ]">
                  <div class="dropdown-trigger">
                    <button class="button" @click="sortOpen = !sortOpen">
                      <span style="text-transform:capitalize">{{ sort }} <span class='is-hidden-mobile'>First</span></span>
                      <span class="icon is-small">
                        <i class="icon-chevron-down"></i>
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a class="dropdown-item" @click="sort = 'newest', sortOpen = false">
                        Newest First
                      </a>
                      <a class="dropdown-item" @click="sort = 'oldest', sortOpen = false">
                        Oldest First
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="chart" v-if="chartData">
              <div class="chart__axis-label"># OF LISTINGS</div>
              <div class="chart__line" v-for="(h, y) in [0, 1, 2, 3]"></div>
              <div class="chart__bars">
                <div class="chart__bar-group" v-for="(day, x) in chartData" :key="x">
                  <div class="chart__bar" :style="{ backgroundColor: strap_palette.uiPrimary.bgColor, height: `${day.val}%` }">
                    <div class="chart__bar-tooltip"><span>{{ day.num }}</span></div>
                  </div>
                  <div class="chart__bar-label">{{ day.day }}</div>
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
import emptyQuill from '@/helpers/empty-quill'
import defaultTitle from '@/store/defaults/components/title'
import EditableTitle from '@/components/editable/EditableTitle'
import { preconfiguredOptions } from '@/helpers/listings'
import { prefetch, afterPrefetch, chartData, filters } from '@/helpers/market-stats'

export default {
  name: 'StrapMarketStats',

  components: {
    EditableTitle
  },

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
    searchName () {
      return this.strap_state.searchName.split('-').map(str => {
        return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
      }).join(' ')
    },

    emptyQuill () {
      return emptyQuill
    },

    boxStyle () {
      if (!this.isBranded) return {}

      const { uiPrimary } = this.strap_palette

      return {
        backgroundColor: uiPrimary.bgColor,
        color: uiPrimary.textColor
      }
    },

    isBranded () {
      return this.strap_state.brandedBoxes
    },

    isDark () {
      return this.$store.state.website.theme.dark || this.strap_style.theme === 'feature'
    },

    chartData
  },

  filters,

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Market Stats', size: 2 }),
      searchName: '',
      brandedBoxes: false,
      useSearchName: false
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
              },
              {
                key: 'state.useSearchName',
                type: 'checkbox',
                label: 'Use Search Name as Title',
                text: 'Use the name of the selected search for the title',
                default: false,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.brandedBoxes',
                type: 'checkbox',
                label: 'Use Brand Color',
                text: 'Use the brand color for the stats boxes',
                default: false,
                onValue: true,
                offValue: false
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
        searchName: '',
        useSearchName: false
      } // Issue #219
    ]
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.strap-market-stats

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

.box__stats
  position: relative
  text-align: left
  &.is-branded
    color: #fff
    background: #ccc
    strong
      color: inherit !important

.is-dark
  .box__stats
    &:not(.is-branded)
      background: transparent
      color: inherit
      box-shadow: 0 0 0 1px rgba(#fff, 0.2)

.box__header
  line-height: 1.2
  margin-bottom: 2rem

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
      font-size: 24px
      font-weight: bold
    +mobile
      strong
        font-size: 18px

.stats-chart__header
  display: flex
  h2
    line-height: 36px

.stats-chart__sort
  margin-left: auto

.chart
  width: 100%
  position: relative

.chart__line
  border-bottom: dashed 1px
  padding-top: 3rem
  opacity: 0.2

.chart__bars
  position: absolute
  z-index: 1
  top: 0
  left: 0
  right: 0
  bottom: 0
  display: flex
  justify-content: center
  align-items: flex-end

.chart__bar-group
  counter-increment: chart-bar
  position: relative
  padding: 0 2.5vw
  display: flex
  align-items: flex-end
  cursor: pointer
  animation-name: bar-expand
  animation-duration: 300ms
  animation-fill-mode: forwards
  height: 0
  +desktop
    &:hover
      .chart__bar-tooltip
        opacity: 1
        transform: translateX(-100%)

@keyframes bar-expand
  0%
    height: 0
  100%
    height: 100%

@for $i from 1 through 14
  .chart__bar-group:nth-child(#{$i})
    animation-delay: 60ms + ($i * 60ms)

+mobile
  .chart__bar-group
    padding: 0 4vw
    .chart__bar-tooltip
      opacity: 1
      left: 50%
      top: 0.5rem
      transform: translateX(-50%)
      font-size: 11px
      padding: 0 0.3rem
    &:nth-child(n+8)
      display: none

+widescreen
  .chart__bar-group
    padding: 0 2vw

.chart__bar
  position: relative
  min-height: 5%
  width: 4px
  border-radius: 4px 4px 0 0

.chart__bar-label
  position: absolute
  bottom: -2rem
  font-size: 14px
  text-align: center
  left: 50%
  transform: translateX(-50%)

.chart__bar-tooltip
  position: absolute
  top: -0.2rem
  left: -0.2rem
  transform: translateX(-100%) translateY(0.5rem)
  font-size: 12px
  text-align: center
  padding: 0 0.5rem
  border-radius: 3px
  box-shadow: 0 0 0 20px inset
  overflow: hidden
  opacity: 0.4
  transition: all 160ms ease-in-out
  span
    color: #fff

.is-dark
  .chart__bar-tooltip
    color: #fff
    span
      color: #000

.chart__axis-label
  position: absolute
  left: -1.5rem
  font-size: 14px
  top: 50%
  transform: translateX(-50%) rotate(-90deg)
</style>
