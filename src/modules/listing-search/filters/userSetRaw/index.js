import panel from './panels'

export default {
  panel,
  filters: ['userSetRaw'],
  decodeSlug: false,

  sidebarText: (values: Object) => {
    if (values.userSetRaw && values.userSetRaw.length) return 'Advanced Filters'
  }
}
