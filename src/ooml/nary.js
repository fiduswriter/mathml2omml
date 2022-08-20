import { getTextContent } from '../helpers.js'

const NARY_REGEXP = /^[\u220f-\u2211]|[\u2229-\u2233]|[\u22c0-\u22c3]$/
const GROW_REGEXP = /^\u220f|\u2211|[\u2229-\u222b]|\u222e|\u222f|\u2232|\u2233|[\u22c0-\u22c3]$/

export function getNary (node) {
  // Check if node contains only a nary operator.
  const text = getTextContent(node)
  if (NARY_REGEXP.test(text)) {
    return text
  } else {
    return false
  }
}

export function getNaryTarget (naryChar, element, type, subHide = false, supHide = false) {
  const stretchy = element.attributes?.stretchy
  const grow = stretchy === 'true' ? 1 : stretchy === 'false' ? 0 : GROW_REGEXP.test(naryChar) ? 1 : 0
  return {
    type: 'element',
    name: 'm:nary',
    elements: [{
      type: 'element',
      name: 'm:naryPr',
      elements: [
        { type: 'element', name: 'm:chr', attributes: { 'm:val': naryChar } },
        { type: 'element', name: 'm:limLoc', attributes: { 'm:val': type } },
        { type: 'element', name: 'm:grow', attributes: { 'm:val': grow } },
        { type: 'element', name: 'm:subHide', attributes: { 'm:val': subHide ? 'on' : 'off' } },
        { type: 'element', name: 'm:supHide', attributes: { 'm:val': supHide ? 'on' : 'off' } }
      ]
    }]
  }
}
