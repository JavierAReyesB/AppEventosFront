import createHeader from './sections/Header.js'
import createFooter from './sections/Footer.js'
import createMain from './sections/Main.js'
import createUserProfile from './pages/UserProfile.js'
import createEventDetails from './pages/EventDetails.js'
import createEventList from './pages/EventList.js'
import createHome from './pages/Home.js'
import createRegisterForm from './pages/Register.js'
import createLoginForm from './pages/Login.js'
import createEventForm from './pages/CreateEventForm.js'
import editEventForm from './pages/EditEventForm.js'
import createGallery from './pages/GalleryPage.js'

async function initializeApp() {
  const appContainer = document.getElementById('app-container')

  const header = createHeader()
  const main = createMain()
  const footer = createFooter()

  appContainer.appendChild(header)
  appContainer.appendChild(main)
  appContainer.appendChild(footer)

  const navigateTo = async (path) => {
    main.innerHTML = ''

    const token = localStorage.getItem('token')
    let userRole = null

    if (token) {
      const decoded = jwt_decode(token)
      userRole = decoded.role
    }

    const eventDetailsMatch = path.match(/^\/events\/([a-zA-Z0-9]+)$/)
    if (eventDetailsMatch) {
      const eventId = eventDetailsMatch[1]
      const eventDetails = await createEventDetails(eventId)
      main.appendChild(eventDetails)
      return
    }

    const eventEditMatch = path.match(/^\/events\/edit\/([a-zA-Z0-9]+)$/)
    if (eventEditMatch) {
      const eventId = eventEditMatch[1]
      if (userRole === 'organizer' || userRole === 'admin') {
        const editForm = await editEventForm(eventId)
        main.appendChild(editForm)
      } else {
        main.innerHTML = '<p>No tienes permiso para editar eventos.</p>'
      }
      return
    }

    switch (path) {
      case '/profile':
        main.appendChild(createUserProfile())
        break
      case '/events':
        const eventList = await createEventList()
        main.appendChild(eventList)
        break
      case '/events/create-event':
        if (userRole === 'organizer' || userRole === 'admin') {
          main.appendChild(createEventForm())
        } else {
          main.innerHTML = '<p>No tienes permiso para crear eventos.</p>'
        }
        break
      case '/register':
        main.appendChild(createRegisterForm())
        break
      case '/login':
        main.appendChild(createLoginForm())
        break
      case '/gallery':
        main.appendChild(await createGallery())
        break
      case '/':
        main.appendChild(createHome())
        break
      default:
        main.appendChild(createHome())
        break
    }
  }

  window.navigateTo = navigateTo

  await navigateTo(window.location.pathname)

  window.addEventListener('popstate', async () => {
    await navigateTo(window.location.pathname)
  })
}

export default initializeApp
