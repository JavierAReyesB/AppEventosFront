import '../styles/Hero.css'

function createHero() {
  const container = document.createElement('div')
  container.classList.add('hero-container')

  const img = document.createElement('img')
  img.src =
    'https://media.feverup.com/image/upload/f_auto,w_1980,h_458,c_lfill,g_auto/t_Optimized_Version/v1728911166/PD-VANGOGHEXP-PHOTO-STARRYNIGHT-RGB-06_iufdmx_CROP_whagq7.jpg'
  img.alt = 'Imagen del evento'
  img.classList.add('hero-image')

  const textContainer = document.createElement('div')
  textContainer.classList.add('hero-text')

  const title = document.createElement('h1')
  title.textContent = 'Madrid'
  title.classList.add('hero-title')

  const subtitle = document.createElement('p')
  subtitle.textContent = 'Cosas que hacer: eventos, experiencias y mucho más'
  subtitle.classList.add('hero-subtitle')

  textContainer.appendChild(title)
  textContainer.appendChild(subtitle)

  container.appendChild(img)
  container.appendChild(textContainer)

  return container
}

export default createHero
