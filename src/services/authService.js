import fetchApi from './apiService' // Asegúrate de importar la función fetchApi

// Obtener la URL del backend desde las variables de entorno
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

// Función para registrar usuario
export const registerUser = async (userData) => {
  try {
    const response = await fetchApi(
      `${backendUrl}/api/users/register`, // Usar la URL dinámica
      'POST',
      userData
    )
    return response // Retornar la respuesta del servidor
  } catch (error) {
    console.error(error)
    throw error // Lanzar el error para manejarlo en el componente
  }
}

// Función para iniciar sesión de usuario
export const loginUser = async (loginData) => {
  try {
    const response = await fetchApi(
      `${backendUrl}/api/users/login`, // Usar la URL dinámica
      'POST',
      loginData
    )
    return response // Retornar la respuesta del servidor
  } catch (error) {
    console.error(error)
    throw error // Lanzar el error para manejarlo en el componente
  }
}

// Función para obtener el perfil del usuario con manejo de expiración de token
export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token') // Recuperar el token del localStorage
    const response = await fetchApi(
      `${backendUrl}/api/users/${userId}`, // Usar la URL dinámica
      'GET',
      null,
      token
    ) // Aquí pasamos el token
    return response // Retornar los datos del perfil
  } catch (error) {
    console.error(error)
    throw error // Lanzar el error para manejarlo en el componente
  }
}