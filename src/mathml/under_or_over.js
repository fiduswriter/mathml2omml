import {walker} from "../walker"
import {getNary, getNaryTarget} from "../ooml"

import {getTextContent} from "./text"

const UPPER_COMBINATION = {
  '\u2190': '\u20D6', // arrow left
  '\u27F5': '\u20D6', // arrow left, long
  '\u2192': '\u20D7', // arrow right
  '\u27F6': '\u20D7', // arrow right, long
  '\u00B4': '\u0301', // accute
  '\u02DD': '\u030B', // accute, double
  '\u02D8': '\u0306', // breve
  '\u02C7': '\u030C', // caron
  '\u00B8': '\u0312', // cedilla
  '\u005E': '\u0302', // circumflex accent
  '\u00A8': '\u0308', // diaresis
  '\u02D9': '\u0307', // dot above
  '\u0060': '\u0300', // grave accent
  '\u002D': '\u0305', // hyphen -> overline
  '\u00AF': '\u0305', // macron
  '\u2212': '\u0305', // minus -> overline
  '\u002E': '\u0307', // period -> dot above
  '\u007E': '\u0303', // tilde
  '\u02DC': '\u0303', // small tilde
}


export function underOrOver(element, targetParent, previousSibling, nextSibling, ancestors) {
  // Munder/Mover

  if (element.elements.length !== 2) {
    // treat as mrow
    return targetParent
  }
  const direction = element.name === 'munder' ? 'under' : 'over'

  ancestors = [...ancestors]
  ancestors.unshift(element)


  const base = element.elements[0]
  const script = element.elements[1]

  // Munder/Mover can be translated to ooml in different ways.

  // First we check for m:nAry.
  //
  // m:nAry
  //
  // Conditions:
  // 1. base text must be nary operator
  // 2. no accents
  const naryChar = getNary(base)

  if (
    naryChar &&
    element.attributes?.accent?.toLowerCase() !== 'true' &&
    element.attributes?.accentunder?.toLowerCase() !== 'true'
  ) {
    const topTarget = getNaryTarget(naryChar, element, 'undOvr', direction==="over", direction==="under")
    element.isNary = true

    const subscriptTarget = {
      name: 'm:sub',
      type: 'element',
      elements: []
    }
    const superscriptTarget = {
      name: 'm:sup',
      type: 'element',
      elements: []
    }
    walker(
      script,
      direction === "under" ? subscriptTarget : superscriptTarget,
      false,
      false,
      ancestors
    )
    topTarget.elements.push(subscriptTarget)
    topTarget.elements.push(superscriptTarget)
    topTarget.elements.push({type: 'element', name: 'm:e', elements:[]})
    targetParent.elements.push(topTarget)
    return
  }





  const scriptText = getTextContent(script)

  const baseTarget = {
    name: 'm:e',
    type: 'element',
    elements: []
  }
  walker(
    base,
    baseTarget,
    false,
    false,
    ancestors
  )


  //
  // m:bar
  //
  // Then we check whether it should be an m:bar.
  // This happens if:
  // 1. The script text is a single character that corresponds to
  //    \u0332/\u005F (underbar) or \u0305/\u00AF (overbar)
  // 2. The type of the script element is mo.
  if (
    (
      direction === 'under' &&
      script.name === 'mo' &&
      ['\u0332', '\u005F'].includes(scriptText)
    ) ||
    (
      direction === 'over' &&
      script.name === 'mo' &&
      ['\u0305', '\u00AF'].includes(scriptText)
    )
  ) {
    // m:bar
    targetParent.elements.push({
      type: 'element',
      name: 'm:bar',
      elements: [
        {
          type: 'element',
          name: 'm:barPr',
          elements: [{
            type: 'element',
            name: 'm:pos',
            attributes: {
              'm:val': direction === "under" ? "bot" : "top"
            }
          }]
        },
        {
          type: 'element',
          name: 'm:e',
          elements: [{
            type: 'element',
            name: direction === "under" ? 'm:sSub' : 'm:sSup',
            elements: [
              {
                type: 'element',
                name: direction === "under" ? 'm:sSubPr' : 'm:sSupPr',
                elements: [
                  {type: 'element', name: 'm:ctrlPr'}
                ]
              },
              baseTarget,
              {type:'element', name: 'm:sub'}
            ]
          }]
        }
      ]
    })
    return
  }

  // m:acc
  //
  // Next we try to see if it is an m:acc. This is the case if:
  // 1. The scriptText is 0-1 characters long.
  // 2. The script is an mo-element
  // 3. The accent is set.
  if (
    (
      direction === 'under' &&
      element.attributes?.accentunder?.toLowerCase() === 'true' &&
      script.name === 'mo' &&
      scriptText.length < 2
    ) ||
    (
      direction === 'over' &&
      element.attributes?.accent?.toLowerCase() === 'true' &&
      script.name === 'mo' &&
      scriptText.length < 2
    )
  ) {
    // m:acc
    targetParent.elements.push({
      type: 'element',
      name: 'm:acc',
      elements: [
        {
          type: 'element',
          name: 'm:accPr',
          elements: [{
            type: 'element',
            name: 'm:chr',
            attributes: {
              'm:val': UPPER_COMBINATION[scriptText] || scriptText
            }
          }]
        },
        baseTarget
      ]
    })
    return
  }
  // m:groupChr
  //
  // Now we try m:groupChr. Conditions are:
  // 1. Base is an 'mrow' and script is an 'mo'.
  // 2. Script length is 1.
  // 3. No accent
  if (
      element.attributes?.accent?.toLowerCase() !== 'true' &&
      element.attributes?.accentunder?.toLowerCase() !== 'true' &&
      script.name === 'mo' &&
      base.name === 'mrow' &&
      scriptText.length === 1
    ) {
    targetParent.elements.push({
      type: 'element',
      name: 'm:groupChr',
      elements: [
        {
          type: 'element',
          name: 'm:groupChrPr',
          elements: [{
            type: 'element',
            name: 'm:chr',
            attributes: {
              'm:val': scriptText,
              'm:pos': direction === 'under' ? 'bot' : 'top'
            }
          }]
        },
        baseTarget
      ]
    })
    return
  }
  // Fallback: m:lim


  const scriptTarget = {
    name: 'm:lim',
    type: 'element',
    elements: []
  }

  walker(
    script,
    scriptTarget,
    false,
    false,
    ancestors
  )
  targetParent.elements.push({
    type: 'element',
    name: direction === 'under' ? 'm:limLow' : 'm:limUpp',
    elements: [
      baseTarget,
      scriptTarget
    ]
  })
  // Don't iterate over children in the usual way.
  return
}
