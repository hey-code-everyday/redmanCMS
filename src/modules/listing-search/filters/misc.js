
export default {
  panel: null,
  filters: ['agentSetRaw', 'high_condo_fee', 'lot_size', 'market', 'keywords'],
  decodeSlug: false,

  sidebarText: function (values: Object, config: Object) {
    const setFilters = this.filters.filter(filter => values[filter])

    if (!setFilters.length) return null

    return 'Realtor-set filters'
  }
}
