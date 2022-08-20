export function msqrt (element, targetParent, previousSibling, nextSibling, ancestors) {
  const targetElement = {
    name: 'm:e',
    type: 'tag',
    children: []
  }
  targetParent.children.push({
    name: 'm:rad',
    type: 'tag',
    children: [
      {
        name: 'm:radPr',
        type: 'tag',
        children: [
          {
            name: 'm:degHide',
            type: 'tag',
            attribs: {
              'm:val': 'on'
            }
          }
        ]
      },
      {
        name: 'm:deg',
        type: 'tag'
      },
      targetElement
    ]
  })
  return targetElement
}
