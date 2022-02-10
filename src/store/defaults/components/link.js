export default function ({
  text = 'My Link',
  type = 'link',
  icon = '',
  href = '#',
  linkOut = false
} = {}) {
  return {
    text,
    type,
    icon,
    href,
    linkOut
  }
}
