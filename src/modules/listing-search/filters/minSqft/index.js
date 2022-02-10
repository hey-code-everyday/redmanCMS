import panel from './panel.vue'
import {filters, sidebarText} from './utils'
import {createDecodeSlug} from '../../helpers/formatting'

export default {
  panel,
  filters,
  sidebarText,
  decodeSlug: createDecodeSlug(/(\d+)-sqft/, 'interior_size', '%p')
}
