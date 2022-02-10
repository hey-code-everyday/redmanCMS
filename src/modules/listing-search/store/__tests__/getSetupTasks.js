
import getSetupTasks from '../getSetupTasks'

it('should get the time of the last update', () => {
  const tasks = getSetupTasks({})
  expect(tasks).toContainEqual(['lastUpdate'])
})

it('should get user info if the user is logged in', () => {
  const tasks = getSetupTasks({idToken: 'TOKEN'})
  expect(tasks).toContainEqual(['getUserInfo', 'TOKEN'])
})

it('should not get user info if the user is not logged in', () => {
  const tasks = getSetupTasks({})
  expect(tasks).not.toContainEqual(['getUserInfo', 'TOKEN'])
})

it('should get the geometry of a pre indexed shape if there is a pre indexed shape being accessed', () => {
  const tasks = getSetupTasks({
    idToken: 'TOKEN',
    geo: {
      "pre_indexed_shape.id": '1a2b3c4d',
      "pre_indexed_shape.index": 'kitchener',
      "type": "pre_indexed_shape"
    }
  })
  expect(tasks).toContainEqual(['preIndexedShape'])
})

it('should get a whosonfirst geometry if there is a wof being accessed', () => {
  const tasks = getSetupTasks({
    idToken: 'TOKEN',
    geo: {
      'whosonfirst.id': 85864847,
      'type': 'whosonfirst'
    }
  })
  expect(tasks).toContainEqual(['getGeo'])
})
