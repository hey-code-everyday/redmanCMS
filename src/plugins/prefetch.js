function loadComponent (componentOrFactory) {
  return new Promise((resolve) => {
    if (typeof componentOrFactory !== 'function') {
      resolve(componentOrFactory)
      return
    }

    resolve(componentOrFactory().component.then(componentModule => componentModule.default))
  })
}

function prefetch (store) {
   // Eligiable components
  const components = {
    ...require('../components/headers').default,
    ...require('../components/footers').default,
    ...require('../components/heroes').default,
    ...require('../components/straps').default
  }

  // Component states
  let states = []
  store.state.header && states.push(store.state.header)
  store.state.footer && states.push(store.state.footer)
  store.state.page.hero && states.push(store.state.page.hero)
  store.state.page.straps && (states = states.concat(store.state.page.straps))

  // Build promise array
  const promises = []
  states.forEach(state => {
    const componentOrFactory = components[state.name.toLowerCase()]
    if (!componentOrFactory) return

    // Determine component id so we can set the data later
    let id = state.id
    if (!id) {
      if (state.name.includes('header')) id = 'header'
      if (state.name.includes('footer')) id = 'footer'
    }

    // Build promise
    promises.push(
      new Promise((resolve, reject) => {
        loadComponent(componentOrFactory).then(component => {
          if (!component.prefetch) {
            resolve(null)
            return
          }
          component.prefetch(resolve, reject, store, state)
        })
      }).then(result => {
        if (!result) return

        store.commit('SET_PREFETCHED_DATA', {
          id,
          data: result
        })
      }).catch(error => {
        console.warn(error)
        store.commit('SET_PREFETCHED_ERROR', {
          id,
          error
        })
      })
    )
  })

  return Promise.all(promises)
}

export default {
  install (Vue, options) {
    Vue.$prefetch = prefetch

    Vue.mixin({
      created () {
        const prototype = Object.getPrototypeOf(this.$options)
        if (!prototype.prefetch) {
          return
        }

        let id
        if (this.$props.header) id = 'header'
        if (this.$props.footer) id = 'footer'
        if (this.$props.strap) id = this.$props.strap.id

        const payload = this.$store.state.prefetchedData[id]
        const afterPrefetch = prototype.afterPrefetch.bind(this)

        if (!payload) {
          return afterPrefetch(new Error('Please reload the page to view this content.'))
        }

        if (!afterPrefetch) {
          return afterPrefetch(new Error('Method "afterPrefetch" not defined on component.'))
        }

        afterPrefetch(payload.error, payload)
      }
    })
  }
}
