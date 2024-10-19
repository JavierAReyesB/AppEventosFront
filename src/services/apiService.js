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

    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    } else if (body instanceof FormData) {
      options.body = body
    }

    const response = await fetch(url, options)

    if (response.status === 204 || method === 'DELETE') {
      return null
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud al servidor.')
      }

      return data
    } else {
      const textResponse = await response.text()
      throw new Error(
        `El servidor devolvió un contenido inesperado: ${textResponse}`
      )
    }
  } catch (error) {
    handleError(error)
  }
}

const handleError = (error) => {
  console.error('Error en la solicitud:', error.message)
  throw new Error(
    'Hubo un problema con la solicitud. Por favor, intenta de nuevo más tarde.'
  )
}

export default fetchApi
