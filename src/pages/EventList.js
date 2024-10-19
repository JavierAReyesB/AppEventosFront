import '../styles/Card.css'
import '../styles/EventList.css'
import createLoader from '../components/Loader.js'
import fetchApi from '../services/apiService.js'
import { showToast } from '../utils/notification.js' // Importamos la función de notificación
import {
  filterEventsByLocation,
  sortEventsByDate
} from '../utils/filterAndSort.js' // Importamos las funciones de filtro y ordenación

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

function createCard(event) {
  const card = document.createElement('div')
  card.classList.add('card')

  if (event.poster) {
    card.style.backgroundImage = `url(${event.poster})`
    card.style.backgroundSize = 'cover'
    card.style.backgroundPosition = 'center'
    card.style.backgroundRepeat = 'no-repeat'
  }

  const overlay = document.createElement('div')
  overlay.classList.add('card-overlay')

  const cardContent = document.createElement('div')
  cardContent.classList.add('card-content')

  const eventTitle = document.createElement('h2')
  eventTitle.textContent = event.title
  eventTitle.classList.add('card-title')
  cardContent.appendChild(eventTitle)

  const eventDescription = document.createElement('p')
  eventDescription.textContent = event.description
  eventDescription.classList.add('card-description')
  cardContent.appendChild(eventDescription)

  const eventDate = document.createElement('p')
  eventDate.textContent = `Fecha: ${formatDate(event.date)}`
  eventDate.classList.add('card-date')
  cardContent.appendChild(eventDate)

  const detailButton = document.createElement('button')
  detailButton.textContent = 'Ver detalles'
  detailButton.classList.add('card-button')
  detailButton.addEventListener('click', () => {
    window.navigateTo(`/events/${event._id}`)
  })
  cardContent.appendChild(detailButton)

  card.appendChild(overlay)
  card.appendChild(cardContent)

  return card
}

// Función para obtener las ubicaciones únicas de los eventos
function getUniqueLocations(events) {
  const locations = events.map((event) => event.location)
  return [...new Set(locations)] // Usamos Set para eliminar duplicados
}

async function fetchEvents() {
  try {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL // Obtener la URL del backend desde variables de entorno
    return await fetchApi(`${backendUrl}/api/events`, 'GET') // Usar la URL dinámica
  } catch (error) {
    console.error('Error al obtener los eventos:', error)

    // Mostrar una notificación si ocurre un error al obtener los eventos
    showToast(
      'Error al cargar los eventos. Intente más tarde.',
      'error',
      'center'
    )
    return []
  }
}

async function createEventList() {
  const container = document.createElement('div')
  container.classList.add('event-list-container')

  const title = document.createElement('h1')
  title.textContent = 'Lista de Eventos'
  container.appendChild(title)

  // Crear el área de filtrado
  const filterContainer = document.createElement('div')
  filterContainer.classList.add('filter-container')

  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Buscar evento...'
  filterContainer.appendChild(searchInput)

  const locationSelect = document.createElement('select')
  filterContainer.appendChild(locationSelect)

  const dateSortSelect = document.createElement('select')
  dateSortSelect.innerHTML = `
    <option value="desc">Ordenar por fecha (más reciente)</option>
    <option value="asc">Ordenar por fecha (más antiguo)</option>
  `
  filterContainer.appendChild(dateSortSelect)

  container.appendChild(filterContainer)

  const eventList = document.createElement('div')
  eventList.classList.add('event-list')

  const loader = createLoader()
  document.body.appendChild(loader)

  await new Promise((resolve) => setTimeout(resolve, 2000))
  let events = await fetchEvents()

  document.body.removeChild(loader)

  // Si no hay eventos, mostramos una notificación
  if (events.length === 0) {
    showToast('No se encontraron eventos.', 'info', 'center')
  }

  // Generar las opciones del filtro de ubicación basadas en los eventos
  const uniqueLocations = getUniqueLocations(events)
  locationSelect.innerHTML = '<option value="">Filtrar por ubicación</option>'
  uniqueLocations.forEach((location) => {
    const option = document.createElement('option')
    option.value = location
    option.textContent = location
    locationSelect.appendChild(option)
  })

  // Función para renderizar eventos en la lista
  const renderEvents = (filteredEvents) => {
    eventList.innerHTML = '' // Limpiar la lista actual
    if (filteredEvents.length === 0) {
      const emptyMessage = document.createElement('p')
      emptyMessage.textContent = 'No hay eventos disponibles en este momento.'
      container.appendChild(emptyMessage)
    } else {
      filteredEvents.forEach((event) => {
        const card = createCard(event)
        eventList.appendChild(card)
      })
    }
  }

  // Filtrar y renderizar eventos cuando se ingrese texto o cambien los filtros
  const applyFilters = () => {
    let filteredEvents = events

    // Filtro de búsqueda
    const searchQuery = searchInput.value.toLowerCase()
    if (searchQuery) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery) ||
          event.description.toLowerCase().includes(searchQuery)
      )
    }

    // Filtro por ubicación
    const selectedLocation = locationSelect.value
    if (selectedLocation) {
      filteredEvents = filterEventsByLocation(filteredEvents, selectedLocation)
    }

    // Ordenar por fecha
    const selectedSortOrder = dateSortSelect.value
    filteredEvents = sortEventsByDate(
      filteredEvents,
      selectedSortOrder === 'asc'
    )

    renderEvents(filteredEvents)
  }

  // Escuchar cambios en los inputs y filtros
  searchInput.addEventListener('input', applyFilters)
  locationSelect.addEventListener('change', applyFilters)
  dateSortSelect.addEventListener('change', applyFilters)

  // Renderizar la lista inicial de eventos
  renderEvents(events)

  container.appendChild(eventList)
  return container
}

export default createEventList
