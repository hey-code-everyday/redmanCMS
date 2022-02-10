export default function closestParent (el, selector) {
  if (!process.browser) return null

  let i
  const matches = (el.document || el.ownerDocument).querySelectorAll(selector)

  do {
    i = matches.length
    while (--i >= 0 && matches.item(i) !== el) {}
  } while ((i < 0) && (el = el.parentElement))

  return el
}
