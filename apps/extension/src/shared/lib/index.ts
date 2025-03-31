import api from '~api'

const getCommutes = async () => {
  try {
    const { data, error } = await api.commute.durations.get()

    return { data, error }
  } catch (error) {
    console.error('Error fetching commutes in shared lib:', error)
    return { error: 'Failed to fetch commutes' }
  }
}

export { getCommutes }
