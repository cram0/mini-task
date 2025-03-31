import { getCommutes } from '@shared/lib/index'
import { addressService } from '~core/services'

const getSavedAddresses = async () => {
  const savedAddresses = await addressService.getSavedAddresses()
  return savedAddresses
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
  chrome.storage.local.set({ savedAddresses: [] })
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
