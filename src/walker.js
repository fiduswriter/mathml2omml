import { addScriptlevel } from './ooml/index.js'
import * as mathmlHandlers from './mathml/index.js'

export function walker (element, targetParent, previousSibling = false, nextSibling = false, ancestors = []) {
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
  if (mathmlHandlers[element.name || element.type]) {
    targetElement = mathmlHandlers[element.name || element.type](
      element,
      targetParent,
      previousSibling,
      nextSibling,
      ancestors
    )
  } else {
    if ((element.name || element.type)) {
      console.warn(`Type not supported: ${element.name || element.type}`)
    }

    targetElement = targetParent
  }

  if (!targetElement) {
    // Target element hasn't been assigned, so don't handle children.
    return
  }
  if (element.elements?.length) {
    ancestors = [...ancestors]
    ancestors.unshift(element)
    for (let i = 0; i < element.elements.length; i++) {
      walker(
        element.elements[i],
        targetElement,
        element.elements[i - 1],
        element.elements[i + 1],
        ancestors
      )
    }
  }
}
