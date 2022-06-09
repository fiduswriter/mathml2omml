export function mspace(element, targetParent, previousSibling, nextSibling, ancestors) {
  targetParent.elements.push({
    name: 'm:r',
    type: 'element',
    elements: [{
      name: 'm:t',
      type: 'element',
      attributes: {
        'xml:space': 'preserve'
      },
      elements: [
        {
          type: 'text',
          text: ' '
        }
      ]
    }]
  })
  return
}
