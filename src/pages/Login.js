import '../styles/LoginRegister.css'
import { loginUser } from '../services/authService.js'
import { createForm } from '../components/Form.js'
import { displayError, clearError } from '../utils/errorHandler.js'
import { showToast } from '../utils/notification.js' // Importa la función de notificación

function createLoginForm() {
  const loginContainer = document.createElement('div')
  loginContainer.classList.add('form-container')

  const title = document.createElement('h1')
  title.textContent = 'Iniciar Sesión'
  loginContainer.appendChild(title)

  const errorMessage = document.createElement('p')
  errorMessage.classList.add('error-message')
  loginContainer.appendChild(errorMessage)

  // Definir los campos del formulario de inicio de sesión
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
      isRequired: false // Este campo no es obligatorio
    }
  ]

  // Crear el formulario reutilizable usando createForm de Form.js
  const form = createForm(
    fields,
    async (formData) => {
      clearError(errorMessage) // Limpiar cualquier mensaje de error previo

      try {
        const response = await loginUser(formData)

        // Llamar a showToast para mostrar la notificación de éxito
        showToast('Inicio de sesión exitoso. ¡Bienvenido!', 'success', 'center')

        // Guardar el token en localStorage o sessionStorage
        const storage = formData.rememberMe ? localStorage : sessionStorage
        storage.setItem('token', response.token)

        // Redirigir al perfil de usuario
        setTimeout(() => {
          window.location.href = '/profile'
        }, 1000) // Redirigir después de 1 segundo
      } catch (error) {
        displayError(
          'Error en el inicio de sesión. Verifica tus credenciales.',
          errorMessage,
          'form'
        )

        // Llamar a showToast para mostrar la notificación de error
        showToast(
          'Error al iniciar sesión. Intente de nuevo.',
          'error',
          'center'
        )
      }
    },
    'login-form', // Clase CSS opcional para personalizar el formulario
    'Iniciar Sesión' // Texto del botón de envío
  )

  loginContainer.appendChild(form)
  return loginContainer
}

export default createLoginForm
