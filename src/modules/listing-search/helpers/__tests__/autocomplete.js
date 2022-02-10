import {sort} from '../autocomplete'

const autocompleteResults = [
  {
    'centre_lat': -113.62222,
    'centre_lon': 53.64722,
    'distance': '14.300128803519387',
    'locationTitle': 'Inglewood, AB',
    'type': 'locality',
    'whosonfirst_id': '5983199'
  },
  {
    'bbox': [
      -113.629353356,
      53.6368334379,
      -113.613771359,
      53.6540880967
    ],
    'centre_lat': -113.622185,
    'centre_lon': 53.647018,
    'distance': '14.285755289693101',
    'locationTitle': 'Inglewood, St. Albert, AB',
    'type': 'neighbourhood',
    'whosonfirst_id': '85894555'
  },
  {
    'bbox': [
      -113.551449325,
      53.5588931741,
      -113.530896541,
      53.5703197598
    ],
    'centre_lat': -113.541235,
    'centre_lon': 53.564579,
    'distance': '15.41937875193557',
    'locationTitle': 'Inglewood, Edmonton, AB',
    'type': 'neighbourhood',
    'whosonfirst_id': '85864901'
  }
]

describe('sort', () => {
  const sorted = sort(autocompleteResults)

  it('should sort results into a single object', () => {
    expect(sorted.neighbourhood).toHaveLength(2)
    expect(sorted.locality).toHaveLength(1)
  })

  it('should leave the keys blank when there are no results', () => {
    expect(sorted).not.toHaveProperty('address')
  })

  it('should also keep them in a single array ordered by the order in keys', () => {
    expect(sorted.all).toHaveLength(3)
    expect(sorted.all[0]).toEqual(autocompleteResults[1])
  })

  it('should include the total of all types', () => {
    expect(sorted.total).toEqual(3)
  })
})
