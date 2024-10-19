import '../styles/Footer.css'

function createFooter() {
  const footer = document.createElement('footer')
  footer.classList.add('footer')

  const footerSections = document.createElement('div')
  footerSections.classList.add('footer-sections')

  const categories = [
    {
      title: 'Acerca de Eventos App',
      links: [
        { text: 'Prensa', href: '/' },
        { text: 'Únete al equipo', href: '/' },
        { text: 'Becas de Excelencia', href: '/' },
        { text: 'Tarjetas Regalo', href: '/' }
      ]
    },
    {
      title: 'Colabora con nosotros',
      links: [
        { text: 'Gestiona tu evento', href: '/gestiona-evento' },
        { text: 'Publica tu evento', href: '/publica-evento' },
        { text: 'Programa de Afiliados', href: '/afiliados' },
        { text: 'Programa de Influencers', href: '/influencers' }
      ]
    },
    {
      title: 'Síguenos',
      links: [
        { text: 'Facebook', href: 'https://www.facebook.com' },
        { text: 'Twitter', href: 'https://www.twitter.com' },
        { text: 'Instagram', href: 'https://www.instagram.com' },
        { text: 'TikTok', href: 'https://www.tiktok.com' },
        { text: 'LinkedIn', href: 'https://www.linkedin.com' },
        { text: 'YouTube', href: 'https://www.youtube.com' }
      ]
    },
    {
      title: 'Descubre',
      links: [
        { text: 'Locales y espacios', href: 'https://www.google.com' },
        { text: 'España', href: 'https://www.google.com' },
        { text: 'Hoy', href: 'https://www.google.com' },
        { text: 'Esta semana', href: 'https://www.google.com' },
        { text: 'Navidad', href: 'https://www.google.com' },
        { text: 'Año Nuevo', href: 'https://www.google.com' }
      ]
    }
  ]

  categories.forEach((section) => {
    const sectionDiv = document.createElement('div')
    sectionDiv.classList.add('footer-section')

    const sectionTitle = document.createElement('h4')
    sectionTitle.textContent = section.title

    const sectionList = document.createElement('ul')
    section.links.forEach((link) => {
      const listItem = document.createElement('li')
      const linkItem = document.createElement('a')
      linkItem.textContent = link.text

      linkItem.href = link.href
      if (link.href.startsWith('/')) {
        linkItem.addEventListener('click', (e) => {
          e.preventDefault()
          window.navigateTo(link.href)
        })
      } else {
        linkItem.target = '_blank'
      }

      listItem.appendChild(linkItem)
      sectionList.appendChild(listItem)
    })

    sectionDiv.appendChild(sectionTitle)
    sectionDiv.appendChild(sectionList)
    footerSections.appendChild(sectionDiv)
  })

  const appSection = document.createElement('div')
  appSection.classList.add('footer-app')

  const appText = document.createElement('p')
  appText.textContent =
    'Descubre los próximos planes y experiencias que mejor se adapten a ti.'
  appText.classList.add('centered-text')

  appSection.appendChild(appText)

  const textElement = document.createElement('p')
  textElement.textContent = '© 2024 Eventos App. Todos los derechos reservados.'
  textElement.classList.add('footer-rights')

  footer.appendChild(footerSections)
  footer.appendChild(appSection)
  footer.appendChild(textElement)

  return footer
}

export default createFooter
