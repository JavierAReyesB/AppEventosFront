// src/utils/errorHandler.js

/**
 * Función reutilizable para manejar y mostrar errores en la interfaz de usuario.
 *
 * @param {string} message - El mensaje de error que se mostrará al usuario.
 * @param {HTMLElement} element - El elemento HTML donde se mostrará el error.
 * @param {string} [errorType='general'] - El tipo de error (general, form, network).
 */
export function displayError(message, element, errorType = 'general') {
  // Limpiar errores previos
  element.innerHTML = ''
  element.classList.add('error-message') // Agregar clase para estilo

  // Crear el mensaje de error
  const errorMessage = document.createElement('p')
  errorMessage.textContent = message

  // Dependiendo del tipo de error, puedes agregar más personalización
  if (errorType === 'form') {
    errorMessage.style.color = 'red' // Personalización para errores de formulario
  } else if (errorType === 'network') {
    errorMessage.style.color = 'orange' // Personalización para errores de red
  }

  // Añadir el mensaje de error al elemento especificado
  element.appendChild(errorMessage)
}

/**
 * Función para limpiar mensajes de error anteriores.
 *
 * @param {HTMLElement} element - El elemento HTML que contiene los errores.
 */
export function clearError(element) {
  element.innerHTML = '' // Limpiar el contenido de errores previos
  element.classList.remove('error-message') // Remover la clase de error
}
