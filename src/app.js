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
import editEventForm from './pages/EditEventForm.js' // Importar el formulario de edición de eventos
import createGallery from './pages/GalleryPage.js' // Importar la página de la galería

async function initializeApp() {
  const appContainer = document.getElementById('app-container')

  // Crear y loguear header
  const header = createHeader()
  console.log('Header creado:', header)

  // Crear y loguear main
  const main = createMain()
  console.log('Main creado:', main)

  // Crear y loguear footer
  const footer = createFooter()
  console.log('Footer creado:', footer)

  // Añadir header, main, y footer al contenedor
  appContainer.appendChild(header)
  appContainer.appendChild(main)
  appContainer.appendChild(footer)
  console.log('Header, main y footer añadidos a appContainer:', appContainer)

  const navigateTo = async (path) => {
    console.log(`Navegando a: ${path}`) // Añadir log para ver a qué ruta se está intentando navegar
    main.innerHTML = '' // Limpiar el contenido anterior

    const token = localStorage.getItem('token')
    let userRole = null

    if (token) {
      const decoded = jwt_decode(token)
      userRole = decoded.role
      console.log('Datos del token decodificado:', decoded)
    } else {
      console.log('No se encontró token, el usuario no está autenticado.')
    }

    // Verificar la ruta para event details
    const eventDetailsMatch = path.match(/^\/events\/([a-zA-Z0-9]+)$/)
    if (eventDetailsMatch) {
      const eventId = eventDetailsMatch[1]
      const eventDetails = await createEventDetails(eventId)
      main.appendChild(eventDetails)
      return
    }

    // Verificar la ruta para editar evento
    const eventEditMatch = path.match(/^\/events\/edit\/([a-zA-Z0-9]+)$/)
    if (eventEditMatch) {
      const eventId = eventEditMatch[1]
      console.log(
        'Intentando cargar el formulario de edición de eventos, rol de usuario:',
        userRole
      )
      if (userRole === 'organizer' || userRole === 'admin') {
        const editForm = await editEventForm(eventId) // Obtener el formulario de edición
        main.appendChild(editForm)
      } else {
        console.warn('El usuario no tiene permiso para editar eventos.')
        main.innerHTML = '<p>No tienes permiso para editar eventos.</p>'
      }
      return
    }

    console.log(`Comprobando ruta: ${path}`)

    switch (path) {
      case '/profile':
        console.log('Cargando perfil de usuario')
        main.appendChild(createUserProfile())
        break
      case '/events':
        console.log('Cargando lista de eventos')
        const eventList = await createEventList()
        main.appendChild(eventList)
        break
      case '/events/create-event':
        console.log(
          'Intentando cargar el formulario de creación de eventos, rol de usuario:',
          userRole
        )
        if (userRole === 'organizer' || userRole === 'admin') {
          console.log('El usuario tiene permiso para crear eventos')
          main.appendChild(createEventForm())
        } else {
          console.warn('El usuario no tiene permiso para crear eventos.')
          main.innerHTML = '<p>No tienes permiso para crear eventos.</p>'
        }
        break
      case '/register':
        console.log('Cargando formulario de registro')
        main.appendChild(createRegisterForm())
        break
      case '/login':
        console.log('Cargando formulario de inicio de sesión')
        main.appendChild(createLoginForm())
        break
      case '/gallery': // Añadir la ruta de la galería
        console.log('Cargando galería de eventos')
        main.appendChild(await createGallery()) // Cargar la galería de imágenes
        break
      case '/':
        console.log('Cargando página de inicio')
        main.appendChild(createHome())
        break
      default:
        console.warn('Ruta no reconocida, cargando página de inicio')
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
