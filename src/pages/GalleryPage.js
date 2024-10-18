import createGallery from '../sections/Gallery.js' // Importar la galería
import '../styles/Gallery.css' // Importar los estilos de la galería

async function createGalleryPage() {
  const container = document.createElement('div')
  container.classList.add('gallery-page-container')

  const title = document.createElement('h1')
  title.textContent = 'Galería de Eventos'
  title.classList.add('gallery-title')
  container.appendChild(title)

  // Llamar a la función que crea la galería
  const gallery = await createGallery()
  container.appendChild(gallery)

  return container
}

export default createGalleryPage
