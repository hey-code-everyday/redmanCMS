
import {autocomplete, search} from '../src'

const config = {
  gusApi: 'http://example.com/',
  sources: ['idx-edm-v5'],
  spaceID: 'myspace',
  resultsPerPage: 100,

  autocomplete: {
    distance: 20
  }
}

describe('autocompleteTicket', () => {
  const ticket = autocomplete({config}, 'foo')
  it('should place the search string at the end of the URL', () => {
    expect(ticket).toHaveProperty('url', 'http://example.com/idx-edm-v5/autocomplete-v2/foo')
  })

  it('should append the focus parameters to the query', () => {
    expect(ticket.query).toHaveProperty('distance', 20)
  })
})

describe('searchTicket', () => {
  const ticket = search({
    filters: {low_price: 100000},
    sort: 'list_date_des',
    config
  })
  it('should call the q method of the API', () => {
    expect(ticket).toHaveProperty('url', 'http://example.com/space/myspace/search/idx-edm-v5/q')
  })

  it('should place the filters in the query', () => {
    expect(ticket.query).toHaveProperty('low_price', 100000)
  })
})
