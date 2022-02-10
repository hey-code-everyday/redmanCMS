export default function () {
  return {
    config: {
      features: {},
      setup: {
        agentID: 'eheineel',
        brokerageID: 'E078900',
        blogUrl: 'http://blog.yourtruhome.com/',
        bodyClasses: '',
        scripts: [],
        styles: [],
        javascript: '',
        css: ''
      },
      display: {
        siteName: 'My Redman Site',
        textTense: 'singular', // singular, plural
        logoUrl: '//rmostatic-test.s3.amazonaws.com/0091/0713/redman_dark.png',
        smallLogoUrl: '//rmostatic-test.s3.amazonaws.com/0091/0713/redman_dark.png',
        thumbnailUrl: ''
      },
      office: {
        email: 'sales@redmantech.ca',
        phone: '7804256270',
        cellPhone: '',
        officePhone: '',
        fax: '',
        officeName: 'Redman Tech',
        address: '10172 – 108 Street NW',
        city: 'Edmonton',
        province: 'Alberta',
        provinceCode: 'AB',
        postalCode: 'T5J 1L3'
      },
      social: {
        facebook: 'https://www.facebook.com/LoveRedmanTech',
        flickr: '',
        foursquare: '',
        googleplus: '',
        instagram: '',
        linkedin: '',
        pinterest: '',
        twitter: 'https://twitter.com/redmantech',
        youtube: '',
        rss: ''
      }
    },
    integrations: {
      analytics: {
        googleTagManager: {
          trackingID: ''
        },
        googleAnalytics: {
          trackingID: ''
        },
        googleSiteVerification: {
          trackingID: ''
        },
        facebookPixel: {
          trackingID: ''
        },
        bingWebmasterTools: {
          trackingID: ''
        },
        googleAdWordsRemarketing: {
          trackingID: ''
        },
        agileCrm: {
          domain: '',
          trackingID: '',
          useWebRules: false
        },
        autoCompletionKey: {
          trackingID: ''
        }
      }
    },
    theme: {
      baseTemplate: 'default',
      dark: false,
      fonts: {
        body: {
          family: 'Karla',
          weights: '400,700',
          weight: '400'
        },
        title: {
          family: 'Montserrat',
          weights: '900',
          weight: '900'
        }
      },
      header: {
        text: '#243C57',
        linkText: '#243C57',
        titleText: '#243C57',
        bgColor: '#ffffff',
        brandBgColor: '#D10A53',
        brandBgColor2: '#FF6663',
        brandText: '#fff',
        textShadow: {
          x: 0,
          y: 0,
          blur: 0,
          color: '#D10A53',
          enabled: false
        }
      },
      straps: { // '#4a4a4a', '#000000', '#ffffff', '#D82823', '#F06943'
        default: {
          text: '#243C57',
          linkText: '#D10A53',
          titleText: '#243C57',
          bgColor: '#ffffff',
          accentColor: '#29CFC4',
          overlayAlpha: 0.85,
          overlayAngle: 135,
          uiPrimary: {
            text: '#ffffff',
            bgColor: '#D10A53',
            accentColor: '#000000'
          },
          uiSecondary: {
            text: '#ffffff',
            bgColor: '#FF6663',
            accentColor: '#000000'
          },
          textShadow: {
            x: 0,
            y: 0,
            blur: 0,
            color: '#000',
            enabled: false
          }
        },
        feature: {
          text: '#ffffff',
          linkText: '#ffffff',
          titleText: '#ffffff',
          bgColor: '#243C57',
          accentColor: '#F06943',
          overlayAlpha: 0.85,
          overlayAngle: 135,
          uiPrimary: {
            text: '#ffffff',
            bgColor: '#D82823',
            accentColor: '#F06943'
          },
          uiSecondary: {
            text: '#ffffff',
            bgColor: '#D82823',
            accentColor: '#F06943'
          },
          textShadow: {
            x: 0,
            y: 0,
            blur: 0,
            color: '#000',
            enabled: false
          }
        },
        alternate: {
          text: '#243C57',
          linkText: '#D10A53',
          titleText: '#243C57',
          bgColor: '#FAFBFC',
          accentColor: '#29CFC4',
          overlayAlpha: 0.85,
          overlayAngle: 135,
          uiPrimary: {
            text: '#ffffff',
            bgColor: '#D10A53',
            accentColor: '#000000'
          },
          uiSecondary: {
            text: '#ffffff',
            bgColor: '#FF6663',
            accentColor: '#000000'
          },
          textShadow: {
            x: 0,
            y: 0,
            blur: 0,
            color: '#000',
            enabled: false
          }
        }
      }
    },
    migrations: {}
  }
}
