import { getStyle } from './text_style'

const STYLES = {
  bold: 'b',
  italic: 'i',
  'bold-italic': 'bi'
}

function textContainer (element, targetParent, previousSibling, nextSibling, ancestors, textType) {
  if (previousSibling.isNary) {
    const previousSiblingTarget = targetParent.elements[targetParent.elements.length - 1]
    targetParent = previousSiblingTarget.elements[previousSiblingTarget.elements.length - 1]
  }

  const hasMglyphChild = element.elements && element.elements.find(element => element.name === 'mglyph')
  const style = getStyle(element, ancestors, previousSibling?.style)
  element.style = style // Add it to element to make it comparable
  element.hasMglyphChild = hasMglyphChild
  const styleSame = Object.keys(style).every(key => {
    const previousStyle = previousSibling?.style
    return (previousStyle && style[key] === previousStyle[key])
  }) && previousSibling?.hasMglyphChild === hasMglyphChild
  const sameGroup = ( // Only group mtexts or mi, mn, mo with oneanother.
    textType === previousSibling?.name
  ) || (
    ['mi', 'mn', 'mo'].includes(textType) && ['mi', 'mn', 'mo'].includes(previousSibling?.name)
  )
  let targetElement
  if (sameGroup && styleSame && !hasMglyphChild) {
    const rElement = targetParent.elements[targetParent.elements.length - 1]
    targetElement = rElement.elements[rElement.elements.length - 1]
  } else {
    const rElement = {
      name: 'm:r',
      type: 'element',
      elements: []
    }

    if (style.variant) {
      const wrPr = {
        name: 'w:rPr',
        type: 'element',
        elements: []
      }
      if (style.variant.includes('bold')) {
        wrPr.elements.push({ name: 'w:b', type: 'element' })
      }
      if (style.variant.includes('italic')) {
        wrPr.elements.push({ name: 'w:i', type: 'element' })
      }
      rElement.elements.push(wrPr)
      const mrPr = {
        name: 'm:rPr',
        type: 'element',
        elements: [{
          name: 'm:nor',
          type: 'element'
        }]
      }
      if (style.variant !== 'italic') {
        mrPr.elements.push({
          name: 'm:sty',
          type: 'element',
          attributes: {
            'm:val': STYLES[style.variant]
          }
        })
      }
      rElement.elements.push(mrPr)
    } else if (hasMglyphChild || textType === 'mtext') {
      rElement.elements.push({
        name: 'm:rPr',
        type: 'element',
        elements: [{
          name: 'm:nor',
          type: 'element'
        }]
      })
    } else if (
      style.fontstyle === 'normal' ||
      (
        textType === 'ms' &&
        style.fontstyle === ''
      )
    ) {
      rElement.elements.push({
        name: 'm:rPr',
        type: 'element',
        elements: [{
          name: 'm:sty',
          type: 'element',
          attributes: { 'm:val': 'p' }
        }]
      })
    }

    targetElement = {
      name: 'm:t',
      type: 'element',
      attributes: {
        'xml:space': 'preserve'
      },
      elements: []
    }
    rElement.elements.push(targetElement)
    targetParent.elements.push(rElement)
  }
  return targetElement
}

export function mtext (element, targetParent, previousSibling, nextSibling, ancestors) {
  return textContainer(element, targetParent, previousSibling, nextSibling, ancestors, 'mtext')
}

export function mi (element, targetParent, previousSibling, nextSibling, ancestors) {
  return textContainer(element, targetParent, previousSibling, nextSibling, ancestors, 'mi')
}

export function mn (element, targetParent, previousSibling, nextSibling, ancestors) {
  return textContainer(element, targetParent, previousSibling, nextSibling, ancestors, 'mn')
}

export function mo (element, targetParent, previousSibling, nextSibling, ancestors) {
  return textContainer(element, targetParent, previousSibling, nextSibling, ancestors, 'mo')
}

export function ms (element, targetParent, previousSibling, nextSibling, ancestors) {
  return textContainer(element, targetParent, previousSibling, nextSibling, ancestors, 'ms')
}
