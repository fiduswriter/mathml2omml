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
  if (element.children) {
    if (options.text === 'remove') {
      element.children = element.children.filter(child => child.type !== 'text')
    } else if (options.text === 'trim') {
      element.children.forEach(child => {
        if (child.type === 'text') {
          child.data = child.data.trim()
        }
      })
    }
    element.children.forEach(child => {
      if (child.type === 'tag') {
        cleanText(child, options)
      }
    })
  }
}

export function getTextContent (node, trim = true) {
  let returnString = ''
  if (node.type === 'text') {
    let text = node.data.replace(/[\u2062]|[\u200B]/g, '')
    if (trim) {
      text = text.trim()
    }
    returnString += text
  } else if (node.children) {
    node.children.forEach(
      subNode => {
        returnString += getTextContent(subNode, trim)
      }
    )
  }
  return returnString
}
