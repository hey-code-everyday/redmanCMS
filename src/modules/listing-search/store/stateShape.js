
export type State = {
  autocompleteSearchString: string,
  autocompleteWaiting: boolean,
  autocompleteResults: Array<Object>,
  panel: ?("filters" | "saveSearch" | "previousSearches"),
  anchor: ?string,

  filters: Object,
  geo: ?{
    type: "whosonfirst" | "pre_indexed_shape" | "location" | "circle" | "fake",
    locationTitle: string,
    centre_lat: ?number,
    centre_lon: ?number,
    raw: ?Array<string>,
    ['whosonfirst.id']: ?number,
    ['pre_indexed_shape.id']: ?string,
    ['pre_indexed_shape.index']: ?string
  },
  sort: string,

  searchWaiting: boolean,
  searchResults: Array<Object>,
  searchResultsDisclaimer: string,
  totalSearchResults: number,
  totalListingCount: number,
  totalResults: number,
  page: number,
  preconfiguredSearch: ?string,

  lock: boolean,
  idToken: ?string,
  userLoadState: number,
  faves: ?Array<string>,
  saved: ?Array<Object>,

  lastUpdate: ?string,

  map: {
    positionLoadState: number,
    userRequestedPosition: ?Object,
    realPosition: ?Object,
    markersLoadState: number,
    markers: ?Array<Object>,
    openProperty: ?string,
    drawMode: boolean
  },

  config: Object
}
