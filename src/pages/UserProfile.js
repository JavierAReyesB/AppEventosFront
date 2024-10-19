import '../styles/UserProfile.css'
import createAttendedEvents from '../components/AttendedEvents.js'
import createUpcomingEvents from '../components/UpcomingEvents.js'
import { showToast } from '../utils/notification.js'
import { displayError, clearError } from '../utils/errorHandler.js'

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
      userData = jwt_decode(token)
      console.log('Datos del token:', userData)
    } catch (error) {
      console.error('Error al decodificar el token', error)
      displayError(
        'Error al cargar los datos del usuario.',
        userProfileContainer,
        'network'
      )
      showToast('Error al cargar los datos del usuario.', 'error', 'center')
      return userProfileContainer
    }
  } else {
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

  const editProfileButton = createButton('Editar Perfil', () => {
    showToast(
      'Funcionalidad de edición de perfil próximamente.',
      'info',
      'center'
    )
    console.log('Editar perfil')
  })

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
  ;(async () => {
    try {
      const attendedEventsContainer = await createAttendedEvents()
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
  ;(async () => {
    try {
      const upcomingEventsContainer = await createUpcomingEvents()
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
