import { walker } from '../walker'

export function mmultiscripts (element, targetParent, previousSibling, nextSibling, ancestors) {
  if (element.elements.length === 0) {
    // Don't use
    return
  }

  const base = element.elements[0]
  const postSubs = []
  const postSupers = []
  const preSubs = []
  const preSupers = []
  const children = element.elements.slice(1)
  let dividerFound = false
  children.forEach((child, index) => {
    if (child.name === 'mprescripts') {
      dividerFound = true
    } else if (child.name !== 'none') {
      if (index % 2) {
        if (dividerFound) {
          preSubs.push(child)
        } else {
          postSupers.push(child)
        }
      } else {
        if (dividerFound) {
          preSupers.push(child)
        } else {
          postSubs.push(child)
        }
      }
    }
  })
  ancestors = [...ancestors]
  ancestors.unshift(element)
  const tempTarget = {
    elements: []
  }
  walker(
    base,
    tempTarget,
    false,
    false,
    ancestors
  )
  let topTarget = tempTarget.elements[0]

  if (postSubs.length || postSupers.length) {
    const subscriptTarget = {
      name: 'm:sub',
      type: 'element',
      elements: []
    }
    postSubs.forEach(
      subscript => walker(
        subscript,
        subscriptTarget,
        false,
        false,
        ancestors
      )
    )

    const superscriptTarget = {
      name: 'm:sup',
      type: 'element',
      elements: []
    }

    postSupers.forEach(
      superscript => walker(
        superscript,
        superscriptTarget,
        false,
        false,
        ancestors
      )
    )

    const topPostTarget = {
      type: 'element',
      elements: [{
        type: 'element',
        name: 'm:e',
        elements: [
          topTarget
        ]
      }]
    }
    if (postSubs.length && postSupers.length) {
      topPostTarget.name = 'm:sSubSup'
      topPostTarget.elements.push(subscriptTarget)
      topPostTarget.elements.push(superscriptTarget)
    } else if (postSubs.length) {
      topPostTarget.name = 'm:sSub'
      topPostTarget.elements.push(subscriptTarget)
    } else {
      topPostTarget.name = 'm:sSup'
      topPostTarget.elements.push(superscriptTarget)
    }
    topTarget = topPostTarget
  }

  if (preSubs.length || preSupers.length) {
    const preSubscriptTarget = {
      name: 'm:sub',
      type: 'element',
      elements: []
    }
    preSubs.forEach(
      subscript => walker(
        subscript,
        preSubscriptTarget,
        false,
        false,
        ancestors
      )
    )

    const preSuperscriptTarget = {
      name: 'm:sup',
      type: 'element',
      elements: []
    }

    preSupers.forEach(
      superscript => walker(
        superscript,
        preSuperscriptTarget,
        false,
        false,
        ancestors
      )
    )
    const topPreTarget = {
      name: 'm:sPre',
      type: 'element',
      elements: [
        {
          name: 'm:e',
          type: 'element',
          elements: [
            topTarget
          ]
        },
        preSubscriptTarget,
        preSuperscriptTarget
      ]
    }
    topTarget = topPreTarget
  }
  targetParent.elements.push(topTarget)
  // Don't iterate over children in the usual way.
}
