export const getCommutes = () => {
  let data = null
  let error = null

  chrome.runtime.sendMessage(
    {
      action: 'getCommutes',
    },
    response => {
      data = response.data
      error = response.error

      if (error) {
        console.error('Error loading commutes:', error)
        return
      }
      console.log('Commutes loaded:', data)
      return { data, error }
    },
  )
}
