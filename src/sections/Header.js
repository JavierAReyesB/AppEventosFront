import '../styles/Header.css'
import { showToast } from '../utils/notification.js'
import { createNavLink } from '../utils/navigation.js'
import createEventList from '../pages/EventList.js'
import createUserProfile from '../pages/UserProfile.js'
import createHome from '../pages/Home.js'
import createLoginForm from '../pages/Login.js'
import createRegisterForm from '../pages/Register.js'
import createGalleryPage from '../pages/GalleryPage.js'
import createEventForm from '../pages/CreateEventForm.js'

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
        const newHeader = createHeader()
        document.querySelector('header').replaceWith(newHeader)
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

  return header
}

function handleRouting(path) {
  const main = document.querySelector('main.custom-main')
  main.innerHTML = ''

  if (path === '/events') {
    createEventList().then((eventList) => {
      main.appendChild(eventList)
    })
  } else if (path === '/profile') {
    const userProfile = createUserProfile()
    main.appendChild(userProfile)
  } else if (path === '/gallery') {
    createGalleryPage().then((galleryPage) => {
      main.innerHTML = ''
      main.appendChild(galleryPage)
    })
  } else if (path === '/') {
    const homePage = createHome()
    main.appendChild(homePage)
  } else if (path === '/login') {
    const loginForm = createLoginForm()
    main.appendChild(loginForm)
  } else if (path === '/register') {
    const registerForm = createRegisterForm()
    main.appendChild(registerForm)
  } else if (path === '/events/create-event') {
    const eventForm = createEventForm()
    main.appendChild(eventForm)
  } else {
    const notFound = document.createElement('h1')
    notFound.textContent = '404: Página no encontrada'
    main.appendChild(notFound)
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
