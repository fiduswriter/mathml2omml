import {addScriptlevel} from "./ooml"
import {mfrac, mmultiscripts, mroot, msub, msubsup, msup, mtable, munderover, text, underOrOver} from "./mathml"

export function walker(element, targetParent, previousSibling=false, nextSibling=false, ancestors=[]) {
  if (!previousSibling && ['m:deg', 'm:den', 'm:e', 'm:fName', 'm:lim', 'm:num', 'm:sub', 'm:sup'].includes(targetParent.name)) {
    // We are walking through the first element within one of the
    // elements where an <m:argPr> might occur. The <m:argPr> can specify
    // the scriptlevel, but it only makes sense if there is some content.
    // The fact that we are here means that there is at least one content item.
    // So we will check whether to add the m:rPr.
    // For possible parent types, see
    // https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.math.argumentproperties?view=openxml-2.8.1#remarks
    addScriptlevel(targetParent, ancestors)
  }
  let targetElement
  switch(element.name) {
    case 'math':
      targetParent.name = 'm:oMath'
      targetParent.attributes = {
        'xmlns:m': 'http://schemas.openxmlformats.org/officeDocument/2006/math'
      }
      targetParent.type = 'element'
      targetParent.elements = []
      targetElement = targetParent
      break
    case 'mglyph':
      // No support in omml. Output alt text.
      if (element.attributes && element.attributes.alt) {
        targetParent.elements.push({
          type: 'text',
          text: element.attributes.alt
        })
      }
      break
    case 'mfrac':
      targetElement = mfrac(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'mi':
    case 'mn':
    case 'mo':
    case 'ms':
    case 'mtext':
      targetElement = text(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'mroot':
      targetElement = mroot(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'mrow':
      if (previousSibling.isNary) {
        const targetSibling = targetParent.elements[targetParent.elements.length-1]
        targetElement = targetSibling.elements[targetSibling.elements.length-1]
      } else {
        // Ignore as default behavior
        targetElement = targetParent
      }
      break
    case 'mtable':
      targetElement = mtable(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'mtd':
      // table cell
      targetElement = {
        name: 'm:e',
        type: 'element',
        elements: []
      }
      targetParent.elements.push(targetElement)
      break
    case 'mtr':
      // table row
      targetElement = {
        name: 'm:mr',
        type: 'element',
        elements: []
      }
      targetParent.elements.push(targetElement)
      break
    case 'mspace':
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
      break
    case 'msub':
      targetElement = msub(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'msubsup':
      targetElement = msubsup(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'msup':
      targetElement = msup(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'mover':
      targetElement = underOrOver(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'mmultiscripts':
      targetElement = mmultiscripts(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'msqrt':
    {
      targetElement = {
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
      break
    }
    case 'mstyle':
      targetElement = targetParent
      break
    case 'munder':
      targetElement = underOrOver(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'munderover':
      targetElement = munderover(element, targetParent, previousSibling, nextSibling, ancestors)
      break
    case 'semantics':
      // Ignore as default behavior
      targetElement = targetParent
      break
    case undefined:
      targetElement = targetParent
      if (element.type === "text") {
        let text = element.text.replace(/[\u2062]|[\u200B]/g, '')
        if (ancestors.find(element => ['mi', 'mn', 'mo'].includes(element.name))) {
          text = text.replace(/\s/g, '')
        } else {
          const ms = ancestors.find(element => element.name === 'ms')
          if (ms) {
            text = (ms.attributes?.lquote || '"') + text + (ms.attributes?.rquote || '"')
          }
        }
        if (text.length) {
          if (targetParent.elements.length && targetParent.elements[targetParent.elements.length -1].type==="text") {
            targetParent.elements[targetParent.elements.length -1].text += text
          } else {
            targetParent.elements.push({
              type: 'text',
              text
            })
          }
        }
      }
      break
    default:
      console.warn(`Type not supported: ${element.name}`)
      targetElement = targetParent
      break
  }
  if (!targetElement) {
    // Target element hasn't been assigned, so don't handle children.
    return
  }
  if (element.elements?.length) {
    ancestors = [...ancestors]
    ancestors.unshift(element)
    for (let i=0; i < element.elements.length;i++) {
      walker(
        element.elements[i],
        targetElement,
        element.elements[i-1],
        element.elements[i+1],
        ancestors
      )
    }
  }
}
