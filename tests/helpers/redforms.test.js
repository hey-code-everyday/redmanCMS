/* eslint-disable */

const { makeFormName, getFormName, mapAvailableForms } = require('../../src/helpers/redforms')

test('generated form name works', () => {
  const formID = 'my-test-form-name'
  const expects = 'My Test Form Name'

  const result = makeFormName(formID)

  expect(result).toEqual(expects)
})

test('mapped form name works', () => {
  const formID = 'gus-details-more-info'
  const expects = 'Listing Details (More Info)'

  const result = getFormName(formID)

  expect(result).toEqual(expects)
})

test('unmapped form name works', () => {
  const formID = 'my-test-form-name'
  const expects = 'My Test Form Name'

  const result = getFormName(formID)

  expect(result).toEqual(expects)
})

test('broken name works', () => {
  const formID = 'my--test-form----name-'
  const expects = 'My Test Form Name'

  const result = getFormName(formID)

  expect(result).toEqual(expects)
})

test('mapped form list is formatted properly', () => {
  const exampleResponse = {
    "stock": [
      "relocating-to",
      "gus-details-more-info",
    ],
    "custom": [
      {
        "id": "2a1b1a08-39f7-4fc1-b385-4c7ce011f565",
        "name": "gus-details-more-info"
      }
    ]
  }

  const expects = [
    { formID: 'stock/relocating-to', name: 'Relocating To' },
    { formID: 'stock/gus-details-more-info', name: 'Listing Details (More Info)' },
    { formID: '2a1b1a08-39f7-4fc1-b385-4c7ce011f565', name: 'Gus Details More Info' }
  ]

  const result = mapAvailableForms(exampleResponse)

  expect(result).toEqual(expects)
})
