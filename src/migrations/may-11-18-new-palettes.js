function newTextShadow () {
  return {
    x: 0,
    y: 0,
    blur: 0,
    color: '#000',
    enabled: false
  }
}

export default function (state) {
  if (state.website.migrations['may-11-18-new-palettes']) return state

  state.website.config.display.smallLogoUrl = state.website.config.display.logoUrl

  const palette = state.website.theme.straps.default

  state.website.theme.header = {
    text: palette.text,
    linkText: palette.linkText,
    titleText: palette.titleText,
    bgColor: palette.bgColor,
    brandBgColor: palette.uiPrimary.bgColor,
    brandBgColor2: palette.uiPrimary.bgColor,
    brandText: palette.uiPrimary.text,
    textShadow: {
      x: 0,
      y: 0,
      blur: 0,
      color: '#D10A53',
      enabled: false
    }
  }

  state.website.theme.straps.default.textShadow = newTextShadow()
  state.website.theme.straps.feature.textShadow = newTextShadow()
  state.website.theme.straps.alternate.textShadow = newTextShadow()

  state.website.migrations['may-11-18-new-palettes'] = true

  return state
}
