export default function () {
  return {
    groups: [
      {
        key: 'strapConfig',
        title: 'Page Details',
        panels: [
          {
            title: 'General',
            tabs: [
              {
                title: 'General',
                initial: true,
                fields: [
                  {
                    key: 'slug',
                    type: 'text',
                    label: 'URL Slug',
                    default: '',
                    hint: 'The URL for this page.',
                    placeholder: 'my-page'
                  },
                  {
                    key: 'metaInfo.title',
                    type: 'text',
                    label: 'Title',
                    default: '',
                    hint: 'The title of this page.'
                  },
                  {
                    key: 'metaInfo.imageUrl',
                    type: 'image',
                    label: 'Social Media Thumbnail',
                    default: '',
                    hint: 'The image that displays as a thumbnail when shared on social media. Must be at least 200px by 200px in size.'
                  },
                  {
                    key: 'metaInfo.description',
                    type: 'multiText',
                    label: 'Description',
                    default: '',
                    hint: 'The description that shows up in search engine results.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
