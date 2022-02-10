import Color from 'color'

function findComponents (components, selector) {
  let found = []

  if (!(components instanceof Array)) {
    if (!(components.$children instanceof Array)) {
      return found
    }
    components = components.$children
  }

  components.forEach(component => {
    if (component.$children) {
      found = found.concat(findComponents(component.$children, selector))
    }

    const case1 = component.$options.name === selector
    const case2 = selector.includes('#') && component.$el.id === selector.replace('#', '')

    if (case1 || case2) {
      found.push(component)
    }
  })

  return found
}

class PageAPI {
  constructor (app) {
    this.app = app
    this.store = app.$store
  }

  get ID () {
    return this.store.state.config.pageID
  }

  get color () {
    return Color
  }

  get websiteConfig () {
    return this.store.state.website.config
  }

  $ (selector, parent) {
    if (!parent) parent = this.app.$children
    return findComponents(parent, selector)
  }

  palette (paletteName) {
    return this.store.getters.palette(paletteName)
  }

  strapPalette (strap) {
    if (!strap.strap) return undefined
    const paletteName = strap.$props.strap.config.style.theme
    return this.store.getters.palette(paletteName)
  }
}

export default PageAPI
