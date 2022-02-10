export default function ({
  template = encodeURI('The time is... {{ Date.now() }}'),
  display = 'block',
  className = '',
  state = {}
} = {}) {
  return {
    template,
    display,
    className,
    state
  }
}
