function createButton({ text, onClick, className = '' }) {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('custom-button', className)

  button.addEventListener('click', onClick)

  return button
}

function createCard({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
  className = ''
}) {
  const card = document.createElement('div')
  card.classList.add('custom-card', className)

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
    className: 'card-button'
  })

  card.appendChild(img)
  card.appendChild(titleElement)
  card.appendChild(descriptionElement)
  card.appendChild(button)

  return card
}
