export function mtable(element, targetParent, previousSibling, nextSibling, ancestors) {
  const cellsPerRowCount = Math.max(...element.elements.map(row => row.elements.length))
  const targetElement = {
    name: 'm:m',
    type: 'element',
    elements: [{
      name: 'm:mPr',
      type: 'element',
      elements: [
        {
          name: 'm:baseJc',
          type: 'element',
          attributes: {
            'm:val': 'center'
          }
        },
        {
          name: 'm:plcHide',
          type: 'element',
          attributes: {
            'm:val': 'on'
          }
        },
        {
          name: 'm:mcs',
          type: 'element',
          elements: [
            {
              name: 'm:mc',
              type: 'element',
              elements: [
                {
                  name: 'm:mcPr',
                  type: 'element',
                  elements: [
                    {
                      name: 'm:count',
                      type: 'element',
                      attributes: {
                        'm:val': cellsPerRowCount
                      }
                    },
                    {
                      name: 'm:mcJc',
                      type: 'element',
                      attributes: {
                        'm:val': 'center'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }]
  }
  targetParent.elements.push(targetElement)
  return targetElement
}
