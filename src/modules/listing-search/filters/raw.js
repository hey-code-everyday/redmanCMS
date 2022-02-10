
export default {
  panel: null,
  filters: ['raw'],
  decodeSlug: false,

  sidebarText: (values: Object, config: Object) => {
    if (!values.raw) return null

    if (!config.rawFieldSets[values.raw]) {
      throw new Error('No rawFieldSet defined for ' + values.raw)
    }

    return config.rawFieldSets[values.raw].name
  }
}
