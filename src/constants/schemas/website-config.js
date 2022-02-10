import headers from '@/components/headers/headers'
import footers from '@/components/footers/footers'

const headerOptions = Object.keys(headers).map(key => {
  return { text: headers[key].name, value: key }
})

const footerOptions = Object.keys(footers).map(key => {
  return { text: footers[key].name, value: key }
})

export default function () {
  return {
    groups: [
      {
        key: 'websiteConfig',
        title: 'Website Configuration',
        panels: [
          {
            title: 'General',
            tabs: [
              {
                title: 'Display',
                initial: true,
                fields: [
                  {
                    key: 'website.config.display.siteName',
                    type: 'text',
                    label: 'Site Title',
                    default: '',
                    hint: 'The name of your website.'
                  },
                  {
                    key: 'website.config.display.logoUrl',
                    type: 'image',
                    label: 'Logo Image',
                    default: '',
                    hint: 'The logo that displays on your header and footer.'
                  },
                  {
                    key: 'website.config.display.smallLogoUrl',
                    type: 'image',
                    label: 'Small Logo Image',
                    default: '',
                    hint: 'The small logo that displays on your mobile header.'
                  },
                  {
                    key: 'website.config.display.thumbnailUrl',
                    type: 'image',
                    label: 'Social Media Thumbnail',
                    default: '',
                    hint: 'The image that displays as a thumbnail when shared on social media. Must be at least 200px by 200px in size.'
                  },
                  // {
                  //   key: 'website.theme.baseTemplate',
                  //   type: 'dropdown',
                  //   label: 'Theme',
                  //   default: 'default',
                  //   hint: 'Set the visual style of your website.',
                  //   options: [
                  //     { text: 'Azure', value: 'azure' },
                  //     { text: 'Neo', value: 'neo' },
                  //     { text: 'Phoenix', value: 'default' },
                  //     { text: 'Vogue', value: 'vogue' }
                  //   ]
                  // },
                  {
                    key: 'website.theme.dark',
                    type: 'checkbox',
                    label: 'Dark Theme',
                    text: 'Use dark color styles',
                    default: false,
                    onValue: true,
                    offValue: false,
                    hint: 'Enable if this site uses a dark background with light text.'
                  },
                  {
                    key: 'website.config.display.textTense',
                    type: 'dropdown',
                    label: 'Text Tense',
                    default: 'singular',
                    hint: 'Use either singular or plural tense when describing you and your office.',
                    options: [
                      { text: 'Singular', value: 'singular' },
                      { text: 'Plural', value: 'plural' }
                    ]
                  }
                ]
              },
              {
                title: 'Setup',
                initial: true,
                fields: [
                  {
                    key: 'website.config.setup.agentID',
                    type: 'text',
                    label: 'Agent ID'
                  },
                  {
                    key: 'website.config.setup.brokerageID',
                    type: 'text',
                    label: 'Brokerage ID'
                  },
                  {
                    key: 'website.config.setup.blogUrl',
                    type: 'text',
                    label: 'Blog URL'
                  }
                ]
              },
              {
                title: 'Office',
                fields: [
                  {
                    key: 'website.config.office.email',
                    type: 'text',
                    label: 'Email',
                    default: '',
                    hint: 'The email that your members and leads will use to contact you.'
                  },
                  {
                    key: 'website.config.office.phone',
                    type: 'text',
                    label: 'Phone Number',
                    default: '',
                    hint: 'The phone number that your members and leads will use to contact you.'
                  },
                  {
                    key: 'website.config.office.cellPhone',
                    type: 'text',
                    label: 'Cell Phone Number',
                    default: ''
                  },
                  {
                    key: 'website.config.office.officePhone',
                    type: 'text',
                    label: 'Office Phone Number',
                    default: ''
                  },
                  {
                    key: 'website.config.office.fax',
                    type: 'text',
                    label: 'Office Fax Number',
                    default: ''
                  },
                  {
                    key: 'website.config.office.officeName',
                    type: 'text',
                    label: 'Office Name',
                    default: '',
                    hint: 'The name of your office, team or brokerage.'
                  },
                  {
                    key: 'website.config.office.address',
                    type: 'text',
                    label: 'Address',
                    default: ''
                  },
                  {
                    key: 'website.config.office.city',
                    type: 'text',
                    label: 'City',
                    default: ''
                  },
                  {
                    key: 'website.config.office.province',
                    type: 'text',
                    label: 'Province',
                    default: ''
                  },
                  {
                    key: 'website.config.office.provinceCode',
                    type: 'text',
                    label: 'Province Code',
                    default: '',
                    hint: 'Short form of the province. Eg - BC, AB, ON, etc.'
                  },
                  {
                    key: 'website.config.office.postalCode',
                    type: 'text',
                    label: 'Postal Code',
                    default: ''
                  }
                ]
              },
              {
                title: 'Social Links',
                fields: [
                  {
                    key: 'website.config.social.facebook',
                    type: 'text',
                    label: 'Facebook',
                    default: ''
                  },
                  {
                    key: 'website.config.social.twitter',
                    type: 'text',
                    label: 'Twitter',
                    default: ''
                  },
                  {
                    key: 'website.config.social.instagram',
                    type: 'text',
                    label: 'Instagram',
                    default: ''
                  },
                  {
                    key: 'website.config.social.youtube',
                    type: 'text',
                    label: 'YouTube',
                    default: ''
                  },
                  {
                    key: 'website.config.social.googleplus',
                    type: 'text',
                    label: 'Google+',
                    default: ''
                  },
                  {
                    key: 'website.config.social.linkedin',
                    type: 'text',
                    label: 'LinkedIn',
                    default: ''
                  },
                  {
                    key: 'website.config.social.pinterest',
                    type: 'text',
                    label: 'Pinterest',
                    default: ''
                  },
                  {
                    key: 'website.config.social.rss',
                    type: 'text',
                    label: 'RSS Feed',
                    default: ''
                  }
                ]
              },
              {
                title: 'Advanced',
                fields: [
                  {
                    key: 'website.config.setup.bodyClasses',
                    type: 'text',
                    label: 'Body Classes',
                    default: '',
                    placeholder: 'my-class1 my-class2',
                    hint: 'Classes to add to the body tag.'
                  },
                  {
                    key: 'website.config.setup.scripts',
                    type: 'stringList',
                    label: 'External Scripts',
                    default: [''],
                    hint: 'A list of external scripts to load.'
                  },
                  {
                    key: 'website.config.setup.styles',
                    type: 'stringList',
                    label: 'External Stylesheets',
                    default: [''],
                    hint: 'A list of external stylesheets to load.'
                  },
                  {
                    key: 'website.config.setup.javascript',
                    type: 'javascript',
                    label: 'JavaScript',
                    default: '',
                    hint: 'Custom JavaScript that loads once with the page.'
                  },
                  {
                    key: 'website.config.setup.css',
                    type: 'multiText',
                    label: 'CSS',
                    default: '',
                    hint: 'Custom styles that load once with the page.'
                  }
                ]
              }
            ]
          },
          {
            title: 'Team Members',
            tabs: [
              {
                title: 'Team Members',
                component: 'ManageRoster',
                props: {}
              }
            ]
          },
          {
            title: 'Header',
            tabs: [
              {
                title: 'Display',
                fields: [
                  {
                    key: 'header.name',
                    type: 'dropdown',
                    label: 'Template',
                    default: 'default',
                    hint: 'Set the visual style and layout of your header.',
                    options: headerOptions
                  }
                ]
              },
              {
                title: 'Navigation',
                component: 'NavigationEditor',
                props: {
                  where: 'header',
                  action: 'setHeaderNav'
                }
              }
            ]
          },
          {
            title: 'Footer',
            tabs: [
              {
                title: 'Display',
                fields: [
                  {
                    key: 'footer.name',
                    type: 'dropdown',
                    label: 'Template',
                    default: 'default',
                    hint: 'Set the visual style and layout of your footer.',
                    options: footerOptions
                  }
                ]
              },
              {
                title: 'Navigation',
                component: 'NavigationEditor',
                props: {
                  where: 'footer',
                  action: 'setFooterNav'
                }
              }
            ]
          },
          {
            title: 'Fonts & Colors',
            tabs: [
              {
                title: 'Fonts',
                fields: [
                  {
                    key: 'website.theme.fonts.body',
                    type: 'font',
                    label: 'Body Font',
                    default: '',
                    placeholder: 'Source Sans Pro',
                    hint: ''
                  },
                  {
                    key: 'website.theme.fonts.title',
                    type: 'font',
                    label: 'Title Font',
                    default: '',
                    placeholder: 'Source Sans Pro',
                    hint: ''
                  }
                ]
              },
              {
                title: 'Color Theme',
                component: 'ColorEditor',
                props: {}
              }
            ]
          },
          {
            title: 'Integrations',
            tabs: [
              {
                title: 'Analytics',
                fields: [
                  {
                    key: 'website.integrations.analytics.googleTagManager.trackingID',
                    type: 'text',
                    label: 'Google Tag Manager',
                    default: '',
                    placeholder: 'Tracking ID',
                    hint: 'Find your Tracking ID under the Google Tag Manager Tracking Info tab.'
                  },
                  {
                    key: 'website.integrations.analytics.googleAnalytics.trackingID',
                    type: 'text',
                    label: 'Google Analytics',
                    default: '',
                    placeholder: 'Tracking ID',
                    hint: 'Find your Tracking ID under the Google Analytics Tracking Info tab.'
                  },
                  {
                    key: 'website.integrations.analytics.googleSiteVerification.trackingID',
                    type: 'text',
                    label: 'Google Site Verification',
                    default: '',
                    placeholder: 'Site Verification Code',
                    hint: 'Find your Site Verification Code under the Google Site Verification tab.'
                  },
                  {
                    key: 'website.integrations.analytics.facebookPixel.trackingID',
                    type: 'text',
                    label: 'Facebook Pixel',
                    default: '',
                    placeholder: 'Tracking ID',
                    hint: 'Find your Tracking ID in your Facebook Tracking info tab.'
                  },
                  {
                    key: 'website.integrations.analytics.bingWebmasterTools.trackingID',
                    type: 'text',
                    label: 'Bing Webmaster Tools',
                    default: '',
                    placeholder: 'Tracking ID',
                    hint: 'Please enter your Bing Webmaster Tools Tracking ID.'
                  },
                  {
                    key: 'website.integrations.analytics.googleAdWordsRemarketing.trackingID',
                    type: 'text',
                    label: 'Google AdWords Remarketing',
                    default: '',
                    placeholder: 'Tracking Code',
                    hint: 'Find your Remarketing Code under the Google AdWords Audiences tab.'
                  },
                  {
                    key: 'website.integrations.analytics.agileCrm.domain',
                    type: 'text',
                    label: 'Agile CRM',
                    default: '',
                    placeholder: 'Domain',
                    hint: 'Your Agile domain name. Eg. <your domain>.agilecrm.com'
                  },
                  {
                    key: 'website.integrations.analytics.agileCrm.trackingID',
                    type: 'text',
                    label: 'Agile CRM',
                    default: '',
                    placeholder: 'Tracking ID',
                    hint: 'The tracking ID for your Agile script.'
                  },
                  {
                    key: 'website.integrations.analytics.agileCrm.useWebRules',
                    type: 'checkbox',
                    label: 'Agile CRM',
                    text: 'Web Rules are enabled',
                    default: false,
                    onValue: true,
                    offValue: false,
                    hint: 'Enable if this if you are using the Web Rules enabled version of the tracking code.'
                  },
                  {
                    key: 'website.integrations.analytics.autoCompletionKey.trackingID',
                    type: 'text',
                    label: 'GoogleMap AutoCompletion API Key',
                    default: '',
                    placeholder: 'Your API Key',
                    hint: 'GoogleMap API Key for address auto completion.'
                  }
                ]
              }
            ]
          },
          {
            title: 'File Management',
            tabs: [
              {
                title: 'Upload Files',
                component: 'ManageFiles',
                props: {}
              }
            ]
          },
          {
            title: 'Tools',
            tabs: [
              {
                title: 'Import/Export',
                component: 'ImportExport',
                props: {}
              }
              // {
              //   title: 'Edit JSON',
              //   component: 'EditJson',
              //   props: {}
              // },
              // {
              //   title: 'Content Defaults',
              //   component: 'ContentDefaults',
              //   props: {}
              // },
              // {
              //   title: 'Migrate',
              //   component: 'Migration',
              //   props: {}
              // }
            ]
          }
        ]
      }
    ]
  }
}
