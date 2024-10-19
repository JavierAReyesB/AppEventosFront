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
  fieldContainer.className = className

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
      fieldInput.accept = accept
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

export function createForm(
  fields,
  onSubmit,
  formClassName = '',
  buttonText = 'Enviar'
) {
  const form = document.createElement('form')
  form.className = formClassName

  const inputs = {}

  fields.forEach((fieldConfig) => {
    const { fieldContainer, fieldInput } = createFormField(fieldConfig)
    form.appendChild(fieldContainer)
    inputs[fieldConfig.name] = fieldInput
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
    onSubmit(formData)
  })

  return form
}
