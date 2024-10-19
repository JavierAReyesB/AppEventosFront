function createMain() {
  const main = document.createElement('main')
  main.classList.add('custom-main')

  const content = document.createElement('p')
  content.textContent = 'Este es el contenido principal de la aplicación.'
  main.appendChild(content)

  return main
}

export default createMain
