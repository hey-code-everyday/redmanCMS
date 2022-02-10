import panel from './panel.vue'
import {filters, sidebarText} from './utils'
import {createDecodeSlug} from '../../helpers/formatting'

export default {
  panel,
  filters,
  sidebarText,
  decodeSlug: createDecodeSlug(/listed-less-than-(\d+)-days-ago/, 'listing_age', 'now-%d/d')
}
