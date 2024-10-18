import '../styles/Loader.css' // Asegúrate de que la ruta sea correcta

function createLoader() {
  const loaderContainer = document.createElement('div')
  loaderContainer.classList.add('loader-container')

  const loader = document.createElement('div')
  loader.classList.add('loader')

  const loaderText = document.createElement('p')
  loaderText.classList.add('loader-text')
  loaderText.textContent = 'Cargando eventos...'

  loaderContainer.appendChild(loader)
  loaderContainer.appendChild(loaderText)

  console.log('createLoader called') // Verificar si la función se ejecuta
  console.log(loaderText) // Verificar el contenido del loaderText

  return loaderContainer
}

export default createLoader
