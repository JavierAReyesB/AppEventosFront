export function displayError(message, element, errorType = 'general') {
  element.innerHTML = ''
  element.classList.add('error-message')

  const errorMessage = document.createElement('p')
  errorMessage.textContent = message

  if (errorType === 'form') {
    errorMessage.style.color = 'red'
  } else if (errorType === 'network') {
    errorMessage.style.color = 'orange'
  }

  element.appendChild(errorMessage)
}

export function clearError(element) {
  element.innerHTML = ''
  element.classList.remove('error-message')
}
