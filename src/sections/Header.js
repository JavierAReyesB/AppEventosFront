import '../styles/Header.css' // Asegúrate de que la ruta sea correcta
import { showToast } from '../utils/notification.js' // Importamos la función showToast

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
  nav.appendChild(galleryLink) // Añadimos el enlace de la galería

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
        window.navigateTo('/') // Redirigir al inicio sin recargar la página
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
      window.navigateTo('/login')
    })

    // Evento para el botón de "Registrarse"
    registerLink.addEventListener('click', (e) => {
      e.preventDefault()
      window.navigateTo('/register')
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
  header.appendChild(hamburgerMenu) // Añadir menú hamburguesa
  header.appendChild(userDiv)

  return header
}

function createNavLink(href, text) {
  const link = document.createElement('a')
  link.href = href
  link.textContent = text
  link.addEventListener('click', (e) => {
    e.preventDefault()
    window.navigateTo(href) // Navegamos a la página sin recargar la aplicación
  })
  return link
}

export default createHeader