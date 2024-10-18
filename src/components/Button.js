// Función para crear un botón reutilizable
function createButton({ text, onClick, className = '' }) {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('custom-button', ...className.split(' ')) // Permitir múltiples clases

  // Agregar evento de clic
  button.addEventListener('click', onClick)

  return button
}

// Exportar como default
export default createButton
