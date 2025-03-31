/// <reference types="chrome"/>

const isExtension = () => {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.storage !== 'undefined' &&
    typeof chrome.storage.local !== 'undefined'
  )
}

const getStorage = () => {
  if (isExtension()) {
    return {
      get: async (key: string) => {
        try {
          const result = await chrome.storage.local.get(key)
          return result[key] || null
        } catch (e) {
          console.error('Extension storage error:', e)
          return null
        }
      },
      set: async (key: string, value: string) => {
        try {
          await chrome.storage.local.set({ [key]: value })
          return true
        } catch (e) {
          console.error('Extension storage error:', e)
          return false
        }
      },
    }
  }

  // Fallback to localStorage
  return {
    get: (key: string) => {
      try {
        return localStorage.getItem(key)
      } catch (e) {
        console.error('LocalStorage error:', e)
        return null
      }
    },
    set: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value)
        return true
      } catch (e) {
        console.error('LocalStorage error:', e)
        return false
      }
    },
  }
}

const getSavedAddresses = async (): Promise<string[]> => {
  const storage = getStorage()
  const savedAddresses = await storage.get('savedAddresses')

  if (!savedAddresses) {
    return []
  }

  try {
    return typeof savedAddresses === 'string'
      ? JSON.parse(savedAddresses)
      : savedAddresses
  } catch (e) {
    console.error('Error parsing saved addresses', e)
    return []
  }
}

const setSavedAddresses = async (addresses: string[]) => {
  const storage = getStorage()
  const addressesStr = JSON.stringify(addresses)
  await storage.set('savedAddresses', addressesStr)
}

const addAddress = async (address: string) => {
  const savedAddresses = await getSavedAddresses()
  const addresses = savedAddresses || []
  if (!addresses.includes(address)) {
    addresses.push(address)
    await setSavedAddresses(addresses)
  }
}

const removeAddress = async (address: string) => {
  const savedAddresses = await getSavedAddresses()
  const addresses = savedAddresses || []
  const index = addresses.indexOf(address)
  if (index !== -1) {
    addresses.splice(index, 1)
    await setSavedAddresses(addresses)
  }
}

export default {
  getSavedAddresses,
  setSavedAddresses,
  addAddress,
  removeAddress,
}
