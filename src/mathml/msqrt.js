export function msqrt(element, targetParent, previousSibling, nextSibling, ancestors) {
  const targetElement = {
    name: 'm:e',
    type: 'element',
    elements: []
  }
  targetParent.elements.push({
    name: 'm:rad',
    type: 'element',
    elements: [
      {
        name: 'm:radPr',
        type: 'element',
        elements: [
          {
            name: 'm:degHide',
            type: 'element',
            attributes: {
              'm:val': 'on'
            }
          }
        ]
      },
      {
        name: 'm:deg',
        type: 'element'
      },
      targetElement
    ]
  })
  return targetElement
}
