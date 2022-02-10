// TODO: DRY this out with Agent panel

export default {
  panel: null,
  filters: ['office_id'],

  decodeSlug: false,

  sidebarText: (values: Object, config: Object) => {
    if (!values.office_id) return null
    if (!config || !config.panels) return null

    const officeId = values.office_id
    const panel = config.panels.find(panel => panel.name === "office")
    if (!panel) {
      throw new Error('Filter config options for Office not provided in config')
    }
    const officeName = panel.config[officeId]

    return officeName
  }
}
