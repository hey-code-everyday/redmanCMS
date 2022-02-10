function offset (el) {
  const rect = el.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return rect.top + scrollTop
}

export default function windowScrollToTop () {
  try {
    // autoscroll #app element on mobile
    document.getElementById('gus-search').scrollTop = 0
    // autoscroll the page
    const target = offset(document.getElementById('gus-search'))
    if (
      (document.body.scrollTop - target < 250) &&
      (document.documentElement.scrollTop < 250)
    ) {
      return
    }
    document.body.scrollTop = target
    document.documentElement.scrollTop = target
  } catch (e) {
    throw new Error('Attempt to access DOM API in non-browser')
  }
}
