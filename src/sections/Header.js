import '../styles/Header.css' // Asegúrate de que la ruta sea correcta
import { showToast } from '../utils/notification.js' // Importamos la función showToast
import { createNavLink } from '../utils/navigation.js' // Importamos la nueva función de navegación
import createEventList from '../pages/EventList.js' // Asegúrate de tener las vistas correctas
import createUserProfile from '../pages/UserProfile.js' // Asegúrate de tener las vistas correctas
import createHome from '../pages/Home.js'
import createLoginForm from '../pages/Login.js' // Asegúrate de que la ruta sea correcta
import createRegisterForm from '../pages/Register.js' // Asegúrate de que la ruta sea correcta
import createGalleryPage from '../pages/GalleryPage.js'
import createEventForm from '../pages/CreateEventForm.js' // Asegúrate de que la ruta sea correcta

function createHeader() {
  const header = document.createElement('header')
  header.classList.add('header')

  // Logo que redirecciona a la página principal
  const logo = document.createElement('a')
  logo.href = '/'
  logo.textContent = 'EventosApp'
  logo.classList.add('logo')

  // Contenedor para la navegación
  const nav = document.createElement('nav')
  nav.classList.add('main-nav')

  // Enlaces de navegación
  const homeLink = createNavLink('/', 'Inicio')
  const eventsLink = createNavLink('/events', 'Eventos')
  const galleryLink = createNavLink('/gallery', 'Galería') // Nuevo enlace a la galería
  nav.appendChild(homeLink)
  nav.appendChild(eventsLink)
  nav.appendChild(galleryLink)

  // Contenedor para la gestión del usuario
  const userDiv = document.createElement('div')
  userDiv.classList.add('user-options')

  // Verificar si hay un token en localStorage para determinar si el usuario está autenticado
  const token = localStorage.getItem('token')

  if (token) {
    const decodedToken = jwt_decode(token) // Usamos jwt_decode desde el script del CDN
    const userProfileLink = createNavLink('/profile', 'Mi Perfil')
    const logoutLink = document.createElement('a')
    logoutLink.textContent = 'Cerrar Sesión'
    logoutLink.href = '#'

    // Evento para cerrar sesión
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault()

      // Eliminar el token del localStorage
      localStorage.removeItem('token')

      // Notificación con showToast
      showToast('Sesión cerrada con éxito.', 'success', 'center')

      // Redirigir al inicio después de un breve retraso
      setTimeout(() => {
        window.history.pushState({}, '', '/') // Redirigir al inicio sin recargar la página
        handleRouting('/') // Aseguramos que la página inicial se cargue correctamente

        // *** Actualizar el header ***
        const newHeader = createHeader()
        document.querySelector('header').replaceWith(newHeader)
      }, 1000) // 1 segundo de retraso para que se vea la notificación
    })

    userDiv.appendChild(userProfileLink)
    userDiv.appendChild(logoutLink)

    // Si el usuario es organizador o admin, agregar enlace de crear evento
    if (decodedToken.role === 'organizer' || decodedToken.role === 'admin') {
      const createEventLink = createNavLink(
        '/events/create-event',
        'Crear Evento'
      )
      userDiv.appendChild(createEventLink)
    }
  } else {
    const loginLink = createNavLink('/login', 'Iniciar Sesión')
    const registerLink = createNavLink('/register', 'Registrarse')

    // Evento para el botón de "Iniciar Sesión"
    loginLink.addEventListener('click', (e) => {
      e.preventDefault()
      window.history.pushState({}, '', '/login')
      handleRouting('/login')
    })

    // Evento para el botón de "Registrarse"
    registerLink.addEventListener('click', (e) => {
      e.preventDefault()
      window.history.pushState({}, '', '/register')
      handleRouting('/register')
    })

    userDiv.appendChild(loginLink)
    userDiv.appendChild(registerLink)
  }

  // Crear el ícono de menú hamburguesa para pantallas pequeñas
  const hamburgerMenu = document.createElement('div')
  hamburgerMenu.classList.add('hamburger-menu')
  hamburgerMenu.innerHTML = '☰' // Ícono de menú hamburguesa

  // Evento para mostrar/ocultar el menú en pantallas pequeñas
  hamburgerMenu.addEventListener('click', () => {
    nav.classList.toggle('active') // Mostrar u ocultar el menú
  })

  // Añadir el ícono de menú al header
  header.appendChild(logo)
  header.appendChild(nav)
  header.appendChild(hamburgerMenu)
  header.appendChild(userDiv)

  return header
}

function handleRouting(path) {
  const main = document.querySelector('main.custom-main') // Selecciona solo el main, no todo el app-container
  main.innerHTML = '' // Limpiamos el contenido anterior del main

  if (path === '/events') {
    console.log('Cargando vista de eventos')
    createEventList().then((eventList) => {
      main.appendChild(eventList)
    })
  } else if (path === '/profile') {
    console.log('Cargando perfil del usuario')
    const userProfile = createUserProfile()
    main.appendChild(userProfile)
  } else if (path === '/gallery') {
    console.log('Cargando galería de eventos')
    createGalleryPage().then((galleryPage) => {
      main.innerHTML = ''
      main.appendChild(galleryPage)
    })
  } else if (path === '/') {
    console.log('Cargando página de inicio')
    const homePage = createHome()
    main.appendChild(homePage)
  } else if (path === '/login') {
    console.log('Cargando formulario de inicio de sesión')
    const loginForm = createLoginForm()
    main.appendChild(loginForm)
  } else if (path === '/register') {
    console.log('Cargando formulario de registro')
    const registerForm = createRegisterForm()
    main.appendChild(registerForm)
  } else if (path === '/events/create-event') {
    // Añadimos el manejo para crear eventos
    console.log('Cargando formulario de creación de eventos')
    const eventForm = createEventForm() // Llamamos a la función que crea el formulario de eventos
    main.appendChild(eventForm)
  } else {
    console.log('Cargando 404: Página no encontrada')
    const notFound = document.createElement('h1')
    notFound.textContent = '404: Página no encontrada'
    main.appendChild(notFound)
  }
}

// Detectar cambios en la URL (cuando el usuario use los botones de adelante/atrás del navegador)
window.addEventListener('popstate', function () {
  const currentPath = window.location.pathname
  handleRouting(currentPath)
})

// Cargar la página al inicio
window.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname
  handleRouting(currentPath)
})

export default createHeader
