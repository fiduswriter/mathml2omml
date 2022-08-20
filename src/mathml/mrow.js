export function mrow (element, targetParent, previousSibling, nextSibling, ancestors) {
  if (previousSibling.isNary) {
    const targetSibling = targetParent.elements[targetParent.elements.length - 1]
    return targetSibling.elements[targetSibling.elements.length - 1]
  } else {
    // Ignore as default behavior
    return targetParent
  }
}
