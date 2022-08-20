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
  const stretchy = element.attribs?.stretchy
  const grow = stretchy === 'true' ? 1 : stretchy === 'false' ? 0 : GROW_REGEXP.test(naryChar) ? 1 : 0
  return {
    type: 'tag',
    name: 'm:nary',
    children: [{
      type: 'tag',
      name: 'm:naryPr',
      children: [
        { type: 'tag', name: 'm:chr', attribs: { 'm:val': naryChar } },
        { type: 'tag', name: 'm:limLoc', attribs: { 'm:val': type } },
        { type: 'tag', name: 'm:grow', attribs: { 'm:val': grow } },
        { type: 'tag', name: 'm:subHide', attribs: { 'm:val': subHide ? 'on' : 'off' } },
        { type: 'tag', name: 'm:supHide', attribs: { 'm:val': supHide ? 'on' : 'off' } }
      ]
    }]
  }
}
