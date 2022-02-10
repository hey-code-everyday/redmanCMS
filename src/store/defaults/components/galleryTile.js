import defaultQuill from './quill'

export default function ({
  imageUrl = 'https://via.placeholder.com/800x600',
  title = 'Title',
  subtitle = 'Subtitle',
  subtext = 'Description',
  useSoldLabel = false,
  soldLabelURL = 'https://assets.rmcloud.com/phoenix/sold.svg',
  useCustomOverlay = false,
  overlayOpacity = 85,
  useLinkout = false,
  externalLinkOut = false,
  href = "#",
  overlayColor = '#000000',
  textModalColor ='#000000',
  desc = defaultQuill()
} = {}) {
  return {
    imageUrl,
    title,
    subtitle,
    subtext,
    useSoldLabel,
    soldLabelURL,
    useCustomOverlay,
    overlayOpacity,
    overlayColor,
    externalLinkOut,
    useLinkout,
    href,
    textModalColor,
    desc
  }
}
