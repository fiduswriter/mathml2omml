export function menclose(element, targetParent, previousSibling, nextSibling, ancestors) {
    const type = element.attributes?.notation?.split(' ')[0] || 'longdiv'

    const targetElement = {
      type: 'element',
      name: 'm:e',
      elements: []
    }

    if (type === 'longdiv') {
      targetParent.elements.push({
        type: 'element',
        name: 'm:rad',
        elements: [
          {
            type: 'element',
            name: 'm:radPr',
            elements: [
              {type: 'element', name: 'm:degHide', attributes: {'m:val': 'on'}}
            ]
          },
          {type: 'element', name: 'm:deg'},
          targetElement
        ]
      })
    } else {
      const hide = {
        t: {type: 'element', name: 'm:hideTop', attributes: {'m:val': 'on'}},
        b: {type: 'element', name: 'm:hideBot', attributes: {'m:val': 'on'}},
        l: {type: 'element', name: 'm:hideLeft', attributes: {'m:val': 'on'}},
        r: {type: 'element', name: 'm:hideRight', attributes: {'m:val': 'on'}},
      }
      const borderBoxPr = {type: 'element', name: 'm:borderBoxPr'}

      const containerElement = {
        type: 'element',
        name: 'm:borderBox'
      }
      switch(type) {
        case 'actuarial':
        case 'radical':
        case 'box':
          containerElement.elements = [targetElement]
          break
        case 'left':
        case 'roundedbox':
          borderBoxPr.elements = [hide.t, hide.b, hide.r]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'right':
        case 'circle':
          borderBoxPr.elements = [hide.t, hide.b, hide.l]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'top':
          borderBoxPr.elements = [hide.b, hide.l, hide.r]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'bottom':
          borderBoxPr.elements = [hide.t, hide.l, hide.r]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'updiagonalstrike':
          borderBoxPr.elements = [
            hide.t,
            hide.b,
            hide.l,
            hide.r,
            {type: 'element', name: 'm:strikeBLTR', attributes: {'m:val': 'on'}}
          ]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'downdiagonalstrike':
          borderBoxPr.elements = [
            hide.t,
            hide.b,
            hide.l,
            hide.r,
            {type: 'element', name: 'm:strikeTLBR', attributes: {'m:val': 'on'}}
          ]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'verticalstrike':
          borderBoxPr.elements = [
            hide.t,
            hide.b,
            hide.l,
            hide.r,
            {type: 'element', name: 'm:strikeV', attributes: {'m:val': 'on'}}
          ]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        case 'horizontalstrike':
          borderBoxPr.elements = [
            hide.t,
            hide.b,
            hide.l,
            hide.r,
            {type: 'element', name: 'm:strikeH', attributes: {'m:val': 'on'}}
          ]
          containerElement.elements = [borderBoxPr, targetElement]
          break
        default:
          borderBoxPr.elements = [
            hide.t,
            hide.b,
            hide.l,
            hide.r
          ]
          containerElement.elements = [borderBoxPr, targetElement]
          break
      }
      targetParent.elements.push(containerElement)
    }
    return targetElement
}
