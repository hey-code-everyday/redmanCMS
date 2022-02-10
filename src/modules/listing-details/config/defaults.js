export default {
  /*
   * Parsed from URL
   */

  mls: null,

  /*
   * Auth
   */

  accessToken: null,

  /*
   * Hypervue
   */

  spaceID: 'rwp-5039',
  gusApi: 'https://gus.rmcloud.com/',
  grandcentralApi: 'https://grandcentral.rmcloud.com/',
  termsUrl: '/terms-and-conditions',
  listingSearchHref: 'search/%slug%',
  requestPath: '',
  requestUrl: '',
  idToken: null,
  clientIdToken: null,

  /*
   * Grand Central
   */

  // Redforms
  redforms: {
    moreInfo: 'stock/gus-details-more-info',
    requestShowing: 'stock/gus-details-request-showing'
  },

  // General
  sources: ['idx-edm-v5'],

  // Style
  margins: 'fluid', // 'contained', 'fluid'
  v4styles: true, // inject v4styles (legacy) fix

  // mobileHeader: {
  //   brand: '<span>My Redman Site</span>',
  //   phone: '604.555.6666',
  //   background: '#d62b2b',
  //   foreground: 'white'
  // },

  styles: {
    backgroundColor: '#ffffff',
    borderRadius: '3px',
    boxShadow: '0 7px 24px rgba(74, 74, 74, 0.3)',
    boxShadowFixed: '0 -7px 24px rgba(74, 74, 74, 0.3)',
    lightTextColor: '#909090',
    textColor: '#4a4a4a',
    textFontWeight: 400,
    textFontFamily: 'Helvetica, Arial, sans-serif',
    titleColor: '#363636',
    titleFontWeight: 600,
    titleFontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#d62b2b',
    primaryTextColor: '#ffffff',
    mediaColor: '#303841',
    mediaTextColor: '#ffffff',
    accentColor: '#d6642b'
  }

  // Dark styles
  // styles: {
  //   backgroundColor: '#181818',
  //   borderRadius: '3px',
  //   boxShadow: '0 0 0 3px #1DB955 inset',
  //   boxShadowFixed: '0 0 0 3px #1DB955 inset',
  //   lightTextColor: '#808080',
  //   textColor: '#B3B3B3',
  //   textFontWeight: 400,
  //   textFontFamily: 'Helvetica, Arial, sans-serif',
  //   titleColor: '#ffffff',
  //   titleFontWeight: 600,
  //   titleFontFamily: 'Helvetica, Arial, sans-serif',
  //   primaryColor: '#1DB955',
  //   primaryTextColor: '#ffffff',
  //   mediaColor: '#282828',
  //   mediaTextColor: '#ffffff',
  //   accentColor: '#1DB955'
  // }
}
