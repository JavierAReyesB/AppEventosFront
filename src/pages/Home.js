import '../styles/Home.css'
import createHero from '../sections/Hero.js' // Importar el Hero
import { showToast } from '../utils/notification.js' // Importamos la función de notificación

function createHome() {
  const container = document.createElement('div')
  container.classList.add('home-container')

  // Integrar el Hero antes del banner
  try {
    const hero = createHero() // Crear el hero sin necesidad de async/await
    container.appendChild(hero)
  } catch (error) {
    console.error('Error al cargar el hero:', error)

    // Mostrar notificación de error si no se puede cargar el Hero
    showToast('Error al cargar la sección principal.', 'error', 'center')
  }

  // Crear el banner (sin imagen)
  const banner = document.createElement('div')
  banner.classList.add('banner')

  const bannerText = document.createElement('div')
  bannerText.classList.add('banner-text')
  bannerText.innerHTML = `
    <h1>Bienvenido a EventosApp</h1>
    <p>Organiza y asiste a los mejores eventos</p>
    <a href="/events" class="banner-button">Ver Eventos</a>
  `

  banner.appendChild(bannerText)
  container.appendChild(banner)

  return container
}

export default createHome
