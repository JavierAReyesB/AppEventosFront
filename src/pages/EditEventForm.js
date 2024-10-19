import '../styles/EditEventForm.css'
import fetchApi from '../services/apiService'
import { createForm } from '../components/Form'
import { displayError, clearError } from '../utils/errorHandler'
import { showToast } from '../utils/notification'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

function editEventForm(eventId) {
  const container = document.createElement('div')
  container.classList.add('edit-event-container')

  const title = document.createElement('h1')
  title.textContent = 'Editar Evento'
  container.appendChild(title)

  const errorMessage = document.createElement('div')
  errorMessage.classList.add('error-message')
  container.appendChild(errorMessage)

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
      clearError(errorMessage)
      const token = localStorage.getItem('token')

      const formData = new FormData()

      for (let [key, value] of Object.entries(formDataObj)) {
        if (key === 'poster' && value.files && value.files.length > 0) {
          console.log('Poster seleccionado:', value.files[0])
          formData.append(key, value.files[0])
        } else {
          formData.append(key, value)
        }
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      await fetchApi(
        `${backendUrl}/api/events/${eventId}`,
        'PUT',
        formData,
        token,
        true
      )

      showToast('Evento editado con éxito!', 'success', 'center')

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

      showToast(
        'Error al editar el evento. Intente de nuevo.',
        'error',
        'center'
      )
    }
  }

  const form = createForm(fields, onSubmit, 'form-class', 'Guardar Cambios')
  container.appendChild(form)

  return container
}

export default editEventForm
