import '../styles/CreateEventForm.css'
import fetchApi from '../services/apiService'
import { createForm } from '../components/Form'
import { displayError, clearError } from '../utils/errorHandler'
import { showToast } from '../utils/notification'
import createLoader from '../components/Loader' // Importamos el loader

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

function createEventForm() {
  const container = document.createElement('div')
  container.classList.add('create-event-container')

  // Mostrar el loader inmediatamente cuando se carga la página
  const loader = createLoader()
  container.appendChild(loader)

  setTimeout(() => {
    // Limpiamos el loader antes de cargar el formulario
    container.innerHTML = ''

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
      // Mostrar el loader mientras se crea el evento
      const submitLoader = createLoader()
      container.appendChild(submitLoader)

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

        await fetchApi(
          `${backendUrl}/api/events`,
          'POST',
          formData,
          token,
          true
        )

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
      } finally {
        // Remover el loader cuando finalice el proceso
        container.removeChild(submitLoader)
      }
    }

    const form = createForm(fields, onSubmit, 'event-form', 'Crear Evento')
    container.appendChild(form)
  }, 500) // Puedes ajustar el tiempo de carga o eliminar el delay si no es necesario

  return container
}

export default createEventForm
