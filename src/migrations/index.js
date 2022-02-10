import dec1917strapSliders from './dec-19-17-strap-sliders'
import feb818agileCrm from './feb-8-18-agile-crm'
import may1118newPalettes from './may-11-18-new-palettes'
import jul2718pageSocialMeta from './jul-27-18-page-social-meta'

export default function migrate (state) {
  if (!state.website.migrations) state.website.migrations = {}

  state = dec1917strapSliders(state)
  state = feb818agileCrm(state)
  state = may1118newPalettes(state)
  state = jul2718pageSocialMeta(state)

  return state
}
