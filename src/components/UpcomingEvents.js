import '../styles/UpcomingEvents.css'
import fetchApi from '../services/apiService'
import { showToast } from '../utils/notification'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

async function fetchUpcomingEvents() {
  const token = localStorage.getItem('token')

  try {
    const events = await fetchApi(
      `${backendUrl}/api/users/me/upcoming-events`,
      'GET',
      null,
      token
    )
    return events
  } catch (error) {
    console.error('Error al obtener los eventos futuros:', error)
    throw error
  }
}

async function createUpcomingEvents() {
  const container = document.createElement('div')
  container.classList.add('upcoming-events-container')

  const title = document.createElement('h2')
  title.textContent = 'Mis Eventos Próximos'
  container.appendChild(title)

  try {
    const upcomingEvents = await fetchUpcomingEvents()

    if (upcomingEvents.length === 0) {
      const emptyMessage = document.createElement('p')
      emptyMessage.textContent = 'No tienes eventos próximos.'
      container.appendChild(emptyMessage)
      showToast('No tienes eventos próximos.', 'info', 'center')
    } else {
      upcomingEvents.forEach((event) => {
        const eventItem = document.createElement('div')
        eventItem.classList.add('event-item')
        eventItem.textContent = `${event.title} - ${new Date(
          event.date
        ).toLocaleDateString()}`
        container.appendChild(eventItem)
      })
      showToast('Eventos próximos cargados correctamente.', 'success', 'center')
    }
  } catch (error) {
    const errorMessage = document.createElement('p')
    errorMessage.textContent = 'Error al cargar los eventos próximos.'
    container.appendChild(errorMessage)
    showToast('Error al cargar los eventos próximos.', 'error', 'center')
  }

  return container
}

export default createUpcomingEvents
