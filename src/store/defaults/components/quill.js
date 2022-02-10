export default function ({
  html = encodeURI('Lorem <strong class="is-strong">ipsum</strong> dolor <span class="is-soft">sit amet.</span>'),
  display = 'block',
  className = ''
} = {}) {
  return {
    html,
    display,
    className
  }
}
