export default function ({
  imageUrl = '//via.placeholder.com/350x350',
  href = '#',
  linkOut = false,
  title = 'Title Ipsum',
  subtitle = 'Lorem ipsum dolor sit amet',
  useCustomOverlay = false,
  overlayOpacity = 85,
  overlayColor = '#000',
  useHoverOverlay = false,
  hoverOverlayOpacity = 85,
  hoverOverlayColor = '#000',
  hoverFadeSpeed = 1
} = {}) {
  return {
    imageUrl,
    href,
    linkOut,
    title,
    subtitle,
    useCustomOverlay,
    overlayOpacity,
    overlayColor,
    useHoverOverlay,
    hoverOverlayOpacity,
    hoverOverlayColor,
    hoverFadeSpeed
  }
}
