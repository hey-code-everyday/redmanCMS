export default function ({
  text = 'My Button',
  type = 'primary',
  action = 'link',
  icon = '',
  href = '#',
  linkOut = false
} = {}) {
  return {
    text,
    type,
    action,
    icon,
    href,
    linkOut
  }
}
