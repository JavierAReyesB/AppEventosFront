import '../styles/EventDetails.css'
import createButton from '../components/Button.js'
import createReviewSection from '../sections/ReviewSection.js'
import fetchApi from '../services/apiService.js'
import { displayError, clearError } from '../utils/errorHandler.js'
import { showToast } from '../utils/notification.js'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

async function fetchEventDetails(eventId) {
  try {
    return await fetchApi(`${backendUrl}/api/events/${eventId}`, 'GET')
  } catch (error) {
    console.error('Error al obtener los detalles del evento:', error)
    showToast('Error al cargar los detalles del evento.', 'error', 'center')
    return null
  }
}

async function attendEvent(eventId, token, errorMessageElement) {
  try {
    await fetchApi(
      `${backendUrl}/api/events/${eventId}/attend`,
      'POST',
      null,
      token
    )
    showToast('Te has inscrito con éxito al evento', 'success', 'center')
    window.navigateTo(`/events/${eventId}`)
  } catch (error) {
    console.error('Error al inscribirse al evento:', error)
    displayError(
      'No se pudo inscribir al evento.',
      errorMessageElement,
      'network'
    )
    showToast(
      'Error al inscribirse al evento. Intente de nuevo.',
      'error',
      'center'
    )
  }
}

async function createEventDetails(eventId) {
  const container = document.createElement('div')
  container.classList.add('event-details-container')

  const errorMessageElement = document.createElement('div')
  container.appendChild(errorMessageElement)

  const event = await fetchEventDetails(eventId)

  if (!event) {
    displayError(
      'Error al cargar los detalles del evento.',
      errorMessageElement,
      'general'
    )
    return container
  }

  const title = document.createElement('h1')
  title.textContent = event.title
  container.appendChild(title)

  const date = document.createElement('p')
  date.textContent = `Fecha: ${new Date(event.date).toLocaleDateString()}`
  container.appendChild(date)

  const description = document.createElement('p')
  description.textContent = event.description
  container.appendChild(description)

  if (event.poster) {
    const image = document.createElement('img')
    image.src = event.poster
    image.alt = `Imagen del evento ${event.title}`
    image.classList.add('event-image')
    container.appendChild(image)
  }

  const attendeesList = document.createElement('div')
  attendeesList.classList.add('attendees-list')

  const attendeesTitle = document.createElement('h3')
  attendeesTitle.textContent = 'Asistentes:'
  attendeesList.appendChild(attendeesTitle)

  if (event.attendees.length === 0) {
    const noAttendeesMessage = document.createElement('p')
    noAttendeesMessage.textContent = 'No hay asistentes registrados aún.'
    attendeesList.appendChild(noAttendeesMessage)
  } else {
    const attendeesUl = document.createElement('ul')
    event.attendees.forEach((attendee) => {
      const attendeeLi = document.createElement('li')
      attendeeLi.textContent = `${attendee.name} (${attendee.email})`
      attendeesUl.appendChild(attendeeLi)
    })
    attendeesList.appendChild(attendeesUl)
  }

  container.appendChild(attendeesList)

  const token = localStorage.getItem('token')
  let userRole = null
  let userId = null
  const today = new Date()

  if (token) {
    const decoded = jwt_decode(token)
    userRole = decoded.role
    userId = decoded.id
  }

  const eventDate = new Date(event.date)
  const isEventPast = eventDate < today

  if (userRole === 'organizer' || userRole === 'admin') {
    const deleteButton = createButton({
      text: 'Eliminar Evento',
      onClick: async () => {
        if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
          try {
            await fetchApi(
              `${backendUrl}/api/events/${eventId}`,
              'DELETE',
              null,
              token
            )
            showToast('Evento eliminado exitosamente', 'success', 'center')
            window.navigateTo('/events')
          } catch (error) {
            console.error('Error al eliminar el evento:', error)
            displayError(
              'No se pudo eliminar el evento.',
              errorMessageElement,
              'network'
            )
            showToast('Error al eliminar el evento.', 'error', 'center')
          }
        }
      },
      className: 'delete-button'
    })

    const editButton = createButton({
      text: 'Editar Evento',
      onClick: () => {
        window.navigateTo(`/events/edit/${eventId}`)
      },
      className: 'edit-button'
    })

    container.appendChild(editButton)
    container.appendChild(deleteButton)
  }

  if (userRole === 'user' && !isEventPast) {
    const isUserRegistered = event.attendees.some(
      (attendee) => attendee._id === userId
    )

    if (isUserRegistered) {
      const registeredMessage = document.createElement('p')
      registeredMessage.textContent = 'Ya estás inscrito en este evento.'
      container.appendChild(registeredMessage)
    } else {
      const attendButton = createButton({
        text: 'Inscribirse al Evento',
        onClick: () => attendEvent(eventId, token, errorMessageElement),
        className: 'attend-button'
      })

      container.appendChild(attendButton)
    }
  } else if (isEventPast) {
    const eventPassedMessage = document.createElement('p')
    eventPassedMessage.textContent = 'Este evento ya ha pasado.'
    container.appendChild(eventPassedMessage)
  }

  const attendeesIds = event.attendees.map((attendee) => attendee._id)
  const reviewSection = await createReviewSection(eventId, attendeesIds)
  container.appendChild(reviewSection)

  return container
}

export default createEventDetails
