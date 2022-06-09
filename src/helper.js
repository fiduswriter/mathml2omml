export function cleanText (element, options = { text: 'remove' }) {
  switch (element.name) {
    case 'mi':
    case 'mn':
    case 'mo':
    case 'ms':
    case 'mtext':
      options = { text: 'trim' }
      break
    default:
      break
  }
  if (element.elements) {
    if (options.text === 'remove') {
      element.elements = element.elements.filter(child => child.type !== 'text')
    } else if (options.text === 'trim') {
      element.elements.forEach(child => {
        if (child.type === 'text') {
          child.text = child.text.trim()
        }
      })
    }
    element.elements.forEach(child => {
      if (child.type === 'element') {
        cleanText(child, options)
      }
    })
  }
}
