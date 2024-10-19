import '../styles/LoginRegister.css'
import { registerUser } from '../services/authService.js'
import { createForm } from '../components/Form.js'
import { displayError, clearError } from '../utils/errorHandler.js'
import { showToast } from '../utils/notification.js'
import createHeader from '../sections/Header.js'

function createRegisterForm() {
  const registerContainer = document.createElement('div')
  registerContainer.classList.add('form-container')

  const title = document.createElement('h1')
  title.textContent = 'Registro'
  registerContainer.appendChild(title)

  const errorMessage = document.createElement('p')
  errorMessage.classList.add('error-message')
  registerContainer.appendChild(errorMessage)

  const fields = [
    {
      type: 'text',
      name: 'name',
      label: 'Nombre',
      placeholder: 'Nombre',
      isRequired: true
    },
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
    }
  ]

  const form = createForm(
    fields,
    async (formData) => {
      clearError(errorMessage)

      try {
        const response = await registerUser(formData)
        showToast('Registro exitoso. ¡Bienvenido!', 'success', 'center')

        localStorage.setItem('token', response.token)

        const newHeader = createHeader()
        document.querySelector('header').replaceWith(newHeader)

        setTimeout(() => {
          window.location.href = '/profile'
        }, 1000)
      } catch (error) {
        displayError(
          'Error en el registro. Intenta de nuevo o verifica tus datos.',
          errorMessage,
          'form'
        )
        showToast('Error en el registro. Intenta de nuevo.', 'error', 'center')
      }
    },
    'register-form',
    'Registrar'
  )

  registerContainer.appendChild(form)
  return registerContainer
}

export default createRegisterForm
