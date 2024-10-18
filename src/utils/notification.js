// utils/notification.js
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/toastifyStyles.css' // Importa tu archivo CSS personalizado

export function showToast(
  message,
  type = 'success',
  position = 'center',
  duration = 3000
) {
  Toastify({
    text: message,
    duration: duration,
    gravity: 'top',
    position: position, // Esto define la posición correctamente
    className: `toastify--${type}`, // Usa las clases CSS para los estilos
    close: true, // Muestra el botón de cierre
    stopOnFocus: true // Pausar si el usuario pone el cursor encima
  }).showToast()
}
