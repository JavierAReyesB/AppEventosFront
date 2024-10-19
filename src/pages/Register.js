import '../styles/LoginRegister.css'
import { registerUser } from '../services/authService.js'
import { createForm } from '../components/Form.js' // Importamos el nuevo Form.js
import { displayError, clearError } from '../utils/errorHandler.js' // Importamos el manejador de errores
import { showToast } from '../utils/notification.js' // Importamos la función de notificación

function createRegisterForm() {
  const registerContainer = document.createElement('div')
  registerContainer.classList.add('form-container')

  const title = document.createElement('h1')
  title.textContent = 'Registro'
  registerContainer.appendChild(title)

  const errorMessage = document.createElement('p')
  errorMessage.classList.add('error-message')
  registerContainer.appendChild(errorMessage)

  // Definir los campos del formulario de registro
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

  // Crear el formulario utilizando `createForm` de `Form.js`
  const form = createForm(
    fields,
    async (formData) => {
      clearError(errorMessage) // Limpiar cualquier mensaje de error previo

      try {
        const response = await registerUser(formData)

        // Mostrar notificación de éxito con `Toastify`
        showToast('Registro exitoso. ¡Bienvenido!', 'success', 'center')

        localStorage.setItem('token', response.token) // Guardar token si es necesario

        setTimeout(() => {
          window.location.href = '/profile'
          // Redirigir al perfil de usuario después de 1 segundo
        }, 1000)
      } catch (error) {
        displayError(
          'Error en el registro. Intenta de nuevo o verifica tus datos.',
          errorMessage,
          'form'
        )

        // Mostrar notificación de error con `Toastify`
        showToast('Error en el registro. Intenta de nuevo.', 'error', 'center')
      }
    },
    'register-form', // Clase CSS opcional para personalizar el formulario
    'Registrar' // Texto del botón de envío
  )

  registerContainer.appendChild(form)
  return registerContainer
}

export default createRegisterForm
