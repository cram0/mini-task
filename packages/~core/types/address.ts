/**
 * Types for address and commute preferences
 */

export interface CommutePreference {
  walking: number
  biking: number
  car: number
  publicTransport: number
}

export interface AddressWithPreferences {
  address: string
  commutePrefs: CommutePreference
}
