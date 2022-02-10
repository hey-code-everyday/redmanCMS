export type Tag = {
  label: string,
  checked: boolean,
  values: Object
}

// dynamically require needed filter utils
export function importPossibleTags (config: Object): Array<Function> {
  const names = []
  const tags = config.tags.filter(tag => {
    if (names.includes(tag.name)) return false
    names.push(tag.name)
    return tag
  })
  return tags.map(tag => {
    let utils
    try {
      utils = tag.config && require(`../filters/${tag.name}/tags.js`)
    } catch (e) {
      return false
    }
    return utils.getTag ? utils.getTag(tag.config) : false
  }).filter(x => x)
}

export function filtersMatch (values: Object, currentFilters: Object): boolean {
  return Object.keys(values).reduce((acc, key) => {
    if (!acc) return false
    const value = values[key]
    if (value === null) return true
    return (
      currentFilters[key] &&
      (value === currentFilters[key])
    )
  }, true)
}
