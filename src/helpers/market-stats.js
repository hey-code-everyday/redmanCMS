import api from '@/api'
import { decodeSearch } from '@/helpers/listings'
import { swapRawFilter } from '@/modules/listing-search/api/buildFilters'

export function prefetch (resolve, reject, store, state) {
  api.getComponent(store.state, 'Search')
  .then(res => {
    if (res.status !== 200) {
      reject(new Error(`Error fetching component. (${res.status})`))
      return
    }

    const { searchName } = state.state
    const { preconfiguredSearches } = res.body

    const search = preconfiguredSearches[searchName]

    let filters = {}
    if (search) {
      filters = decodeSearch(search)
      filters = swapRawFilter(filters, {}, 0, res.body)
      if (filters.raw === null) delete filters.raw
      delete filters.userSetRaw
      delete filters.agentSetRaw
    }

    api.getStats(store.state, filters)
    .then(res => {
      if (res.status !== 200) {
        return reject(new Error(`Error fetching stats. (${res.status})`))
      }
      resolve(res.body)
    })
    .catch(err => {
      reject(err)
    })
  }).catch(err => {
    reject(err)
  })
}

export function afterPrefetch (err, result) {
  if (err) {
    this.error = err
    console.warn(err)
    return
  }

  this.$set(this.$data, 'stats', result)
  this.loading = false
}

export function chartData () {
  if (!this.stats) return []

  const buckets = this.stats.stats.dom.buckets
  const days = this.sort === 'newest' ? Object.keys(buckets) : Object.keys(buckets).reverse()

  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE

  const reducer = (acc, day, i) => {
    if (i < 14) {
      let num = buckets[day]

      if (num > max) max = num
      if (num < min) min = num

      acc.push({ day, num })
    }
    return acc
  }

  let data = days.reduce(reducer, [])

  max -= min

  const mapper = (day) => {
    day.val = ((day.num - min) / max) * 100
    return day
  }

  data = data.map(mapper)

  return data
}

export const filters = {
  round (val) {
    if (val === null) return 0
    if (!val) return val

    const abbrev = ['', 'k', 'm', 'b', 't']
    const order = Math.min(Math.floor(Math.log10(Math.abs(val)) / 3), abbrev.length - 1)
    const suffix = abbrev[order]

    return Math.round(val / Math.pow(10, order * 3)) + suffix
  },

  roundDays (val) {
    if (val === null) return 0
    if (val < 365) return Math.round(val)

    // issue with 0 listings
    if (val >= 9007199254740991) return 0

    console.log('rounding value', val)

    val = Math.round(val / 365)
    return val + (val === 1 ? 'year' : ' years')
  }
}
