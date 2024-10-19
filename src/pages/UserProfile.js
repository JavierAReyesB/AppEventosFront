import '../styles/UserProfile.css' // Asegúrate de que la ruta sea correcta
import createAttendedEvents from '../components/AttendedEvents.js' // Importamos el componente de eventos asistidos
import createUpcomingEvents from '../components/UpcomingEvents.js' // Importamos el componente de eventos futuros
import { showToast } from '../utils/notification.js' // Importamos la función de notificación
import { displayError, clearError } from '../utils/errorHandler.js' // Importamos el manejador de errores

function createUserProfile() {
  const userProfileContainer = document.createElement('div')
  userProfileContainer.classList.add('user-profile-container')

  const title = document.createElement('h1')
  title.textContent = 'Perfil de Usuario'
  userProfileContainer.appendChild(title)

  const token = localStorage.getItem('token')
  let userData = {}

  if (token) {
    try {
      userData = jwt_decode(token) // Usar jwt_decode global desde el CDN
      console.log('Datos del token:', userData)
    } catch (error) {
      console.error('Error al decodificar el token', error)

      // Manejamos el error con displayError y showToast
      displayError(
        'Error al cargar los datos del usuario.',
        userProfileContainer,
        'network'
      )
      showToast('Error al cargar los datos del usuario.', 'error', 'center')
      return userProfileContainer
    }
  } else {
    // Manejamos el error si no se encuentra un token
    displayError(
      'No se encontró un token de usuario.',
      userProfileContainer,
      'general'
    )
    showToast('No se encontró un token de usuario.', 'error', 'center')
    return userProfileContainer
  }

  const userInfo = document.createElement('div')
  userInfo.classList.add('user-info')

  const userName = document.createElement('p')
  userName.textContent = `Nombre: ${userData.name || 'Usuario Ejemplo'}`

  const userEmail = document.createElement('p')
  userEmail.textContent = `Email: ${userData.email || 'usuario@ejemplo.com'}`

  userInfo.appendChild(userName)
  userInfo.appendChild(userEmail)

  // Botón para editar el perfil
  const editProfileButton = createButton('Editar Perfil', () => {
    showToast(
      'Funcionalidad de edición de perfil próximamente.',
      'info',
      'center'
    )
    console.log('Editar perfil')
  })

  // Botón para cambiar la contraseña
  const changePasswordButton = createButton('Cambiar Contraseña', () => {
    showToast(
      'Funcionalidad para cambiar la contraseña próximamente.',
      'info',
      'center'
    )
    console.log('Cambiar contraseña')
  })

  userInfo.appendChild(editProfileButton)
  userInfo.appendChild(changePasswordButton)

  userProfileContainer.appendChild(userInfo)

  // Añadimos la lista de eventos asistidos en el perfil
  ;(async () => {
    try {
      const attendedEventsContainer = await createAttendedEvents() // Llamamos a la función que crea la lista de eventos asistidos
      userProfileContainer.appendChild(attendedEventsContainer)
    } catch (error) {
      console.error('Error al cargar eventos asistidos:', error)
      displayError(
        'Error al cargar los eventos asistidos.',
        userProfileContainer,
        'network'
      )
      showToast(
        'Error al cargar los eventos asistidos. Inténtalo de nuevo.',
        'error',
        'center'
      )
    }
  })()

  // Añadimos la lista de eventos futuros en el perfil
  ;(async () => {
    try {
      const upcomingEventsContainer = await createUpcomingEvents() // Llamamos a la función que crea la lista de eventos futuros
      userProfileContainer.appendChild(upcomingEventsContainer)
    } catch (error) {
      console.error('Error al cargar eventos futuros:', error)
      displayError(
        'Error al cargar los eventos futuros.',
        userProfileContainer,
        'network'
      )
      showToast(
        'Error al cargar los eventos futuros. Inténtalo de nuevo.',
        'error',
        'center'
      )
    }
  })()

  return userProfileContainer
}

function createButton(text, onClickFunction) {
  const button = document.createElement('button')
  button.textContent = text
  button.onclick = onClickFunction
  return button
}

export default createUserProfile
