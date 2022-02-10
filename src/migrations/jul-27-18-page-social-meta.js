export default function (state) {
  if (state.website.migrations['jul-27-18-page-social-meta']) return state

  state.page.metaInfo.imageUrl = ''
  state.website.config.display.thumbnailUrl = ''

  state.website.migrations['jul-27-18-page-social-meta'] = true

  return state
}
