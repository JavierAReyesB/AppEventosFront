import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/toastifyStyles.css'

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
    position: position,
    className: `toastify--${type}`,
    close: true,
    stopOnFocus: true
  }).showToast()
}
