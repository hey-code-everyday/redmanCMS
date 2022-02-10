// TODO: DRY this out with Office panel

export default {
  panel: null,
  filters: ['agent_id'],

  decodeSlug: false,

  sidebarText: (values: Object, config: Object) => {
    if (!values.agent_id) return null
    if (!config || !config.panels) return null

    const agentId = values.agent_id
    const panel = config.panels.find(panel => panel.name === "agent")
    if (!panel) {
      throw new Error('Filter config options for Agent not provided in config')
    }
    const agentName = panel.config[agentId]

    return agentName
  }
}
