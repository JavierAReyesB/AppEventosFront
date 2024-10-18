const fetchApi = async (url, method = 'GET', body = null, token = null) => {
  try {
    const headers = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const options = {
      method,
      headers
    }

    // Si el cuerpo de la solicitud es un objeto FormData, no establecer 'Content-Type'
    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    } else if (body instanceof FormData) {
      options.body = body // Si es FormData, asignarlo directamente
    }

    const response = await fetch(url, options)

    // Si el método es DELETE o la respuesta no tiene contenido, no intentamos parsear el JSON
    if (response.status === 204 || method === 'DELETE') {
      return null // No hay cuerpo que parsear
    }

    // Verifica el tipo de contenido de la respuesta
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud')
      }

      return data
    } else {
      // Si el contenido no es JSON, lanzar un error adecuado
      const textResponse = await response.text() // Obtiene la respuesta como texto
      throw new Error(
        `El servidor devolvió un contenido inesperado: ${textResponse}`
      )
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

export default fetchApi
