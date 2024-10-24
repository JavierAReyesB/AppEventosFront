import '../styles/Card.css'
import '../styles/EventList.css'
import createLoader from '../components/Loader.js'
import fetchApi from '../services/apiService.js'
import { showToast } from '../utils/notification.js'
import { displayError, clearError } from '../utils/errorHandler.js'
import {
  filterEventsByLocation,
  sortEventsByDate
} from '../utils/filterAndSort.js'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

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
    const loader = createLoader()
    document.body.appendChild(loader)

    window.history.pushState({}, '', `/events/${event._id}`)

    window.navigateTo(`/events/${event._id}`).then(() => {
      document.body.removeChild(loader)
    })
  })

  cardContent.appendChild(detailButton)

  card.appendChild(overlay)
  card.appendChild(cardContent)

  return card
}

function getUniqueLocations(events) {
  const locations = events.map((event) => event.location)
  return [...new Set(locations)]
}

async function fetchEvents() {
  try {
    return await fetchApi(`${backendUrl}/api/events`, 'GET')
  } catch (error) {
    console.error('Error al obtener los eventos:', error)
    displayError(
      'Error al cargar los eventos. Intente más tarde.',
      document.body,
      'network'
    )
    showToast(
      'Error al cargar los eventos. Intente más tarde.',
      'error',
      'center'
    )
    return []
  }
}

async function createEventList() {
  // Eliminar cualquier contenedor de eventos existente
  const existingContainer = document.querySelector('.event-list-container')
  if (existingContainer) {
    existingContainer.remove()
  }

  // Crear un nuevo contenedor de eventos
  const container = document.createElement('div')
  container.classList.add('event-list-container')

  const title = document.createElement('h1')
  title.textContent = 'Lista de Eventos'
  container.appendChild(title)

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

  let events = await fetchEvents()

  document.body.removeChild(loader)

  if (events.length === 0) {
    showToast('No se encontraron eventos.', 'info', 'center')
  }

  const uniqueLocations = getUniqueLocations(events)
  locationSelect.innerHTML = '<option value="">Filtrar por ubicación</option>'
  uniqueLocations.forEach((location) => {
    const option = document.createElement('option')
    option.value = location
    option.textContent = location
    locationSelect.appendChild(option)
  })

  const renderEvents = (filteredEvents) => {
    // Limpiar el contenedor de eventos ANTES de renderizar nuevos eventos
    eventList.innerHTML = ''
    if (filteredEvents.length === 0) {
      const emptyMessage = document.createElement('p')
      emptyMessage.textContent = 'No hay eventos disponibles en este momento.'
      eventList.appendChild(emptyMessage)
    } else {
      filteredEvents.forEach((event) => {
        const card = createCard(event)
        eventList.appendChild(card)
      })
    }
  }

  const applyFilters = () => {
    let filteredEvents = events

    const searchQuery = searchInput.value.toLowerCase()
    if (searchQuery) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery) ||
          event.description.toLowerCase().includes(searchQuery)
      )
    }

    const selectedLocation = locationSelect.value
    if (selectedLocation) {
      filteredEvents = filterEventsByLocation(filteredEvents, selectedLocation)
    }

    const selectedSortOrder = dateSortSelect.value
    filteredEvents = sortEventsByDate(
      filteredEvents,
      selectedSortOrder === 'asc'
    )

    // Renderizar los eventos filtrados y limpiar antes de agregar nuevos
    renderEvents(filteredEvents)
  }

  searchInput.addEventListener('input', applyFilters)
  locationSelect.addEventListener('change', applyFilters)
  dateSortSelect.addEventListener('change', applyFilters)

  // Renderizar todos los eventos al cargar la página
  renderEvents(events)

  container.appendChild(eventList)

  // Insertar el contenedor de eventos en el DOM
  document.body.appendChild(container)

  return container
}

export default createEventList
