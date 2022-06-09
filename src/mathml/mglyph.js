export function mglyph(element, targetParent, previousSibling, nextSibling, ancestors) {
  // No support in omml. Output alt text.
  if (element.attributes && element.attributes.alt) {
    targetParent.elements.push({
      type: 'text',
      text: element.attributes.alt
    })
  }
  return
}
