// Función para crear un botón genérico
function createButton({ text, onClick, className = '' }) {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('custom-button', className) // Clase base + clases opcionales

  // Añadir el evento de clic
  button.addEventListener('click', onClick)

  return button
}

// Función para crear una tarjeta
function createCard({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
  className = ''
}) {
  const card = document.createElement('div')
  card.classList.add('custom-card', className) // Clase base + clases opcionales

  const img = document.createElement('img')
  img.src = imageUrl
  img.alt = title

  const titleElement = document.createElement('h3')
  titleElement.textContent = title

  const descriptionElement = document.createElement('p')
  descriptionElement.textContent = description

  const button = createButton({
    text: buttonText,
    onClick: onButtonClick,
    className: 'card-button' // Clase para el botón dentro de la tarjeta
  })

  card.appendChild(img)
  card.appendChild(titleElement)
  card.appendChild(descriptionElement)
  card.appendChild(button)

  return card
}

// Ejemplo de uso
const cardContainer = document.getElementById('card-container') // Asegúrate de tener un contenedor en tu HTML

const cardData = {
  title: 'Título de la Tarjeta',
  description: 'Esta es una descripción de la tarjeta.',
  imageUrl: 'https://via.placeholder.com/150', // Cambia esto a la URL de tu imagen
  buttonText: 'Acción',
  onButtonClick: () => {
    alert('Botón de la tarjeta clickeado!')
  }
}

// Crear la tarjeta y añadirla al contenedor
const cardElement = createCard(cardData)
cardContainer.appendChild(cardElement)
