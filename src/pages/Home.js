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
    <p>¿Estás listo para ser parte de los mejores eventos? En <strong>EventosApp</strong>, no solo asistes a eventos, ¡los haces tuyos! Conéctate con personas que comparten tus pasiones, encuentra los eventos más emocionantes cerca de ti o crea el tuyo propio y hazlo inolvidable. 🥳</p>
    <ul>
      <li>🔸 <strong>Regístrate ahora</strong> para recibir notificaciones personalizadas de los eventos más interesantes.</li>
      <li>🔸 <strong>Crea y organiza tus propios eventos</strong> para compartir momentos únicos con otros asistentes.</li>
      <li>🔸 <strong>Descubre</strong> una nueva forma de vivir cada experiencia.</li>
    </ul>
    <p>¿Qué esperas? ¡Únete hoy y empieza a disfrutar de la mejor manera de conectar con la diversión, la música, la cultura, y mucho más! 🚀</p>
    <button class="banner-button">Ver Eventos</button>
  `

  banner.appendChild(bannerText)
  container.appendChild(banner)

  bannerText
    .querySelector('.banner-button')
    .addEventListener('click', (event) => {
      event.preventDefault()

      if (!document.querySelector('.event-list-container')) {
        window.history.pushState({}, '', '/events')
        window.navigateTo('/events')
      } else {
        console.log('El contenedor de eventos ya existe, evitando duplicación.')
      }
    })

  return container
}

export default createHome
