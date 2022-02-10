export function elementScrollToTopIfNeeded (id) {
  try {
    const el = document.getElementById(id)
    el.scrollIntoViewIfNeeded()
  } catch (e) {
    throw new Error('Attempt to access DOM API in non-browser')
  }
}

export function elementScrollToTop (id) {
  try {
    const el = document.getElementById(id)
    el.scrollIntoView()
  } catch (e) {
    throw new Error('Attempt to access DOM API in non-browser')
  }
}