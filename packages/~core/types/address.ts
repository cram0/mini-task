/**
 * Types for address and commute preferences
 */

export interface CommutePreference {
  walking: number
  biking: number
  car: number
  transit: number
}

export interface AddressWithPreferences {
  address: string
  commutePrefs: CommutePreference
}
