// Formats minutes to H:MM
export const timeFormatter = (minutes: number) => {
  if (!minutes) return '0 min'

  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
