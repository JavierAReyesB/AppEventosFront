import '../styles/Header.css'
import { showToast } from '../utils/notification.js'
import createEventList from '../pages/EventList.js'
import createUserProfile from '../pages/UserProfile.js'
import createHome from '../pages/Home.js'
import createGalleryPage from '../pages/GalleryPage.js'

function createHeader() {
  const header = document.createElement('header')
  header.classList.add('header')

  const logo = document.createElement('a')
  logo.href = '/'
  logo.textContent = 'EventosApp'
  logo.classList.add('logo')

  const nav = document.createElement('nav')
  nav.classList.add('main-nav')

  const homeLink = createNavLink('/', 'Inicio')
  const eventsLink = createNavLink('/events', 'Eventos')
  const galleryLink = createNavLink('/gallery', 'Galería')
  nav.appendChild(homeLink)
  nav.appendChild(eventsLink)
  nav.appendChild(galleryLink)

  const userDiv = document.createElement('div')
  userDiv.classList.add('user-options')

  const token = localStorage.getItem('token')

  if (token) {
    const decodedToken = jwt_decode(token)
    const userProfileLink = createNavLink('/profile', 'Mi Perfil')
    const logoutLink = document.createElement('a')
    logoutLink.textContent = 'Cerrar Sesión'
    logoutLink.href = '#'

    logoutLink.addEventListener('click', (e) => {
      e.preventDefault()
      localStorage.removeItem('token')
      showToast('Sesión cerrada con éxito.', 'success', 'center')
      setTimeout(() => {
        window.history.pushState({}, '', '/')
        handleRouting('/')
      }, 1000)
    })

    userDiv.appendChild(userProfileLink)
    userDiv.appendChild(logoutLink)

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

    loginLink.addEventListener('click', (e) => {
      e.preventDefault()
      window.history.pushState({}, '', '/login')
      handleRouting('/login')
    })

    registerLink.addEventListener('click', (e) => {
      e.preventDefault()
      window.history.pushState({}, '', '/register')
      handleRouting('/register')
    })

    userDiv.appendChild(loginLink)
    userDiv.appendChild(registerLink)
  }

  const hamburgerMenu = document.createElement('div')
  hamburgerMenu.classList.add('hamburger-menu')
  hamburgerMenu.innerHTML = '☰'

  hamburgerMenu.addEventListener('click', () => {
    nav.classList.toggle('active')
  })

  header.appendChild(logo)
  header.appendChild(nav)
  header.appendChild(hamburgerMenu)
  header.appendChild(userDiv)

  console.log('Header creado:', header) // Añadir este log

  return header
}

function createNavLink(href, text) {
  const link = document.createElement('a')
  link.href = href
  link.textContent = text
  link.addEventListener('click', (e) => {
    e.preventDefault()
    window.history.pushState({}, '', href)
    handleRouting(href)
  })
  return link
}

async function handleRouting(path) {
  const app = document.getElementById('app-container')
  app.innerHTML = ''

  try {
    if (path === '/events') {
      console.log('Cargando vista de eventos')
      const eventList = await createEventList()
      app.appendChild(eventList)
    } else if (path === '/profile') {
      console.log('Cargando perfil del usuario')
      const userProfile = createUserProfile()
      app.appendChild(userProfile)
    } else if (path === '/gallery') {
      console.log('Cargando galería de eventos')
      const galleryPage = await createGalleryPage()
      app.appendChild(galleryPage)
    } else if (path === '/') {
      console.log('Cargando página de inicio')
      const homePage = createHome()
      app.appendChild(homePage)
    } else {
      console.log('Cargando 404: Página no encontrada')
      const notFound = document.createElement('h1')
      notFound.textContent = '404: Página no encontrada'
      app.appendChild(notFound)
    }
  } catch (error) {
    console.error(`Error cargando la ruta ${path}:`, error)
    const errorMessage = document.createElement('p')
    errorMessage.textContent = `Error al cargar la página ${path}`
    app.appendChild(errorMessage)
  }
}

window.addEventListener('popstate', function () {
  const currentPath = window.location.pathname
  handleRouting(currentPath)
})

window.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname
  handleRouting(currentPath)
})

export default createHeader
