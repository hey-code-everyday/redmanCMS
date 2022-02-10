import getters from '../getters'
import {encodeUrl} from '../url'
import state from './state.json'
import deepFreeze from 'deep-freeze'
import clone from 'lodash/clone'

deepFreeze(state)

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
      }
    }
  }
}

describe('filterValues', () => {
  it('should return a function', () => {
    const result = getters.filterValues(state)
    expect(result).toBeInstanceOf(Function)
  })

  it('that function should return an object containing the requested keys', () => {
    const result = getters.filterValues(state)(['low_price'])
    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('low_price')
  })

  it('should return a default if the requested property is undefined', () => {
    const result = getters.filterValues(state)(['foo'], [0])
    expect(result).toHaveProperty('foo', 0)
  })

  it('should return a default if the requested property is null', () => {
    const newState = Object.assign({}, state, {foo: null})
    const result = getters.filterValues(newState)(['foo'], [0])
    expect(result).toHaveProperty('foo', 0)
  })

  it('should return null if the requested property is undefined and no default is provided', () => {
    const result = getters.filterValues(state)(['foo'])
    expect(result).toHaveProperty('foo', null)
  })

  it('should work for a single value and return a single value', () => {
    const result = getters.filterValues(state)('low_price')
    expect(result).toEqual('400')
  })

  it('should work for a single value with a default', () => {
    const result = getters.filterValues(state)('foo', 0)
    expect(result).toEqual(0)
  })
})

describe('userSetRaw', () => {
  it('should return an array of raw fields', () => {
    const _state = Object.assign({}, state, {
      filters: {
        userSetRaw: ['LM_Char_1_10:[boardinghouse]']
      }
    })
    deepFreeze(_state)
    const result = getters.userSetRaw(_state)
    expect(result).toHaveLength(1)
  })

  it('should return an empty array if the raw field is not set', () => {
    const result = getters.userSetRaw(state)
    expect(result).toHaveLength(0)
  })

  it('should return an array if the raw field is a string', () => {
    const _state = Object.assign({}, state, {
      filters: {
        userSetRaw: 'LM_Char_1_10:[boardinghouse]'
      }
    })
    deepFreeze(_state)
    const result = getters.userSetRaw(_state)
    expect(result).toHaveLength(1)
  })
})

describe('userSetRawValue', () => {
  const _state = Object.assign({}, state, {
    filters: {
      userSetRaw: ['LM_Char_1_10:boardinghouse']
    }
  })

  it('should return the value from a raw field', () => {
    deepFreeze(_state)
    const result = getters.userSetRawValue(_state)('LM_Char_1_10')
    expect(result).toEqual('boardinghouse')
  })

  it('should not return the square brackets if they are part of the value', () => {
    const _state = Object.assign({}, state, {
      filters: {
        userSetRaw: ['LM_Char_1_10:[boardinghouse]']
      }
    })
    deepFreeze(_state)
    const result = getters.userSetRawValue(_state)('LM_Char_1_10')
    expect(result).toEqual('boardinghouse')
  })

  it('should return an empty string if the raw field is not set', () => {
    const _state = Object.assign({}, state, {
      filters: {
        userSetRaw: []
      }
    })
    deepFreeze(_state)
    const result = getters.userSetRawValue(_state)('LM_Char_1_10')
    expect(result).toEqual('')
  })

  it('should return an empty string if the userSetRaw filter is not set at all', () => {
    const result = getters.userSetRawValue(state)('LM_Char_1_10')
    expect(result).toEqual('')
  })
})

describe('totalPages', () => {
  it('should give us the total pages necessary to display all results', () => {
    const newState = Object.assign({}, state, {totalSearchResults: 150, config})
    const result = getters.totalPages(newState)()
    expect(result).toEqual(2)
  })

  it('should handle the case of there being 0 search results', () => {
    const newState = Object.assign({}, state, {totalSearchResults: 0, config})
    const result = getters.totalPages(newState)()
    expect(result).toEqual(0)
  })
})

describe('hasPrevPage', () => {
  it('should return a function', () => {
    const result = getters.hasPrevPage(state)
    expect(result).toBeInstanceOf(Function)
  })

  it('should be false if the current page is 0', () => {
    const result = getters.hasPrevPage(state)()
    expect(result).toBeFalsy()
  })

  it('should be true if the current page is a positive integer', () => {
    const newState = Object.assign({}, state, {page: 1})
    const result = getters.hasPrevPage(newState)()
    expect(result).toBeTruthy()
  })
})

describe('hasNextPage', () => {
  it('should return a function', () => {
    const result = getters.hasNextPage(state)
    expect(result).toBeInstanceOf(Function)
  })

  it('should be false if there are no more results', () => {
    const newState = Object.assign({}, state, {page: 1, config})
    const result = getters.hasNextPage(newState)()
    expect(result).toBeFalsy()
  })

  it('should be true if there are more results', () => {
    const newState = Object.assign({}, state, {page: 0, config})
    const result = getters.hasNextPage(newState)()
    expect(result).toBeTruthy()
  })
})

describe('savedSearchTitle', () => {
  it('should join all the sidebar titles together with the location, separated with commas', () => {
    const newState = Object.assign({}, state, {config})
    const result = getters.savedSearchTitle(newState)()
    expect(result).toEqual('Inglewood, Edmonton, AB, $400 - $1K')
  })

  it('should just do "My Saved Search" if nothing is set', () => {
    const newState = {config, filters: {}, geo: null}
    const result = getters.savedSearchTitle(newState)()
    expect(result).toEqual('My Saved Search')
  })
})

describe('uniqueSavedSearchTitle', () => {
  it('should return the page title if there are no saved searches', () => {
    const newState = Object.assign({}, state, {config})
    const result = getters.uniqueSavedSearchTitle(newState)('Inglewood, Edmonton, AB Real Estate')
    expect(result).toEqual('Inglewood, Edmonton, AB Real Estate')
  })

  it('should return page title with a (2) afterwards if that search result already exists', () => {
    const newState = Object.assign({}, state, {
      saved: [{id: '12345', name: 'Inglewood, Edmonton, AB Real Estate'}],
      config
    })
    const result = getters.uniqueSavedSearchTitle(newState)('Inglewood, Edmonton, AB Real Estate')
    expect(result).toEqual('Inglewood, Edmonton, AB Real Estate (2)')
  })

  it('keep incrementing the appended part of the title', () => {
    const newState = Object.assign({}, state, {
      saved: [
        {id: '12345', name: 'Inglewood, Edmonton, AB Real Estate'},
        {id: '67890', name: 'Inglewood, Edmonton, AB Real Estate (2)'}
      ],
      config
    })
    const result = getters.uniqueSavedSearchTitle(newState)('Inglewood, Edmonton, AB Real Estate')
    expect(result).toEqual('Inglewood, Edmonton, AB Real Estate (3)')
  })
})

describe('urlAfterMutation', () => {
  const stateWithConfig = {...state, filters: {}, config}
  const result = getters.urlAfterMutation(stateWithConfig)('setPage', 1)

  it('should return what the url will be after mutating the state', () => {
    expect(result).toEqual('/search/geo/wof/85864901/?page=2&sort=list_date_des')
  })

  it('should preserve the original state', () => {
    expect(encodeUrl(stateWithConfig)).toEqual('/search/geo/wof/85864901/?sort=list_date_des')
  })

  it('should throw if an undefined mutation name is passed', () => {
    expect(() => {
      getters.urlAfterMutation(stateWithConfig)('foobar')
    }).toThrow('No mutation named foobar')
  })
})

describe('preconfiguredSearchName', () => {
  it('should return the nicename if there is one', () => {
    const config = {
      rootUrl: '/search',
      resultsPerPage: 100,
      defaultH1: 'Edmonton, AB Real Estate',

      preconfiguredSearches: {
        'new-pads': {
          nicename: 'New Halifax Pads',
          filters: {
            property_types: 'house|condo',
            construction_age: 'now-1y/d',
            raw: 'new'
          }
        }
      }
    }
    const stateWithConfig = {...state, config}
    const result = getters.preconfiguredSearchName(stateWithConfig)('new-pads')
    expect(result).toEqual('New Halifax Pads')
  })

  it('should otherwise deslugify the slug', () => {
    const config = {
      rootUrl: '/search',
      resultsPerPage: 100,
      defaultH1: 'Edmonton, AB Real Estate',

      preconfiguredSearches: {
        'new-pads': {
          filters: {
            property_types: 'house|condo',
            construction_age: 'now-1y/d',
            raw: 'new'
          }
        }
      }
    }
    const stateWithConfig = {...state, config}
    const result = getters.preconfiguredSearchName(stateWithConfig)('new-pads')
    expect(result).toEqual('New Pads')
  })

  it('should throw if the preconfigured search does not exist', () => {
    const config = {
      rootUrl: '/search',
      resultsPerPage: 100,
      defaultH1: 'Edmonton, AB Real Estate',

      preconfiguredSearches: {
        'new-pads': {
          filters: {
            property_types: 'house|condo',
            construction_age: 'now-1y/d',
            raw: 'new'
          }
        }
      }
    }
    const stateWithConfig = {...state, config}
    expect(() => {
      getters.preconfiguredSearchName(stateWithConfig)('foo')
    }).toThrow('Undefined preconfigured search foo')
  })
})
