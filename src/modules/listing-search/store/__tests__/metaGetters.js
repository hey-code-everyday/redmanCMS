import metaGetters, {helpers} from '../metaGetters'
import state from './state.json'
import deepFreeze from 'deep-freeze'
import cloneDeep from 'lodash/cloneDeep'

deepFreeze(state)

const {meta, robots, pageTitle} = metaGetters
const {location, type, bed, bath} = helpers

const config = {
  rootUrl: '/search',
  resultsPerPage: 100,
  defaultH1: 'Edmonton, AB Real Estate',

  preconfiguredSearches: {
    'new-pads': {
      'filters': {
        'property_types': 'house|condo',
        'construction_age': 'now-1y/d',
        'raw': 'new'
      },
      htmlMeta: {
        h1: 'New Pads in Halifax',
        title: 'New Pads',
        description: 'New Pads custom description'
      }
    },
    'southeast-pads': {
      nicename: 'Halifax Southeast Pads',
      'filters': {
        'property_types': 'house|condo',
        'construction_age': 'now-1y/d',
        'raw': 'southeast'
      }
    }
  },

  htmlMeta: {
    h1: '%location%',
    title: '%location% %bed% %bath% %type% For Sale',
    description: '%count% %bed% %bath% %type% for sale in %location%, view listing photos, get notified about new %location% listings and find your right home.'
  }
}

describe('location', () => {
  it('should return the set locationTitle if present', () => {
    const result = location(state)
    expect(result).toEqual('Inglewood, Edmonton, AB')
  })

  it('should return the locationTitle of the defaultGeo in config if present', () => {
    const _state = cloneDeep(state)
    _state.geo = null
    _state.config.defaultGeo = {locationTitle: 'Edmonton Region'}
    expect(location(_state)).toEqual('Edmonton Region')
  })

  it('should return the defaultH1 for the site if nothing else is available', () => {
    const _state = cloneDeep(state)
    _state.geo = null
    expect(location(_state)).toEqual('Edmonton, AB')
  })
})

describe('type', () => {
  it('should return Real Estate & Homes when no filters are set', () => {
    const _state = cloneDeep(state)
    _state.filters = {}
    expect(type(_state)).toEqual('Real Estate & Homes')
  })

  it('should return Homes if we are looking for Homes with bedrooms', () => {
    const _state = cloneDeep(state)
    _state.filters = {bedrooms: '2p'}
    expect(type(_state)).toEqual('Homes')
  })

  it('should return Homes if we are looking for Homes with bathrooms', () => {
    const _state = cloneDeep(state)
    _state.filters = {bathrooms: '2p'}
    expect(type(_state)).toEqual('Homes')
  })

  it('should return Homes if we are looking for a House', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'house'}
    expect(type(_state)).toEqual('Homes')
  })

  it('should return Condos if we are looking for a Condo', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'condo'}
    expect(type(_state)).toEqual('Condos')
  })

  it('should return Townhouses if we are looking for a Townhouse', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'townhouse'}
    expect(type(_state)).toEqual('Townhouses')
  })

  it('should return Land if we are looking for Land', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'land'}
    expect(type(_state)).toEqual('Land')
  })

  it('should return Commercial Real Estate if are looking for Commercial', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'commercial'}
    expect(type(_state)).toEqual('Commercial Real Estate')
  })

  it('should return Rural Real Estate if we are looking for Rural Real Estate', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'rural'}
    expect(type(_state)).toEqual('Rural Real Estate')
  })

  it('should return Mobile Homes if we are looking for Mobile', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'mobile'}
    expect(type(_state)).toEqual('Mobile Homes')
  })

  it('should return Homes if we are looking for more than one property type', () => {
    const _state = cloneDeep(state)
    _state.filters = {property_types: 'mobile|commercial'}
    expect(type(_state)).toEqual('Homes')
  })
})

describe('bed', () => {
  it('should return 3 bedroom if we are looking for houses with 3 bedrooms', () => {
    const _state = cloneDeep(state)
    _state.filters = {bedrooms: '3p'}
    expect(bed(_state)).toEqual('3 bedroom')
  })

  it('should return an empty string if bedroom filter is 0 or null', () => {
    const _state = cloneDeep(state)
    _state.filters = {bedrooms: null}
    expect(bed(_state)).toEqual('')
  })
})

describe('bath', () => {
  it('should return 3 bathroom if we are looking for houses with 3 bedrooms', () => {
    const _state = cloneDeep(state)
    _state.filters = {bathrooms: '3p'}
    expect(bath(_state)).toEqual('3 bathroom')
  })

  it('should return an empty string if bathroom filter is 0 or null', () => {
    const _state = cloneDeep(state)
    _state.filters = {bathrooms: null}
    expect(bath(_state)).toEqual('')
  })
})

describe('meta', () => {
  it('should interpolate the variables into the template and remove extra spaces', () => {
    const _state = cloneDeep(state)
    _state.config = config
    const result = meta(_state)('title')
    expect(result).toEqual('Inglewood, Edmonton, AB Real Estate & Homes For Sale')
  })

  it('should allow preconfigured searches to override the generated text', () => {
    const _state = cloneDeep(state)
    _state.preconfiguredSearch = 'new-pads'
    _state.config = config
    const result = meta(_state)('h1')
    expect(result).toEqual('New Pads in Halifax')
  })

  it('should use the template if there is no meta for the preconfiguredSearch', () => {
    const _state = cloneDeep(state)
    _state.preconfiguredSearch = 'southeast-pads'
    _state.config = config
    const result = meta(_state)('title')
    expect(result).toEqual('Inglewood, Edmonton, AB Real Estate & Homes For Sale')
  })

  it('should throw if a variable is included in the template that doesnt exist', () => {
    const _config = cloneDeep(config)
    _config.htmlMeta.title = '%foo%'
    const _state = cloneDeep(state)
    _state.config = _config
    expect(() => meta(_state)('title')).toThrow('htmlMeta template variable foo is not allowed')
  })
})

describe('pageTitle', () => {
  it('should use the preconfigured search title if there is one', () => {
    const newState = Object.assign({}, state, {preconfiguredSearch: 'new-pads'}, {config})
    const result = pageTitle(newState)
    expect(result).toEqual('New Pads')
  })

  it('should use the preconfigured search nicename if one has been provided', () => {
    const newState = Object.assign({}, state, {preconfiguredSearch: 'southeast-pads'}, {config})
    const result = pageTitle(newState)
    expect(result).toEqual('Halifax Southeast Pads')
  })

  it('should fall back if the preconfigured search does not exist', () => {
    const newState = Object.assign({}, state, {preconfiguredSearch: 'foo-bar'}, {config})
    return expect(() =>
      pageTitle(newState)
    ).not.toThrow()
  })

  it('should use the location title as long as there is one', () => {
    const newState = Object.assign({}, state, {config})
    const result = pageTitle(newState)
    expect(result).toEqual('Inglewood, Edmonton, AB')
  })

  it('should return the default title if there is no location title', () => {
    const newState = Object.assign({}, state, {geo: null, config})
    const result = pageTitle(newState)
    expect(result).toEqual('Edmonton, AB Real Estate')
  })
})

describe('robots', () => {
  it('should index preconfigured searches', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.preconfiguredSearch = 'new-pads'
    expect(robots(_state)).toEqual('index,follow')
  })

  it('should not index a PCS that is not defined in config', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.preconfiguredSearch = 'foo'
    expect(robots(_state)).toEqual('noindex,follow')
  })

  it('should index searches when no property_types are selected', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.filters = {}
    expect(robots(_state)).toEqual('index,follow')
  })

  it('should index searches when only one property_type is selected', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.filters = {property_types: 'house'}
    expect(robots(_state)).toEqual('index,follow')
  })

  it('should otherwise not index the search if more than one property_type is selected', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.filters = {property_types: 'house|condo'}
    expect(robots(_state)).toEqual('noindex,follow')
  })

  it('should not index searches if ANY other filter is defined', () => {
    const _state = cloneDeep(state)
    _state.config = config
    expect(robots(_state)).toEqual('noindex,follow')
  })

  it('should not index searches when on a geo location', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.filters = {}
    _state.geo = {locationTitle: 'Holyrood Road NW', type: 'location'}
    expect(robots(_state)).toEqual('noindex,follow')
  })

  it('should not index if geo is null', () => {
    const _state = cloneDeep(state)
    _state.config = config
    _state.filters = {}
    _state.geo = null
    expect(robots(_state)).toEqual('index,follow')
  })
})
