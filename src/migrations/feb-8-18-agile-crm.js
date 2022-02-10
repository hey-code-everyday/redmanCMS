export default function (state) {
  if (state.website.migrations['feb-8-18-agile-crm']) return state

  state.website.integrations.analytics.agileCrm = {
    domain: '',
    trackingID: '',
    useWebRules: false
  }

  state.website.migrations['feb-8-18-agile-crm'] = true

  return state
}
