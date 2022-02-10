import {
  getFaves,
  getSaved,
  fave,
  saveSearch,
  getSavedFilters
} from '../profile'

const config = {
  gusApi: 'http://example.com/',
  sources: ['idx-edm-v5'],
  token: 'my-token',
  resultsPerPage: 100,
  spaceID: 'rwp-1937',

  autocomplete: {
    distance: 20
  }
}

describe('getFaves', () => {
  const ticket = getFaves({idToken: 'my-token', config})
  it('place the token', () => {
    expect(ticket.headers).toHaveProperty('token', 'my-token')
  })
})

describe('getSaved', () => {
  const ticket = getSaved({idToken: 'my-token', config})
  it('place the token', () => {
    expect(ticket.headers).toHaveProperty('token', 'my-token')
  })
})

describe('toggleFave', () => {
  const ticket = fave({faves: [], idToken: 'my-token', config}, ['E12345', 'foo'])
  it('place the token', () => {
    expect(ticket.headers).toHaveProperty('token', 'my-token')
  })

  it('should append the MLS# to the URL', () => {
    expect(ticket).toHaveProperty('url', 'http://example.com/space/rwp-1937/profile/likes/idx-edm-v5/E12345')
  })
})

describe('saveSearch', () => {
  const ticket = saveSearch({
    idToken: 'my-token',
    filters: {low_price: 100, high_price: 200},
    config
  }, 'My Saved Search')
  it('place the token', () => {
    expect(ticket.headers).toHaveProperty('token', 'my-token')
  })

  it('should build filters and put them in the query', () => {
    expect(ticket.query).toHaveProperty('low_price', 100)
    expect(ticket.query).toHaveProperty('high_price', 200)
  })

  it('also place uiState in the body', () => {
    expect(ticket.body).toHaveProperty('uiState', {filters: {
      low_price: 100,
      high_price: 200
    }})
  })

  it('should also place the name in the body', () => {
    expect(ticket.body).toHaveProperty('name', 'My Saved Search')
  })
})

describe('getSavedFilters', () => {
  const ticket = getSavedFilters({
    idToken: 'my-token',
    config
  }, 'id123')
  it('place the token', () => {
    expect(ticket.headers).toHaveProperty('token', 'my-token')
  })

  it('should place the id in the URL', () => {
    expect(ticket).toHaveProperty('url', 'http://example.com/space/rwp-1937/profile/searches/idx-edm-v5/id/id123')
  })
})
