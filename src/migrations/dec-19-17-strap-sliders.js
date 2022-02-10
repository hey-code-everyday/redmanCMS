function migrateStrap (strap) {
  const bgImage = strap.config.style.bgImage
  bgImage.transitionInterval = 4
  bgImage.transitionStyle = 'slide'
}

export default function (state) {
  if (state.website.migrations['dec-19-17-strap-sliders']) return state

  if (state.page.hero) migrateStrap(state.page.hero)
  state.page.straps.forEach(strap => {
    migrateStrap(strap)
  })

  state.website.migrations['dec-19-17-strap-sliders'] = true

  return state
}
