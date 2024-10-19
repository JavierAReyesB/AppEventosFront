import createGallery from '../sections/Gallery.js' // Importar la galería
import createLoader from '../components/Loader.js' // Importar la función del loader
import '../styles/Gallery.css' // Importar los estilos de la galería

async function createGalleryPage() {
  const container = document.createElement('div')
  container.classList.add('gallery-page-container')

  const title = document.createElement('h1')
  title.textContent = 'Galería de Eventos'
  title.classList.add('gallery-title')
  container.appendChild(title)

  // Mostrar loader mientras se cargan los eventos
  const loader = createLoader()
  document.body.appendChild(loader) // Añadir el loader al body para asegurar su visibilidad

  // Llamar a la función que crea la galería
  const gallery = await createGallery()

  // Remover el loader una vez que la galería ha sido cargada
  document.body.removeChild(loader)

  container.appendChild(gallery)

  return container
}

export default createGalleryPage
