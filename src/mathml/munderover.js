import { walker } from '../walker.js'
import { getNary, getNaryTarget } from '../ooml/index.js'

export function munderover (element, targetParent, previousSibling, nextSibling, ancestors) {
  // Munderover
  if (element.elements.length !== 3) {
    // treat as mrow
    return targetParent
  }

  ancestors = [...ancestors]
  ancestors.unshift(element)

  const base = element.elements[0]
  const underscript = element.elements[1]
  const overscript = element.elements[2]

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
    const topTarget = getNaryTarget(naryChar, element, 'undOvr')
    element.isNary = true
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
      underscript,
      subscriptTarget,
      false,
      false,
      ancestors
    )
    walker(
      overscript,
      superscriptTarget,
      false,
      false,
      ancestors
    )
    topTarget.elements.push(subscriptTarget)
    topTarget.elements.push(superscriptTarget)
    topTarget.elements.push({ type: 'element', name: 'm:e', elements: [] })
    targetParent.elements.push(topTarget)
    return
  }

  // Fallback: m:limUpp()m:limlow

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

  const underscriptTarget = {
    name: 'm:lim',
    type: 'element',
    elements: []
  }
  const overscriptTarget = {
    name: 'm:lim',
    type: 'element',
    elements: []
  }

  walker(
    underscript,
    underscriptTarget,
    false,
    false,
    ancestors
  )
  walker(
    overscript,
    overscriptTarget,
    false,
    false,
    ancestors
  )
  targetParent.elements.push({
    type: 'element',
    name: 'm:limUpp',
    elements: [
      {
        type: 'element',
        name: 'm:e',
        elements: [
          {
            type: 'element',
            name: 'm:limLow',
            elements: [
              baseTarget,
              underscriptTarget
            ]
          }
        ]
      },
      overscriptTarget
    ]
  })
  // Don't iterate over children in the usual way.
}
