import '../styles/LoginRegister.css'
import { loginUser } from '../services/authService.js'
import { createForm } from '../components/Form.js'
import { displayError, clearError } from '../utils/errorHandler.js'
import { showToast } from '../utils/notification.js'
import createLoader from '../components/Loader.js' // Importamos la función del loader

function createLoginForm() {
  const loginContainer = document.createElement('div')
  loginContainer.classList.add('form-container')

  const loader = createLoader() // Creamos el loader
  loginContainer.appendChild(loader) // Mostramos el loader mientras cargamos el formulario

  setTimeout(() => {
    // Simulamos un pequeño retraso para mostrar el loader, si es necesario
    loginContainer.innerHTML = '' // Limpiamos el loader antes de cargar el formulario

    const title = document.createElement('h1')
    title.textContent = 'Iniciar Sesión'
    loginContainer.appendChild(title)

    const errorMessage = document.createElement('p')
    errorMessage.classList.add('error-message')
    loginContainer.appendChild(errorMessage)

    const fields = [
      {
        type: 'email',
        name: 'email',
        label: 'Correo Electrónico',
        placeholder: 'Correo Electrónico',
        isRequired: true
      },
      {
        type: 'password',
        name: 'password',
        label: 'Contraseña',
        placeholder: 'Contraseña',
        isRequired: true
      },
      {
        type: 'checkbox',
        name: 'rememberMe',
        label: 'Recordar sesión',
        isRequired: false
      }
    ]

    const form = createForm(
      fields,
      async (formData) => {
        clearError(errorMessage)

        try {
          const response = await loginUser(formData)
          showToast(
            'Inicio de sesión exitoso. ¡Bienvenido!',
            'success',
            'center'
          )

          const storage = formData.rememberMe ? localStorage : sessionStorage
          storage.setItem('token', response.token)

          setTimeout(() => {
            window.location.href = '/profile'
          }, 1000)
        } catch (error) {
          displayError(
            'Error en el inicio de sesión. Verifica tus credenciales.',
            errorMessage,
            'form'
          )
          showToast(
            'Error al iniciar sesión. Intente de nuevo.',
            'error',
            'center'
          )
        }
      },
      'login-form',
      'Iniciar Sesión'
    )

    loginContainer.appendChild(form) // Añadimos el formulario después de haber limpiado el loader
  }, 500) // Puedes ajustar el tiempo de carga para que el loader se vea, o eliminar el delay si no es necesario

  return loginContainer
}

export default createLoginForm
