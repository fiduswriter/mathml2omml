import { walker } from '../walker'

export function mfrac (element, targetParent, previousSibling, nextSibling, ancestors) {
  if (element.elements.length !== 2) {
    // treat as mrow
    return targetParent
  }

  const numerator = element.elements[0]
  const denumerator = element.elements[1]
  const numeratorTarget = {
    name: 'm:num',
    type: 'element',
    elements: []
  }
  const denumeratorTarget = {
    name: 'm:den',
    type: 'element',
    elements: []
  }
  ancestors = [...ancestors]
  ancestors.unshift(element)
  walker(
    numerator,
    numeratorTarget,
    false,
    false,
    ancestors
  )
  walker(
    denumerator,
    denumeratorTarget,
    false,
    false,
    ancestors
  )
  const fracType = element.attributes?.linethickness === '0' ? 'noBar' : 'bar'
  targetParent.elements.push({
    type: 'element',
    name: 'm:f',
    elements: [
      {
        type: 'element',
        name: 'm:fPr',
        elements: [
          {
            type: 'element',
            name: 'm:type',
            attributes: {
              'm:val': fracType
            }
          }
        ]
      },
      numeratorTarget,
      denumeratorTarget
    ]
  })
  // Don't iterate over children in the usual way.
}
