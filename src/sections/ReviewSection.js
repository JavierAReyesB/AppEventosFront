import '../styles/ReviewSection.css'
import fetchApi from '../services/apiService'
import { createForm } from '../components/Form.js'
import { showToast } from '../utils/notification.js'
import { displayError, clearError } from '../utils/errorHandler.js'

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

async function fetchReviews(eventId) {
  try {
    return await fetchApi(`${backendUrl}/api/reviews/event/${eventId}`)
  } catch (error) {
    console.error('Error:', error)
    displayError('Error al obtener las reseñas.', document.body, 'network')
    showToast('Error al obtener las reseñas.', 'error', 'center')
    throw new Error('Error al obtener las reseñas del evento')
  }
}

async function addReview(eventId, reviewData) {
  const token = localStorage.getItem('token')

  try {
    await fetchApi(
      `${backendUrl}/api/reviews/`,
      'POST',
      { ...reviewData, event: eventId },
      token
    )
    const newReviewSection = await createReviewSection(eventId)
    const currentSection = document.querySelector('.review-section')
    currentSection.replaceWith(newReviewSection)
    showToast('Reseña agregada con éxito.', 'success', 'center')
  } catch (error) {
    console.error('Error al agregar la reseña:', error)
    displayError('Error al agregar la reseña.', document.body, 'form')
    showToast('Error al agregar la reseña.', 'error', 'center')
  }
}

async function modifyReview(eventId, reviewId, reviewData) {
  const token = localStorage.getItem('token')
  try {
    await fetchApi(
      `${backendUrl}/api/reviews/${reviewId}`,
      'PUT',
      reviewData,
      token
    )
    const updatedReviewSection = await createReviewSection(eventId)
    const currentSection = document.querySelector('.review-section')
    currentSection.replaceWith(updatedReviewSection)
    showToast('Reseña modificada con éxito.', 'success', 'center')
  } catch (error) {
    console.error('Error al modificar la reseña:', error)
    displayError('Error al modificar la reseña.', document.body, 'form')
    showToast('Error al modificar la reseña.', 'error', 'center')
  }
}

async function deleteReview(reviewId, reviewElement, eventId) {
  const token = localStorage.getItem('token')

  try {
    await fetchApi(
      `${backendUrl}/api/reviews/${reviewId}`,
      'DELETE',
      null,
      token
    )
    reviewElement.remove()
    const updatedReviewSection = await createReviewSection(eventId)
    const currentSection = document.querySelector('.review-section')
    currentSection.replaceWith(updatedReviewSection)
    showToast('Reseña eliminada con éxito.', 'success', 'center')
  } catch (error) {
    console.error('Error al eliminar la reseña:', error)
    displayError('Error al eliminar la reseña.', document.body, 'network')
    showToast('Error al eliminar la reseña.', 'error', 'center')
  }
}

function createReviewForm(eventId, existingReview = null) {
  const fields = [
    {
      type: 'textarea',
      name: 'content',
      label: 'Escribe tu reseña',
      placeholder: 'Escribe tu reseña...',
      isRequired: true
    },
    {
      type: 'number',
      name: 'rating',
      label: 'Calificación (1-5)',
      placeholder: 'Calificación (1-5)',
      isRequired: true
    }
  ]

  return createForm(
    fields,
    async (formData) => {
      if (existingReview) {
        await modifyReview(eventId, existingReview._id, formData)
      } else {
        await addReview(eventId, formData)
      }
    },
    'review-form',
    existingReview ? 'Modificar Reseña' : 'Enviar Reseña'
  )
}

async function createReviewSection(eventId, eventAttendees = []) {
  const container = document.createElement('div')
  container.classList.add('review-section')

  const title = document.createElement('h3')
  title.textContent = 'Reseñas del Evento'
  container.appendChild(title)

  const reviews = await fetchReviews(eventId)

  const token = localStorage.getItem('token')
  let userRole = null
  let userId = null

  if (token) {
    const decoded = jwt_decode(token)
    userRole = decoded.role
    userId = decoded.id
  }

  if (reviews.length === 0) {
    const noReviewsMessage = document.createElement('p')
    noReviewsMessage.textContent = 'Aún no hay reseñas para este evento.'
    container.appendChild(noReviewsMessage)
  } else {
    const reviewsList = document.createElement('ul')
    reviews.forEach((review) => {
      const reviewItem = document.createElement('li')
      reviewItem.textContent = `${review.user.name}: ${review.content} (Rating: ${review.rating}/5)`
      reviewsList.appendChild(reviewItem)

      if (
        userRole === 'admin' ||
        userRole === 'organizer' ||
        review.user._id === userId
      ) {
        const editButton = document.createElement('button')
        editButton.textContent = 'Editar'
        editButton.onclick = () => {
          const reviewForm = createReviewForm(eventId, review)
          container.replaceChild(reviewForm, container.lastChild)
        }

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar'
        deleteButton.onclick = () =>
          deleteReview(review._id, reviewItem, eventId)

        reviewItem.appendChild(editButton)
        reviewItem.appendChild(deleteButton)
      }
    })
    container.appendChild(reviewsList)
  }

  if (
    userRole === 'admin' ||
    userRole === 'organizer' ||
    eventAttendees.includes(userId)
  ) {
    const reviewForm = createReviewForm(eventId)
    container.appendChild(reviewForm)
  }

  return container
}

export default createReviewSection
