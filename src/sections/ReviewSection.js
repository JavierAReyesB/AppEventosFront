import '../styles/ReviewSection.css' // Asegúrate de que el archivo CSS esté correctamente importado
import fetchApi from '../services/apiService' // Importamos la función fetchApi
import { createForm } from '../components/Form.js' // Importamos el nuevo formulario reutilizable
import { showToast } from '../utils/notification.js' // Importamos la función de notificación

// Función para obtener las reseñas del evento desde la API
async function fetchReviews(eventId) {
  try {
    return await fetchApi(`http://localhost:5000/api/reviews/event/${eventId}`)
  } catch (error) {
    console.error('Error:', error)
    showToast('Error al obtener las reseñas.', 'error', 'center')
    throw new Error('Error al obtener las reseñas del evento')
  }
}

// Función para agregar una nueva reseña
async function addReview(eventId, reviewData) {
  const token = localStorage.getItem('token')

  try {
    await fetchApi(
      `http://localhost:5000/api/reviews/`,
      'POST',
      { ...reviewData, event: eventId },
      token
    )
    const newReviewSection = await createReviewSection(eventId)
    const currentSection = document.querySelector('.review-section')
    currentSection.replaceWith(newReviewSection) // Reemplaza la sección actual por la actualizada
    showToast('Reseña agregada con éxito.', 'success', 'center')
  } catch (error) {
    console.error('Error al agregar la reseña:', error)
    showToast('Error al agregar la reseña.', 'error', 'center')
  }
}

// Función para modificar una reseña existente
async function modifyReview(eventId, reviewId, reviewData) {
  const token = localStorage.getItem('token')
  try {
    await fetchApi(
      `http://localhost:5000/api/reviews/${reviewId}`,
      'PUT',
      reviewData,
      token
    )
    const updatedReviewSection = await createReviewSection(eventId) // Asegúrate de actualizar la sección completa
    const currentSection = document.querySelector('.review-section')
    currentSection.replaceWith(updatedReviewSection) // Reemplaza la sección actual por la actualizada
    showToast('Reseña modificada con éxito.', 'success', 'center')
  } catch (error) {
    console.error('Error al modificar la reseña:', error)
    showToast('Error al modificar la reseña.', 'error', 'center')
  }
}

// Función para eliminar una reseña
async function deleteReview(reviewId, reviewElement, eventId) {
  const token = localStorage.getItem('token')

  console.log('Token usado para eliminar:', token) // Asegúrate de que se imprime el token correcto

  try {
    await fetchApi(
      `http://localhost:5000/api/reviews/${reviewId}`,
      'DELETE',
      null,
      token
    )
    reviewElement.remove() // Eliminamos el elemento visualmente
    const updatedReviewSection = await createReviewSection(eventId)
    const currentSection = document.querySelector('.review-section')
    currentSection.replaceWith(updatedReviewSection)
    showToast('Reseña eliminada con éxito.', 'success', 'center')
  } catch (error) {
    console.error('Error al eliminar la reseña:', error)
    showToast('Error al eliminar la reseña.', 'error', 'center')
  }
}

// Función para crear el formulario de agregar o modificar reseñas
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
        await modifyReview(eventId, existingReview._id, formData) // Pasamos eventId y reviewId
      } else {
        await addReview(eventId, formData)
      }
    },
    'review-form',
    existingReview ? 'Modificar Reseña' : 'Enviar Reseña'
  )
}

// Función para crear la sección de reseñas
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
    const decoded = jwt_decode(token) // Decodificar el token utilizando el script global
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
