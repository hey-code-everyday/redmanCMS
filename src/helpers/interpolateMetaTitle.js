function interpolateMetaTitle (title, state) {
  if (!title) return title
  const matches = title.match(/({{(.+?)}})/g)
  if (matches) {
    let scope = {
      config: state.config,
      page: state.page,
      header: state.header,
      footer: state.footer,
      website: state.website,
      office: state.website.config.office,
      social: state.website.config.social,
      agent: state.agents.find(r => r.uid === state.currentAgent),
    }
    let vars = ''
    Object.keys(scope).forEach(k => {
      vars += `var ${k} = scope['${k}']; `
    })
    // Replace and execute
    matches.forEach(m => {
      const exp = m.replace(/({{)|(}})/g, '').trim()
      /* eslint-disable */
      try {
        title = title.replace(m, eval.call(undefined, `(function (scope) { ${vars}return ${exp}; })`)(scope))
      } catch (e) {
        console.warn(e)
      }
      /* eslint-enable */
    })
  }
  return title
}

export {
  interpolateMetaTitle
}