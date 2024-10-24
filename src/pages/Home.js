import '../styles/Home.css'
import createHero from '../sections/Hero.js'
import { showToast } from '../utils/notification.js'

function createHome() {
  const container = document.createElement('div')
  container.classList.add('home-container')

  try {
    const hero = createHero()
    container.appendChild(hero)
  } catch (error) {
    console.error('Error al cargar el hero:', error)
    showToast('Error al cargar la sección principal.', 'error', 'center')
  }

  const banner = document.createElement('div')
  banner.classList.add('banner')

  const bannerText = document.createElement('div')
  bannerText.classList.add('banner-text')
  bannerText.innerHTML = `
    <h1>Bienvenido a EventosApp</h1>
    <p>Organiza y asiste a los mejores eventos</p>
    <button class="banner-button">Ver Eventos</button>
  `

  banner.appendChild(bannerText)
  container.appendChild(banner)

  // Cambiamos el enlace <a> por un botón con un listener
  bannerText
    .querySelector('.banner-button')
    .addEventListener('click', (event) => {
      event.preventDefault()

      // Verificar si ya existe el contenedor de eventos para evitar duplicación
      if (!document.querySelector('.event-list-container')) {
        // Navegación controlada sin recargar la página completa
        window.history.pushState({}, '', '/events')
        window.navigateTo('/events') // Esta es la función que controla la navegación en tu app
      } else {
        console.log('El contenedor de eventos ya existe, evitando duplicación.')
      }
    })

  return container
}

export default createHome
