export function math(element, targetParent, previousSibling, nextSibling, ancestors) {
  targetParent.name = 'm:oMath'
  targetParent.attributes = {
    'xmlns:m': 'http://schemas.openxmlformats.org/officeDocument/2006/math'
  }
  targetParent.type = 'element'
  targetParent.elements = []
  return targetParent
}

export function semantics(element, targetParent, previousSibling, nextSibling, ancestors) {
  // Ignore as default behavior
  return targetParent
}
