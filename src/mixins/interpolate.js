import filters from '@/filters'

export default {
  methods: {
    $interpolate (value, palette, strap, additionalProps) {
      const matches = value.match(/({{(.+?)}})/g)
      if (!matches) return value

      // Available params for interpolation
      let scope = {
        route: this.$route,
        router: this.$router,
        config: this.$store.state.config,
        page: this.$store.state.page,
        header: this.$store.state.header,
        footer: this.$store.state.footer,
        website: this.$store.state.website,
        office: this.$store.state.website.config.office,
        social: this.$store.state.website.config.social,
        agent: this.$store.getters.agent,
        filters
      }
      if (additionalProps) {
        scope = Object.assign(scope, additionalProps)
      }

      scope.parent = this.$parent
      scope.palette = palette
      if (strap) scope.strap = strap

      // Build the var declarations for the eval function
      let vars = ''
      Object.keys(scope).forEach(k => {
        vars += `var ${k} = scope['${k}']; `
      })

      // Replace and execute
      matches.forEach(m => {
        const exp = m.replace(/({{)|(}})/g, '').trim()
        /* eslint-disable */
        try {
          value = value.replace(m, eval.call(undefined, `(function (scope) { ${vars}return ${exp}; })`)(scope))
        } catch (e) {
          console.warn(e)
        }
        /* eslint-enable */
      })

      return value
    }
  }
}
