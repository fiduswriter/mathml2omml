import { walker } from '../walker'
import { getNary, getNaryTarget } from '../ooml'

export function msub (element, targetParent, previousSibling, nextSibling, ancestors) {
  // Subscript
  if (element.elements.length !== 2) {
    // treat as mrow
    return targetParent
  }
  ancestors = [...ancestors]
  ancestors.unshift(element)
  const base = element.elements[0]
  const subscript = element.elements[1]

  let topTarget
  //
  // m:nAry
  //
  // Conditions:
  // 1. base text must be nary operator
  // 2. no accents
  const naryChar = getNary(base)
  if (
    naryChar &&
    element.attributes?.accent?.toLowerCase() !== 'true' &&
    element.attributes?.accentunder?.toLowerCase() !== 'true'
  ) {
    topTarget = getNaryTarget(naryChar, element, 'subSup', false, true)
    element.isNary = true
  } else {
    const baseTarget = {
      name: 'm:e',
      type: 'element',
      elements: []
    }
    walker(
      base,
      baseTarget,
      false,
      false,
      ancestors
    )
    topTarget = {
      type: 'element',
      name: 'm:sSub',
      elements: [
        {
          type: 'element',
          name: 'm:sSubPr',
          elements: [{
            type: 'element',
            name: 'm:ctrlPr'
          }]
        },
        baseTarget
      ]
    }
  }

  const subscriptTarget = {
    name: 'm:sub',
    type: 'element',
    elements: []
  }

  walker(
    subscript,
    subscriptTarget,
    false,
    false,
    ancestors
  )
  topTarget.elements.push(subscriptTarget)
  if (element.isNary) {
    topTarget.elements.push({ type: 'element', name: 'm:sup' })
    topTarget.elements.push({ type: 'element', name: 'm:e', elements: [] })
  }
  targetParent.elements.push(topTarget)
  // Don't iterate over children in the usual way.
}
