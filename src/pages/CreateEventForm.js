import '../styles/CreateEventForm.css'
import fetchApi from '../services/apiService'
import { createForm } from '../components/Form'
import { displayError, clearError } from '../utils/errorHandler'
import { showToast } from '../utils/notification' // Importamos la función de notificación

// Obtener la URL del backend desde las variables de entorno
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

function createEventForm() {
  const container = document.createElement('div')
  container.classList.add('create-event-container')

  const title = document.createElement('h1')
  title.textContent = 'Crear Nuevo Evento'
  container.appendChild(title)

  const errorMessage = document.createElement('div') // Elemento para mostrar errores
  errorMessage.classList.add('error-message') // Añadir clase CSS para estilo de error
  container.appendChild(errorMessage)

  // Definimos los campos del formulario
  const fields = [
    { type: 'text', name: 'title', label: 'Título del Evento' },
    { type: 'date', name: 'date', label: 'Fecha del Evento' },
    { type: 'text', name: 'location', label: 'Ubicación del Evento' },
    { type: 'textarea', name: 'description', label: 'Descripción del Evento' },
    {
      type: 'file',
      name: 'poster',
      label: 'Poster del Evento',
      accept: 'image/*'
    }
  ]

  // Función de envío del formulario
  const onSubmit = async (formDataObj) => {
    try {
      clearError(errorMessage) // Limpiar errores previos
      const token = localStorage.getItem('token')

      const formData = new FormData()
      Object.entries(formDataObj).forEach(([key, value]) => {
        if (key === 'poster' && value.files && value.files.length > 0) {
          console.log('Poster detectado:', value.files[0]) // Log para verificar el archivo
          formData.append(key, value.files[0]) // Añadimos el archivo del poster
        } else {
          console.log(`${key}: ${value}`) // Log de otros campos
          formData.append(key, value)
        }
      })

      // Verificar los datos que se están enviando
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`) // Log para verificar el contenido de FormData
      }

      // Enviar los datos al backend usando la URL dinámica
      await fetchApi(
        `${backendUrl}/api/events`, // Usar la URL del backend
        'POST',
        formData,
        token,
        true // Indicamos que estamos enviando FormData
      )

      // Mostrar notificación de éxito
      showToast('Evento creado con éxito!', 'success', 'center')

      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.navigateTo('/events') // Navegamos a la lista de eventos
      }, 1000)
    } catch (error) {
      console.error('Error al crear el evento:', error)

      // Mostrar notificación de error
      showToast(
        'Error al crear el evento. Intente de nuevo.',
        'error',
        'center'
      )

      // Mostrar mensaje de error en pantalla
      displayError(
        `No se pudo crear el evento: ${error.message}`,
        errorMessage,
        'form'
      )
    }
  }

  // Creamos el formulario reutilizando createForm
  const form = createForm(fields, onSubmit, 'event-form', 'Crear Evento')
  container.appendChild(form)

  return container
}

export default createEventForm
