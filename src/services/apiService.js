const fetchApi = async (url, method = 'GET', body = null, token = null) => {
  try {
    const headers = {}

    // Si hay token, agregar encabezado de autorización
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const options = {
      method,
      headers
    }

    // Si el cuerpo es un objeto, asegurar que se envíe como JSON
    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    } else if (body instanceof FormData) {
      options.body = body // Si es FormData, asignarlo directamente
    }

    const response = await fetch(url, options)

    // Manejo de respuestas sin contenido (status 204) o métodos DELETE
    if (response.status === 204 || method === 'DELETE') {
      return null
    }

    // Verificar el tipo de contenido de la respuesta
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      // Manejar respuesta no exitosa (status 4xx o 5xx)
      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud al servidor.')
      }

      return data
    } else {
      // Si el contenido no es JSON, lanzar un error adecuado
      const textResponse = await response.text()
      throw new Error(
        `El servidor devolvió un contenido inesperado: ${textResponse}`
      )
    }
  } catch (error) {
    // Centralizamos el manejo de errores
    handleError(error)
  }
}

// Función centralizada para manejar los errores
const handleError = (error) => {
  // Registrar error en consola para depuración
  console.error('Error en la solicitud:', error.message)

  // Re-lanzar el error para ser manejado en los componentes o lógica superior
  throw new Error(
    'Hubo un problema con la solicitud. Por favor, intenta de nuevo más tarde.'
  )
}

export default fetchApi
