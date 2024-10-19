import '../styles/AttendedEvents.css'
import createLoader from '../components/Loader.js'
import fetchApi from '../services/apiService'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

async function fetchAttendedEvents(token) {
  try {
    const events = await fetchApi(
      `${backendUrl}/api/users/me/attended-events`,
      'GET',
      null,
      token
    )
    return events
  } catch (error) {
    console.error('Error al obtener los eventos asistidos:', error)
    return []
  }
}

async function createAttendedEvents() {
  const container = document.createElement('div')
  container.classList.add('attended-events-container')

  const title = document.createElement('h2')
  title.textContent = 'Mis Eventos Asistidos'
  container.appendChild(title)

  const token = localStorage.getItem('token')

  const loader = createLoader()
  container.appendChild(loader)

  const events = await fetchAttendedEvents(token)

  container.removeChild(loader)

  if (events.length === 0) {
    const emptyMessage = document.createElement('p')
    emptyMessage.textContent = 'No has asistido a ningún evento todavía.'
    container.appendChild(emptyMessage)
  } else {
    const eventsList = document.createElement('ul')

    events.forEach((event) => {
      const eventItem = document.createElement('li')
      eventItem.textContent = `${event.title} - ${new Date(
        event.date
      ).toLocaleDateString()}`
      eventsList.appendChild(eventItem)
    })

    container.appendChild(eventsList)
  }

  return container
}

export default createAttendedEvents
