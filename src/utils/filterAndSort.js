export function sortEventsByDate(events, ascending = true) {
  return events.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return ascending ? dateA - dateB : dateB - dateA
  })
}

export function filterEventsByLocation(events, location) {
  return events.filter(
    (event) =>
      event.location.trim().toLowerCase() === location.trim().toLowerCase()
  )
}
