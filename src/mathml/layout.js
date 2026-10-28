import { mrow } from './mrow.js'

export function mpadded(element, targetParent, previousSibling, nextSibling, ancestors) {
  // OMML phantoms can suppress individual dimensions without hiding content.
  // Other padding sizes and relative offsets have no direct OMML equivalent
  // and are ignored; keep the content without changing expression structure.
  const properties = []
  for (const [dimension, name] of [
    ['height', 'm:zeroAsc'],
    ['depth', 'm:zeroDesc'],
    ['width', 'm:zeroWid']
  ]) {
    if (
      /^(?:0+(?:\.0*)?|\.0+)(?:px|em|ex|pt|pc|in|cm|mm|%|width|height|depth)?$/.test(
        element.attribs?.[dimension]?.trim() || ''
      )
    ) {
      properties.push({ type: 'tag', name, attribs: { 'm:val': '1' }, children: [] })
    }
  }
  if (!properties.length) {
    return mrow(element, targetParent, previousSibling, nextSibling, ancestors)
  }
  targetParent = mrow(element, targetParent, previousSibling, nextSibling, ancestors)
  return phantom(targetParent, [
    { type: 'tag', name: 'm:show', attribs: { 'm:val': '1' }, children: [] },
    ...properties
  ])
}

export function mphantom(element, targetParent, previousSibling, nextSibling, ancestors) {
  targetParent = mrow(element, targetParent, previousSibling, nextSibling, ancestors)
  return phantom(targetParent, [
    { type: 'tag', name: 'm:show', attribs: { 'm:val': '0' }, children: [] }
  ])
}

function phantom(targetParent, properties) {
  const content = { type: 'tag', name: 'm:e', attribs: {}, children: [] }
  targetParent.children.push({
    type: 'tag',
    name: 'm:phant',
    attribs: {},
    children: [
      {
        type: 'tag',
        name: 'm:phantPr',
        attribs: {},
        children: properties
      },
      content
    ]
  })
  return content
}
