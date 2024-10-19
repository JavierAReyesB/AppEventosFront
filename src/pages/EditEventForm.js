import '../styles/EditEventForm.css'
import fetchApi from '../services/apiService'
import { createForm } from '../components/Form'
import { displayError, clearError } from '../utils/errorHandler'
import { showToast } from '../utils/notification' // Importar la función de notificación

// Obtener la URL del backend desde las variables de entorno
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

function editEventForm(eventId) {
  const container = document.createElement('div')
  container.classList.add('edit-event-container')

  const title = document.createElement('h1')
  title.textContent = 'Editar Evento'
  container.appendChild(title)

  const errorMessage = document.createElement('div') // Elemento para mostrar errores
  errorMessage.classList.add('error-message') // Clase CSS para estilo de error
  container.appendChild(errorMessage)

  // Configuramos los campos del formulario utilizando la función createForm
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

  const onSubmit = async (formDataObj) => {
    try {
      clearError(errorMessage) // Limpiar cualquier error previo
      const token = localStorage.getItem('token')

      // Crear una instancia de FormData
      const formData = new FormData()

      // Rellenar el FormData con los valores del formulario
      for (let [key, value] of Object.entries(formDataObj)) {
        if (key === 'poster' && value.files && value.files.length > 0) {
          console.log('Poster seleccionado:', value.files[0])
          formData.append(key, value.files[0]) // Añadir el archivo de la imagen al FormData
        } else {
          formData.append(key, value) // Añadir otros campos al FormData
        }
      }

      // Verificación en consola de los datos que se están enviando
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      // Realizamos la solicitud PUT para editar el evento
      await fetchApi(
        `${backendUrl}/api/events/${eventId}`, // Usamos el eventId y la URL del backend
        'PUT', // Método PUT para editar
        formData,
        token,
        true // Indicamos que estamos enviando FormData
      )

      // Mostrar notificación de éxito
      showToast('Evento editado con éxito!', 'success', 'center')

      // Redirigir al usuario después de un tiempo
      setTimeout(() => {
        window.navigateTo('/events')
      }, 1000)
    } catch (error) {
      console.error('Error al editar el evento:', error)
      displayError(
        `No se pudo editar el evento: ${error.message}`,
        errorMessage,
        'form'
      )

      // Mostrar notificación de error
      showToast(
        'Error al editar el evento. Intente de nuevo.',
        'error',
        'center'
      )
    }
  }

  // Usamos createForm para generar el formulario
  const form = createForm(fields, onSubmit, 'form-class', 'Guardar Cambios')
  container.appendChild(form)

  return container
}

export default editEventForm
