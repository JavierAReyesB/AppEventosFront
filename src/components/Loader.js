import '../styles/Loader.css'

function createLoader() {
  const loaderContainer = document.createElement('div')
  loaderContainer.classList.add('loader-container')

  const loader = document.createElement('div')
  loader.classList.add('loader')

  const loaderText = document.createElement('p')
  loaderText.classList.add('loader-text')
  loaderText.textContent = 'Cargando ...'

  loaderContainer.appendChild(loader)
  loaderContainer.appendChild(loaderText)

  console.log('createLoader called')
  console.log(loaderText)

  return loaderContainer
}

export default createLoader
