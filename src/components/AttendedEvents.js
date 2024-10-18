import '../styles/AttendedEvents.css' // Asegúrate de tener un archivo CSS para los estilos
import createLoader from '../components/Loader.js' // Importar el componente del loader
import fetchApi from '../services/apiService' // Importamos la función reutilizable fetchApi

// Función para obtener los eventos asistidos por el usuario desde la API
async function fetchAttendedEvents(token) {
  try {
    const events = await fetchApi(
      `http://localhost:5000/api/users/me/attended-events`,
      'GET',
      null, // No body required for GET requests
      token
    )
    return events
  } catch (error) {
    console.error('Error al obtener los eventos asistidos:', error)
    return []
  }
}

// Función para crear la lista de eventos asistidos
async function createAttendedEvents() {
  const container = document.createElement('div')
  container.classList.add('attended-events-container')

  const title = document.createElement('h2')
  title.textContent = 'Mis Eventos Asistidos'
  container.appendChild(title)

  const token = localStorage.getItem('token') // Obtenemos el token del usuario

  // Crear y mostrar el loader
  const loader = createLoader() // Definir el loader correctamente aquí
  container.appendChild(loader)

  // Obtenemos la lista de eventos asistidos
  const events = await fetchAttendedEvents(token)

  // Ocultar el loader una vez que los eventos se carguen
  container.removeChild(loader)

  if (events.length === 0) {
    const emptyMessage = document.createElement('p')
    emptyMessage.textContent = 'No has asistido a ningún evento todavía.'
    container.appendChild(emptyMessage)
  } else {
    const eventsList = document.createElement('ul') // Lista de eventos

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
