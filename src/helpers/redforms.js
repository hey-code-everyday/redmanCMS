import api from '../api'
import mapToDropdown from './map-to-dropdown'

const formNames = {
  'gus-details-request-showing': 'Listing Details (Request Showing)',
  'gus-details-more-info': 'Listing Details (More Info)'
}

export function getFormName (formID) {
  if (formNames[formID]) return formNames[formID]
  return makeFormName(formID)
}

export function makeFormName (formID) {
  formID = formID.replace(/-{2,}/g, '-').replace(/-$/g, '')

  return formID.split('-').map(word => {
    return word[0].toUpperCase() + word.substr(1)
  }).join(' ')
}

export function mapAvailableForms (response) {
  const forms = []

  // Stock forms
  response.stock.forEach(formID => {
    forms.push({ formID: 'stock/' + formID, name: getFormName(formID) })
  })

  // Custom forms
  response.custom.forEach(form => {
    forms.push({ formID: form.id, name: makeFormName(form.name) })
  })

  return forms
}

export function getAvailableForms (state, forDropdown) {
  return new Promise((resolve, reject) => {
    api.getForms(state).then(response => {
      if (response.status === 200 && response.body) {
        const forms = forDropdown
          ? mapToDropdown(mapAvailableForms(response.body), 'formID', 'name')
          : mapAvailableForms(response.body)
        resolve(forms)
      }
      reject(new Error('Error fetching forms.'))
    }).catch(err => {
      reject(err)
    })
  })
}
