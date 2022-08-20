import { walker } from '../walker.js'
import { getNary, getNaryTarget } from '../ooml/index.js'

export function msubsup (element, targetParent, previousSibling, nextSibling, ancestors) {
  // Sub + superscript
  if (element.elements.length !== 3) {
    // treat as mrow
    return targetParent
  }

  ancestors = [...ancestors]
  ancestors.unshift(element)

  const base = element.elements[0]
  const subscript = element.elements[1]
  const superscript = element.elements[2]

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
    topTarget = getNaryTarget(naryChar, element, 'subSup')
    element.isNary = true
  } else {
    // fallback: m:sSubSup
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
      name: 'm:sSubSup',
      elements: [
        {
          type: 'element',
          name: 'm:sSubSupPr',
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
  const superscriptTarget = {
    name: 'm:sup',
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
  walker(
    superscript,
    superscriptTarget,
    false,
    false,
    ancestors
  )
  topTarget.elements.push(subscriptTarget)
  topTarget.elements.push(superscriptTarget)
  if (element.isNary) {
    topTarget.elements.push({ type: 'element', name: 'm:e', elements: [] })
  }
  targetParent.elements.push(topTarget)
  // Don't iterate over children in the usual way.
}
