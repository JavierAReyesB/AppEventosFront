// Form.js

/**
 * Función para crear un campo de formulario reutilizable.
 *
 * @param {Object} options - Opciones para el campo de formulario.
 * @param {string} options.type - Tipo de input (text, date, file, etc.).
 * @param {string} options.name - Nombre del campo de formulario.
 * @param {string} options.label - Etiqueta visible para el campo.
 * @param {boolean} [options.isRequired=true] - Si el campo es obligatorio.
 * @param {string} [options.placeholder] - Placeholder opcional para el campo.
 * @param {string} [options.className] - Clases CSS opcionales para personalizar el estilo.
 * @param {string} [options.accept] - Tipos de archivos aceptados (solo para campos de tipo "file").
 *
 * @returns {Object} - Un objeto con el contenedor del campo de formulario y el input.
 */
export function createFormField({
  type = 'text',
  name,
  label,
  isRequired = true,
  placeholder = '',
  className = '',
  accept = ''
}) {
  const fieldContainer = document.createElement('div')
  fieldContainer.className = className // Permitir aplicar estilos personalizados

  const fieldLabel = document.createElement('label')
  fieldLabel.textContent = label
  fieldLabel.htmlFor = name
  fieldContainer.appendChild(fieldLabel)

  let fieldInput
  if (type === 'textarea') {
    fieldInput = document.createElement('textarea')
  } else {
    fieldInput = document.createElement('input')
    fieldInput.type = type
    if (accept) {
      fieldInput.accept = accept // Aceptar solo ciertos tipos de archivos (para imágenes, PDFs, etc.)
    }
  }

  fieldInput.name = name
  fieldInput.id = name
  fieldInput.required = isRequired
  if (placeholder) {
    fieldInput.placeholder = placeholder
  }

  fieldContainer.appendChild(fieldInput)
  return { fieldContainer, fieldInput }
}

/**
 * Función para crear un formulario reutilizable.
 *
 * @param {Array} fields - Array de configuraciones de campos.
 * @param {Function} onSubmit - Función que se ejecuta cuando se envía el formulario.
 * @param {string} [formClassName] - Clases CSS opcionales para personalizar el formulario.
 * @param {string} [buttonText='Enviar'] - Texto del botón de envío.
 *
 * @returns {HTMLElement} - El formulario completo.
 */
export function createForm(
  fields,
  onSubmit,
  formClassName = '',
  buttonText = 'Enviar'
) {
  const form = document.createElement('form')
  form.className = formClassName // Permitir aplicar clases personalizadas al formulario

  const inputs = {}

  fields.forEach((fieldConfig) => {
    const { fieldContainer, fieldInput } = createFormField(fieldConfig)
    form.appendChild(fieldContainer)
    inputs[fieldConfig.name] = fieldInput // Guardar los inputs para acceder a sus valores después
  })

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.textContent = buttonText
  form.appendChild(submitButton)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = {}
    fields.forEach((field) => {
      formData[field.name] =
        field.type === 'file'
          ? inputs[field.name].files[0]
          : inputs[field.name].value
    })
    onSubmit(formData) // Llamar a la función de envío personalizada
  })

  return form
}
