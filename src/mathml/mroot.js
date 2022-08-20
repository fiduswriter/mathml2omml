import { walker } from '../walker.js'
import { getTextContent } from '../helpers.js'

export function mroot (element, targetParent, previousSibling, nextSibling, ancestors) {
  // Root
  if (element.elements.length !== 2) {
    // treat as mrow
    return targetParent
  }
  ancestors = [...ancestors]
  ancestors.unshift(element)
  const base = element.elements[0]
  const root = element.elements[1]

  const baseTarget = {
    type: 'element',
    name: 'm:e',
    elements: []
  }
  walker(
    base,
    baseTarget,
    false,
    false,
    ancestors
  )

  const rootTarget = {
    type: 'element',
    name: 'm:deg',
    elements: []
  }
  walker(
    root,
    rootTarget,
    false,
    false,
    ancestors
  )

  const rootText = getTextContent(root)

  targetParent.elements.push({
    type: 'element',
    name: 'm:rad',
    elements: [
      {
        type: 'element',
        name: 'm:radPr',
        elements: [
          { type: 'element', name: 'm:degHide', attributes: { 'm:val': rootText.length ? 'off' : 'on' } }
        ]
      },
      rootTarget,
      baseTarget
    ]
  })
}
