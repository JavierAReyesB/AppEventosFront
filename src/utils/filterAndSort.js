// Función para ordenar eventos por fecha
export function sortEventsByDate(events, ascending = true) {
  return events.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return ascending ? dateA - dateB : dateB - dateA
  })
}

// Función para filtrar eventos por ubicación
export function filterEventsByLocation(events, location) {
  return events.filter(
    (event) =>
      event.location.trim().toLowerCase() === location.trim().toLowerCase()
  )
}
