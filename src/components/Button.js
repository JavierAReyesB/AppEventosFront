function createButton({ text, onClick, className = '' }) {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('custom-button', ...className.split(' '))

  button.addEventListener('click', onClick)

  return button
}

export default createButton
