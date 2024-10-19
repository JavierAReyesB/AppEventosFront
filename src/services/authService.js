import fetchApi from './apiService'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

export const registerUser = async (userData) => {
  try {
    const response = await fetchApi(
      `${backendUrl}/api/users/register`,
      'POST',
      userData
    )
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const loginUser = async (loginData) => {
  try {
    const response = await fetchApi(
      `${backendUrl}/api/users/login`,
      'POST',
      loginData
    )
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetchApi(
      `${backendUrl}/api/users/${userId}`,
      'GET',
      null,
      token
    )
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}
