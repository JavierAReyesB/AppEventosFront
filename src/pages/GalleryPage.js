import createGallery from '../sections/Gallery.js' // Importar la galería
import createLoader from '../components/Loader.js' // Importar la función del loader
import '../styles/Gallery.css' // Importar los estilos de la galería

async function createGalleryPage() {
  // Selecciona el main o el contenedor principal donde se inserta la galería
  const main = document.querySelector('main.custom-main')

  // Verifica si ya existe un contenedor de la galería y elimínalo si es necesario
  const existingGalleryContainer = main.querySelector('.gallery-page-container')
  if (existingGalleryContainer) {
    existingGalleryContainer.remove()
  }

  const container = document.createElement('div')
  container.classList.add('gallery-page-container')

  const title = document.createElement('h1')
  title.textContent = 'Galería de Eventos'
  title.classList.add('gallery-title')
  container.appendChild(title)

  // Mostrar loader mientras se cargan los eventos
  const loader = createLoader()
  container.appendChild(loader)

  // Llamar a la función que crea la galería
  const gallery = await createGallery()

  // Remover el loader una vez que la galería ha sido cargada
  container.removeChild(loader)

  // Agregar la galería
  container.appendChild(gallery)

  // Agregar el nuevo contenedor al main
  main.appendChild(container)

  return container
}

export default createGalleryPage
