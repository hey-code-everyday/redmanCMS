export default function (isDev) {
  const grandcentralUrl = isDev
    ? 'https://conductor.rmcloud.com/'
    : 'https://grandcentral.rmcloud.com/'

  return {
    // Hypervue
    pageID: 'index',
    spaceID: 'rwp-5039',
    requestUrl: 'http://localhost:8080/',

    // Other
    idToken: null,
    clientIdToken: null,
    grandcentralUrl,
    conductorUrl: 'https://conductor.rmcloud.com/',
    voucherUrl: 'https://voucher.rmcloud.com/',
    gusUrl: 'https://gus.rmcloud.com/',
    engineUrl: 'http://redman.jordanranson.com.jordanr.web10.redmantech.ca/api/',
    redformsUrl: undefined,
    features: {
      'gus-v2': true,
      'page-builder': true
    },

    // Grandcentral config
    sources: [ 'idx-ddf-v5' ],
    autocomplete: {
      'focus.lat': 53.5555501,
      'focus.lon': -113.7741251,
      'distance': 100
    },
    auth0: {
      clientID: '4EgT2VamatiuGM9vT8FfNKJ58qIUC2nT',
      domain: 'redman.auth0.com',
      redirectUrl: 'https://gus.rmcloud.com/login/admin/auth0/callback'
    },
    clientAuth0: {
      clientID: 'oFfbuQ1_WHsNIqAOxkP71SBfkmPjOsSV',
      domain: 'redman.auth0.com',
      redirectUrl: 'https://gus.rmcloud.com/login/auth0/callback'
    },

    gus: {
      listingDetailsHref: '/for-sale/%slug%',
      resultsPerPage: 20,
      defaultH1: 'Edmonton, AB Real Estate',
      defaultLocationSlug: 'edmonton',
      defaultVals: {},
      defaultSort: 'list_date_des',
      panels: [],
      htmlMeta: {
        h1: '%location%',
        title: '%location% %bed% %bath% %type% For Sale',
        description: '%count% %bed% %bath% %type% for sale in %location%, view listing photos, get notified about new %location% listings and find your right home.'
      },
      tags: [],
      hideAgentInCourtesyOfMessage: false,
      preconfiguredSearches: {},
      map: {
        defaultPosition: {
          centre_lat: 53.5555501,
          centre_lon: -113.6340494,
          zoom: 11
        },
        zoomToEnhanceClusters: 13,
        zoomToDoSearch: 15
      },
      styles: {
        backgroundColor: 'white',
        textColor: '#131313',
        boxShadow: '0 0 10px #888',
        primaryColor: 'green',
        primaryTextColor: 'white',
        lightTextColor: '#666',
        titleFontFamily: '"Crete Round", Georgia, "Times New Roman", serif',
        textFontFamily: '"Open Sans", Helvetica, Arial, sans-serif'
      }
    }
  }
}
