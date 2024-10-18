// src/components/Main.js
function createMain() {
  const main = document.createElement('main')
  main.classList.add('custom-main')

  // Aquí puedes agregar contenido adicional al main
  const content = document.createElement('p')
  content.textContent = 'Este es el contenido principal de la aplicación.'
  main.appendChild(content)

  return main
}

export default createMain // Asegúrate de que esta línea esté presente
