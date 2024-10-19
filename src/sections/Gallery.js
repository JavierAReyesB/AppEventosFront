import fetchApi from '../services/apiService'
import '../styles/Gallery.css'

async function createGallery() {
  const container = document.createElement('div')
  container.classList.add('gallery-container')

  const events = await fetchApi(
    `${import.meta.env.VITE_APP_BACKEND_URL}/api/events`,
    'GET'
  )

  if (events.length === 0) {
    const noImageMessage = document.createElement('p')
    noImageMessage.textContent = 'No hay imágenes de eventos disponibles.'
    container.appendChild(noImageMessage)
    return container
  }

  const gallery = document.createElement('div')
  gallery.classList.add('gallery')

  let currentIndex = 0
  let totalImages = events.filter((event) => event.poster).length
  let posters = events
    .filter((event) => event.poster)
    .map((event) => event.poster)

  events.forEach((event, index) => {
    if (event.poster) {
      const img = document.createElement('img')
      img.src = event.poster
      img.alt = `Imagen del evento ${event.title}`
      img.classList.add('gallery-image')

      img.addEventListener('click', () => {
        currentIndex = index
        openLightbox(posters[currentIndex])
      })

      gallery.appendChild(img)
    }
  })

  container.appendChild(gallery)

  const lightbox = document.createElement('div')
  lightbox.classList.add('lightbox')
  const lightboxImage = document.createElement('img')
  lightboxImage.classList.add('lightbox-image')
  lightbox.appendChild(lightboxImage)

  const closeButton = document.createElement('span')
  closeButton.classList.add('close-button')
  closeButton.textContent = '×'
  closeButton.addEventListener('click', () => {
    lightbox.style.display = 'none'
  })
  lightbox.appendChild(closeButton)

  const prevButton = document.createElement('span')
  prevButton.classList.add('nav-button', 'prev-button')
  prevButton.textContent = '❮'
  prevButton.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1
    openLightbox(posters[currentIndex])
  })
  lightbox.appendChild(prevButton)

  const nextButton = document.createElement('span')
  nextButton.classList.add('nav-button', 'next-button')
  nextButton.textContent = '❯'
  nextButton.addEventListener('click', () => {
    currentIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1
    openLightbox(posters[currentIndex])
  })
  lightbox.appendChild(nextButton)

  container.appendChild(lightbox)

  function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc
    lightbox.style.display = 'flex'
  }

  return container
}

export default createGallery
