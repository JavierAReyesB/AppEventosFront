import createGallery from '../sections/Gallery.js'
import createLoader from '../components/Loader.js'
import '../styles/Gallery.css'

async function createGalleryPage() {
  const container = document.createElement('div')
  container.classList.add('gallery-page-container')

  const title = document.createElement('h1')
  title.textContent = 'Galería de Eventos'
  title.classList.add('gallery-title')
  container.appendChild(title)

  const loader = createLoader()
  document.body.appendChild(loader)

  const gallery = await createGallery()

  document.body.removeChild(loader)

  container.appendChild(gallery)

  return container
}

export default createGalleryPage
