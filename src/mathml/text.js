export function text (element, targetParent, previousSibling, nextSibling, ancestors) {
  let text = element.text.replace(/[\u2062]|[\u200B]/g, '')
  if (ancestors.find(element => ['mi', 'mn', 'mo'].includes(element.name))) {
    text = text.replace(/\s/g, '')
  } else {
    const ms = ancestors.find(element => element.name === 'ms')
    if (ms) {
      text = (ms.attributes?.lquote || '"') + text + (ms.attributes?.rquote || '"')
    }
  }
  if (text.length) {
    if (targetParent.elements.length && targetParent.elements[targetParent.elements.length - 1].type === 'text') {
      targetParent.elements[targetParent.elements.length - 1].text += text
    } else {
      targetParent.elements.push({
        type: 'text',
        text
      })
    }
  }
  return targetParent
}
