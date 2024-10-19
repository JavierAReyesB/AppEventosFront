import '../styles/CreateEventForm.css'
import fetchApi from '../services/apiService'
import { createForm } from '../components/Form'
import { displayError, clearError } from '../utils/errorHandler'
import { showToast } from '../utils/notification'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

function createEventForm() {
  const container = document.createElement('div')
  container.classList.add('create-event-container')

  const title = document.createElement('h1')
  title.textContent = 'Crear Nuevo Evento'
  container.appendChild(title)

  const errorMessage = document.createElement('div')
  errorMessage.classList.add('error-message')
  container.appendChild(errorMessage)

  const fields = [
    {
      type: 'text',
      name: 'title',
      label: 'Título del Evento',
      placeholder: 'Ingresa el título del evento'
    },
    {
      type: 'date',
      name: 'date',
      label: 'Fecha del Evento'
    },
    {
      type: 'text',
      name: 'location',
      label: 'Ubicación del Evento',
      placeholder: 'Ingresa la ubicación del evento'
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Descripción del Evento',
      placeholder: 'Escribe una breve descripción del evento'
    },
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
      Object.entries(formDataObj).forEach(([key, value]) => {
        if (key === 'poster' && value.files && value.files.length > 0) {
          formData.append(key, value.files[0])
        } else {
          formData.append(key, value)
        }
      })

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      await fetchApi(`${backendUrl}/api/events`, 'POST', formData, token, true)

      showToast('Evento creado con éxito!', 'success', 'center')

      setTimeout(() => {
        window.navigateTo('/events')
      }, 1000)
    } catch (error) {
      console.error('Error al crear el evento:', error)
      showToast(
        'Error al crear el evento. Intente de nuevo.',
        'error',
        'center'
      )
      displayError(
        `No se pudo crear el evento: ${error.message}`,
        errorMessage,
        'form'
      )
    }
  }

  const form = createForm(fields, onSubmit, 'event-form', 'Crear Evento')
  container.appendChild(form)

  return container
}

export default createEventForm
