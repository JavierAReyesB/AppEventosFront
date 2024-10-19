// src/utils/navigation.js

/**
 * Función para crear un enlace de navegación reutilizable.
 * @param {string} href - La URL a la que redirigirá el enlace.
 * @param {string} text - El texto que se mostrará en el enlace.
 * @returns {HTMLElement} - Un elemento <a> listo para usar.
 */
export function createNavLink(href, text) {
  const link = document.createElement('a')
  link.href = href
  link.textContent = text
  link.addEventListener('click', (e) => {
    e.preventDefault()
    navigateTo(href) // Asegúrate de que navigateTo esté disponible en el contexto
  })
  return link
}
