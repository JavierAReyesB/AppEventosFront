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
    <a href="/events" class="banner-button">Ver Eventos</a>
  `

  banner.appendChild(bannerText)
  container.appendChild(banner)

  return container
}

export default createHome
