import { getCommutes } from '@shared/lib/index'
import { addressService } from '~core/services'

const getSavedAddresses = async () => {
  const savedAddresses = await addressService.getSavedAddresses()
  return savedAddresses
}

const defaultCommutePrefs = [
  {
    address: 'Eindhoven, Netherlands',
    commutePrefs: {
      walking: 30,
      biking: 25,
      car: 35,
      transit: 50,
    },
  },
  {
    address: 'Amsterdam, Netherlands',
    commutePrefs: {
      walking: 20,
      biking: 15,
      car: 30,
      transit: 45,
    },
  },
  {
    address: 'Utrecht, Netherlands',
    commutePrefs: {
      walking: 20,
      biking: 25,
      car: 25,
      transit: 50,
    },
  },
]

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
  chrome.storage.local.set({
    savedAddresses: defaultCommutePrefs,
  })
  console.log('Initialized saved addresses in local storage')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request, sender)
  if (request.action === 'getCommutes') {
    getCommutes()
      .then(response => {
        sendResponse({ data: response.data, error: response.error })
      })
      .catch(error => {
        console.error('Error fetching commutes:', error)
        sendResponse({ error })
      })
    return true
  }

  if (request.action === 'getSavedAddresses') {
    getSavedAddresses()
      .then(savedAddresses => {
        console.log('savedAddresses', savedAddresses)
        sendResponse({ savedAddresses })
      })
      .catch(error => {
        console.error('Error fetching saved addresses:', error)
        sendResponse({ error })
      })

    return true
  }
})
