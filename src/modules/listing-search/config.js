/* eslint-disable */

export default {
  "spaceID": "rwp-1937",
  "rootUrl": "/search",
  "requestUrl": "http://localhost:8080",
  "gusApi": "https://gus.rmcloud.com/",
  "grandcentralApi": "https://grandcentral.rmcloud.com/",
  "listingDetailsHref": "https://www.yourtruhome.com/details/%slug%",

  "sources": [
    "idx-edm-v5"
  ],
  "autocomplete": {
    "focus.lat": 53.5555501,
    "focus.lon": -113.7741251,
    "distance": 100
  },
  "auth0": {
    "clientID": "oFfbuQ1_WHsNIqAOxkP71SBfkmPjOsSV",
    "domain": "redman.auth0.com",
    "redirectUrl": "https://gus.rmcloud.com/login/auth0/callback"
  },

  "resultsPerPage": 20,
  "defaultH1": "Edmonton, AB Real Estate",
  "defaultLocationSlug": "edmonton",
  "defaultVals": {
    "low_price": 250000,
    "high_price": 400000
  },
  "panels": [
    {
      "name": "budgetRange",
      "config": {
        "maxPrice": 1000000,
        "interval": 50000
      }
    },

    {
      "name": "bedrooms",
      "config": true
    },

    {
      "name": "bathrooms",
      "config": true
    },

    {
      "name": "propertyTypes",
      "config": {
        "types": ["house", "condo", "townhouse", "land", "commercial", "rural", "mobile"]
      }
    },

    {
      "name": "minSqft",
      "config": {
        "maxSqft": 3000,
        "interval": 50
      }
    },

    {
      "name": "maxAge",
      "config": {
        "maxAge": 100,
        "interval": 1
      }
    },
    {
      "name": "gasFireplace",
      "config": false
    }
  ],
  "htmlMeta": {
    "h1": '%location%',
    "title": '%location% %bed% %bath% %type% For Sale',
    "description": '%count% %bed% %bath% %type% for sale in %location%, view listing photos, get notified about new %location% listings and find your right home.'
  },
  "tags": [
    {
      "name": "budgetRange",
      "config": true
    },

    {
      "name": "bedrooms",
      "config": true
    },

    {
      "name": "bathrooms",
      "config": true
    },

    {
      "name": "propertyTypes",
      "config": {
        "types": ["house", "condo", "townhouse", "land", "commercial", "rural", "mobile"]
      }
    }
  ],
  "preconfiguredSearches": {},
  "map": {
    "defaultPosition": {
      "centre_lat": 53.5555501,
      "centre_lon": -113.6340494,
      "zoom": 11
    },
    "zoomToEnhanceClusters": 13,
    "zoomToDoSearch": 15
  },
  "styles": {
    "backgroundColor": "white",
    "textColor": "#131313",
    "boxShadow": "0 0 10px #888",
    "primaryColor": "green",
    "primaryTextColor": "white",
    "lightTextColor": "#666",
    "titleFontFamily": "\"Crete Round\", Georgia, \"Times New Roman\", serif",
    "textFontFamily": "\"Open Sans\", Helvetica, Arial, sans-serif"
  }
}
