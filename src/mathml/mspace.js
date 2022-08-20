export function mspace (element, targetParent, previousSibling, nextSibling, ancestors) {
  targetParent.children.push({
    name: 'm:r',
    type: 'tag',
    children: [{
      name: 'm:t',
      type: 'tag',
      attribs: {
        'xml:space': 'preserve'
      },
      children: [
        {
          type: 'text',
          text: ' '
        }
      ]
    }]
  })
}
