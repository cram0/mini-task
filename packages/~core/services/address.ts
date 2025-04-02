/// <reference types="chrome"/>
import type { AddressWithPreferences } from '~core/types/address'

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

const getSavedAddresses = async (): Promise<AddressWithPreferences[]> => {
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

const setSavedAddresses = async (addresses: AddressWithPreferences[]) => {
  const storage = getStorage()
  const addressesStr = JSON.stringify(addresses)
  await storage.set('savedAddresses', addressesStr)
}

const addAddress = async (address: AddressWithPreferences): Promise<void> => {
  const savedAddresses = await getSavedAddresses()
  const addresses = savedAddresses || []

  const addressExists = addresses.some(
    addr => JSON.stringify(addr) === JSON.stringify(address),
  )

  if (!addressExists) {
    addresses.push(address)
    await setSavedAddresses(addresses)
  }
}

const removeAddress = async (
  address: AddressWithPreferences,
): Promise<void> => {
  const savedAddresses = await getSavedAddresses()
  const addresses = savedAddresses || []

  const index = addresses.findIndex(
    addr => JSON.stringify(addr) === JSON.stringify(address),
  )

  if (index !== -1) {
    addresses.splice(index, 1)
    await setSavedAddresses(addresses)
  }
}

const addressService = {
  async getSavedAddresses(): Promise<AddressWithPreferences[]> {
    return await getSavedAddresses()
  },

  async addAddress(address: AddressWithPreferences): Promise<void> {
    await addAddress(address)
  },

  async removeAddress(address: AddressWithPreferences): Promise<void> {
    await removeAddress(address)
  },
}

export default addressService
